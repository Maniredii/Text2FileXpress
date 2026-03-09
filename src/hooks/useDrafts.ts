import { useState, useCallback, useEffect } from 'react';

export interface Draft {
    id: string;
    name: string;
    text: string;
    updatedAt: number;
}

const DRAFTS_KEY = 'text2filexpress_drafts';

export const useDrafts = () => {
    const [drafts, setDrafts] = useState<Draft[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(DRAFTS_KEY);
            if (stored) {
                setDrafts(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load drafts', e);
        }
    }, []);

    const saveDraft = useCallback((text: string, currentId?: string): string => {
        const now = Date.now();
        let newDrafts = [...drafts];
        let savedId = currentId;

        if (savedId) {
            const index = newDrafts.findIndex(d => d.id === savedId);
            if (index >= 0) {
                newDrafts[index] = { ...newDrafts[index], text, updatedAt: now };
            } else {
                // ID not found, create new
                savedId = now.toString();
                newDrafts.push({
                    id: savedId,
                    name: `Draft ${new Date(now).toLocaleString()}`,
                    text,
                    updatedAt: now
                });
            }
        } else {
            savedId = now.toString();
            newDrafts.push({
                id: savedId,
                name: `Draft ${new Date(now).toLocaleString()}`,
                text,
                updatedAt: now
            });
        }

        setDrafts(newDrafts);
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(newDrafts));
        return savedId;
    }, [drafts]);

    const loadDraft = useCallback((id: string): Draft | null => {
        return drafts.find(d => d.id === id) || null;
    }, [drafts]);

    const deleteDraft = useCallback((id: string) => {
        const newDrafts = drafts.filter(d => d.id !== id);
        setDrafts(newDrafts);
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(newDrafts));
    }, [drafts]);

    const renameDraft = useCallback((id: string, newName: string) => {
        const newDrafts = drafts.map(d => d.id === id ? { ...d, name: newName } : d);
        setDrafts(newDrafts);
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(newDrafts));
    }, [drafts]);

    return { drafts, saveDraft, loadDraft, deleteDraft, renameDraft };
};
