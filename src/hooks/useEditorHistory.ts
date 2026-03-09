import { useState, useCallback } from 'react';

const MAX_HISTORY = 50;

export const useEditorHistory = (initialText: string = '') => {
    const [history, setHistory] = useState<string[]>([initialText]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const pushHistory = useCallback((text: string) => {
        setHistory(prev => {
            const current = prev[historyIndex];
            if (text === current) return prev;

            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push(text);
            if (newHistory.length > MAX_HISTORY) newHistory.shift();

            setHistoryIndex(newHistory.length - 1);
            return newHistory;
        });
    }, [historyIndex]);

    const undo = useCallback((): string | null => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            return history[newIndex];
        }
        return null;
    }, [historyIndex, history]);

    const redo = useCallback((): string | null => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            return history[newIndex];
        }
        return null;
    }, [historyIndex, history]);

    const reset = useCallback(() => {
        setHistory(['']);
        setHistoryIndex(0);
    }, []);

    return {
        undo,
        redo,
        pushHistory,
        reset,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
    };
};
