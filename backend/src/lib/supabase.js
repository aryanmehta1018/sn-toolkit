import { createClient } from '@supabase/supabase-js';

let supabase = null;

function getClient() {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    console.warn('⚠️  Supabase credentials missing — history persistence disabled');
    return null;
  }

  supabase = createClient(url, key);
  return supabase;
}

export async function saveArtifact({ type, requirements, result, sessionId }) {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from('artifacts')
    .insert({
      session_id: sessionId,
      type,
      requirements,
      result,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getArtifacts(sessionId) {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from('artifacts')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteArtifact(id) {
  const client = getClient();
  if (!client) return;

  const { error } = await client.from('artifacts').delete().eq('id', id);
  if (error) throw error;
}
