const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export const api = {
  generate: ({ type, requirements, sessionId }) =>
    request('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ type, requirements, sessionId }),
    }),

  getArtifacts: (sessionId) => request(`/api/artifacts/${sessionId}`),

  deleteArtifact: (id) => request(`/api/artifacts/${id}`, { method: 'DELETE' }),

  health: () => request('/health'),
};
