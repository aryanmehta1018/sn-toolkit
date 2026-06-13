import { Router } from 'express';
import { getArtifacts, deleteArtifact } from '../lib/supabase.js';

export const artifactsRouter = Router();

artifactsRouter.get('/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  try {
    const artifacts = await getArtifacts(sessionId);
    res.json({ artifacts });
  } catch (err) {
    console.error('Fetch artifacts error:', err.message);
    res.status(500).json({ error: 'Failed to fetch artifacts' });
  }
});

artifactsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteArtifact(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete artifact error:', err.message);
    res.status(500).json({ error: 'Failed to delete artifact' });
  }
});
