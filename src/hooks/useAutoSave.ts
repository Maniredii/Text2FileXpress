import { useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'text2filexpress_';

interface AutoSaveData {
    text: string;
    filename: string;
    fontSize: number;
    darkMode: boolean;
}

/**
 * Hook that manages auto-saving and loading drafts from localStorage.
 * Saves are debounced by 2 seconds.
 */
export const useAutoSave = (data: AutoSaveData) => {
    const { text, filename, fontSize, darkMode } = data;

    // Auto-save with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem(`${STORAGE_PREFIX}draft`, text);
            localStorage.setItem(`${STORAGE_PREFIX}filename`, filename);
            localStorage.setItem(`${STORAGE_PREFIX}fontsize`, fontSize.toString());
            localStorage.setItem(`${STORAGE_PREFIX}darkmode`, darkMode.toString());
        }, 2000);
        return () => clearTimeout(timer);
    }, [text, filename, fontSize, darkMode]);

    const clearDraft = useCallback(() => {
        localStorage.removeItem(`${STORAGE_PREFIX}draft`);
    }, []);

    return { clearDraft };
};

/**
 * Load saved draft data from localStorage.
 * Call this once on mount to restore the previous session.
 */
export const loadSavedDraft = (): Partial<AutoSaveData> => {
    const result: Partial<AutoSaveData> = {};

    const savedText = localStorage.getItem(`${STORAGE_PREFIX}draft`);
    const savedFilename = localStorage.getItem(`${STORAGE_PREFIX}filename`);
    const savedFontSize = localStorage.getItem(`${STORAGE_PREFIX}fontsize`);
    const savedDarkMode = localStorage.getItem(`${STORAGE_PREFIX}darkmode`);

    if (savedText) result.text = savedText;
    if (savedFilename) result.filename = savedFilename;
    if (savedFontSize) result.fontSize = parseInt(savedFontSize);
    if (savedDarkMode) result.darkMode = savedDarkMode === 'true';

    return result;
};
