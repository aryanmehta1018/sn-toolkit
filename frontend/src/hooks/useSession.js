import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'sn_toolkit_session';

export function useSession() {
  const [sessionId] = useState(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const id = uuidv4();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  });

  return sessionId;
}
