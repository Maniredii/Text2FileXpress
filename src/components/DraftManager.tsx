import React, { useState } from 'react';
import { FileEdit, Trash2, X, Plus } from 'lucide-react';
import type { Draft } from '../hooks/useDrafts';

interface DraftManagerProps {
    isOpen: boolean;
    onClose: () => void;
    drafts: Draft[];
    currentText: string;
    onLoadDraft: (draft: Draft) => void;
    onSaveNewDraft: (text: string) => void;
    onDeleteDraft: (id: string) => void;
    onRenameDraft: (id: string, newName: string) => void;
}

const DraftManager: React.FC<DraftManagerProps> = ({
    isOpen,
    onClose,
    drafts,
    currentText,
    onLoadDraft,
    onSaveNewDraft,
    onDeleteDraft,
    onRenameDraft
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    if (!isOpen) return null;

    const handleRenameSubmit = (id: string) => {
        if (editName.trim()) {
            onRenameDraft(id, editName.trim());
        }
        setEditingId(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileEdit className="w-5 h-5 text-indigo-500" />
                        Manage Drafts
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <button
                        onClick={() => onSaveNewDraft(currentText)}
                        disabled={!currentText.trim()}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium mb-6 transition-all ${!currentText.trim() ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                    >
                        <Plus className="w-5 h-5" />
                        Save Current as New Draft
                    </button>

                    {drafts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <FileEdit className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No drafts saved yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                            {drafts.map(draft => (
                                <div key={draft.id} className="flex flex-col gap-2 p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                                    {editingId === draft.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleRenameSubmit(draft.id);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                                className="flex-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                autoFocus
                                            />
                                            <button onClick={() => handleRenameSubmit(draft.id)} className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded">Save</button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-sm" onDoubleClick={() => {
                                                    setEditingId(draft.id);
                                                    setEditName(draft.name);
                                                }}>
                                                    {draft.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {new Date(draft.updatedAt).toLocaleString()} • {draft.text.length} chars
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => onLoadDraft(draft)}
                                                    className="px-3 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-300 rounded font-medium transition-colors"
                                                >
                                                    Load
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Delete this draft?')) {
                                                            onDeleteDraft(draft.id);
                                                        }
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                                                    title="Delete draft"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DraftManager;
