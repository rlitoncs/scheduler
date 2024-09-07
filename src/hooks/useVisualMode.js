import { useState } from 'react';

export const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]);

  const transition = (newMode) => {
    setHistory(prev => [...prev, newMode]);
  }

  const back = () => {
    setHistory(prev => [...prev.slice(0, prev.length - 1)])

  }

  return { mode: history[history.length - 1], transition, back }
};


