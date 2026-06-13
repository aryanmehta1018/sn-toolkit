import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Groq from 'groq-sdk';
import { z } from 'zod';
import { SYSTEM_PROMPTS } from '../prompts.js';
import { saveArtifact } from '../lib/supabase.js';

export const generateRouter = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4096,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Business Requirements:\n\n${requirements}\n\nGenerate the ${type} configuration now. Return only valid JSON.`,
        },
      ],
    });

    const rawText = completion.choices[0]?.message?.content ?? '';

    // Strip markdown fences if present
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch (jsonErr) {
      console.error('JSON parse error:', jsonErr.message);
      console.error('Raw response:', rawText.substring(0, 500));
      return res.status(502).json({
        error: 'The AI returned malformed JSON. Please try again.',
      });
    }

    // Persist to Supabase (non-blocking)
    if (sessionId) {
      saveArtifact({ type, requirements, result, sessionId }).catch(err =>
        console.error('Supabase save error:', err.message)
      );
    }

    return res.json({
      success: true,
      type,
      data: result,
      usage: {
        input_tokens: completion.usage?.prompt_tokens ?? 0,
        output_tokens: completion.usage?.completion_tokens ?? 0,
      },
    });
  } catch (err) {
    console.error('Groq API error:', err?.message ?? err);
    return res.status(502).json({
      error: `AI service error: ${err?.message ?? 'Unknown error'}`,
    });
  }
});
