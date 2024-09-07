import { useState } from 'react';

export const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    !replace && setHistory(prev => [...prev, newMode]);

    replace && setHistory(prev => [...prev.slice(0, prev.length - 1), newMode])
  }

  const back = () => {
    history.length > 1 &&
    setHistory(prev => [...prev.slice(0, prev.length - 1)])

  }

  return { mode: history[history.length - 1], transition, back }
};


