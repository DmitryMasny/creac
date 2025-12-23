import { useHistoryActions } from '@/stores/useAppStore';
import { useEffect } from 'react';

export const HistoryHandler = () => {
  const { undo, redo } = useHistoryActions();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return null;
};
