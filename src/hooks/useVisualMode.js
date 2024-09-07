import { useState } from 'react';

export const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);

  const transition = (newMode) => {
    setMode(newMode)
  }

  return { mode, transition }
};


