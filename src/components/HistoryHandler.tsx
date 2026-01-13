import { useHistoryActions } from '@/stores';
import { useEffect } from 'react';

export const HistoryHandler = () => {
  const { undo, redo } = useHistoryActions();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          console.log('1212112211221');
          undo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return null;
};
