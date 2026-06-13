import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api.js';

export function useGenerate(sessionId) {
  const [state, setState] = useState({
    loading: false,
    activeType: null,
    results: {},
    errors: {},
  });

  const generate = useCallback(
    async (type, requirements) => {
      if (!requirements.trim() || requirements.trim().length < 20) {
        toast.error('Requirements must be at least 20 characters.');
        return;
      }

      setState((s) => ({
        ...s,
        loading: true,
        activeType: type,
        errors: { ...s.errors, [type]: null },
      }));

      const toastId = toast.loading(`Generating ${type}…`);

      try {
        const res = await api.generate({ type, requirements, sessionId });

        setState((s) => ({
          ...s,
          loading: false,
          activeType: null,
          results: { ...s.results, [type]: res.data },
        }));

        toast.success(`${capitalize(type)} generated!`, { id: toastId });
        return res.data;
      } catch (err) {
        const msg = err.message || 'Generation failed. Please try again.';
        setState((s) => ({
          ...s,
          loading: false,
          activeType: null,
          errors: { ...s.errors, [type]: msg },
        }));
        toast.error(msg, { id: toastId });
      }
    },
    [sessionId]
  );

  const clearResult = useCallback((type) => {
    setState((s) => ({
      ...s,
      results: { ...s.results, [type]: null },
    }));
  }, []);

  return { ...state, generate, clearResult };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
