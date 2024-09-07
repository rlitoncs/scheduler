import { useState } from 'react';

export const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);

  return {
    mode
  }
};


