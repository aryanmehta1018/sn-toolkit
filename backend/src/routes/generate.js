import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { SYSTEM_PROMPTS } from '../prompts.js';
import { saveArtifact } from '../lib/supabase.js';

export const generateRouter = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Too many requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GenerateSchema = z.object({
  type: z.enum(['tables', 'flows', 'catalog', 'acl']),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters').max(4000),
  sessionId: z.string().optional(),
});

generateRouter.post('/', limiter, async (req, res) => {
  const parsed = GenerateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { type, requirements, sessionId } = parsed.data;
  const systemPrompt = SYSTEM_PROMPTS[type];

  if (!systemPrompt) {
    return res.status(400).json({ error: 'Unknown generation type' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Business Requirements:\n\n${requirements}\n\nGenerate the ${type} configuration now. Return only valid JSON.`,
        },
      ],
    });

    const rawText = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    // Strip markdown fences if present
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let parsed_result;
    try {
      parsed_result = JSON.parse(cleaned);
    } catch (jsonErr) {
      console.error('JSON parse error:', jsonErr.message);
      console.error('Raw response:', rawText.substring(0, 500));
      return res.status(502).json({
        error: 'The AI returned malformed JSON. Please try again.',
      });
    }

    // Persist to Supabase (non-blocking — don't fail the request if DB write fails)
    if (sessionId) {
      saveArtifact({ type, requirements, result: parsed_result, sessionId }).catch(err =>
        console.error('Supabase save error:', err.message)
      );
    }

    return res.json({
      success: true,
      type,
      data: parsed_result,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`Anthropic API error ${err.status}:`, err.message);
      return res.status(502).json({
        error: `AI service error: ${err.message}`,
      });
    }
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
