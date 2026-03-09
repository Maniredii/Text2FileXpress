import React from 'react';
import { Copy } from 'lucide-react';
import type { TextStats } from '../types';

interface EditorStatsProps {
    darkMode: boolean;
    stats: TextStats;
    canUndo: boolean;
    canRedo: boolean;
    wordGoal: number;
    onWordGoalChange: (goal: number) => void;
    onUndo: () => void;
    onRedo: () => void;
    onCopy: () => void;
    onClear: () => void;
}

const EditorStats: React.FC<EditorStatsProps> = ({
    darkMode,
    stats,
    canUndo,
    canRedo,
    wordGoal,
    onWordGoalChange,
    onUndo,
    onRedo,
    onCopy,
    onClear,
}) => {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* Text Statistics */}
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-3`}>
                <span>{stats.words} words</span>
                <span>•</span>
                <span>{stats.chars} chars</span>
                <span>•</span>
                <span>{stats.paragraphs} ¶</span>
                <span>•</span>
                <span>{stats.sentences} sentences</span>
                {stats.readingTime > 0 && (
                    <>
                        <span>•</span>
                        <span>~{stats.readingTime} min read</span>
                    </>
                )}
            </div>

            {/* Undo / Redo / Copy / Clear */}
            <div className="flex items-center gap-1">
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Undo (Ctrl+Z)"
                >
                    ↶
                </button>
                <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Redo (Ctrl+Y)"
                >
                    ↷
                </button>
                <button onClick={onCopy} className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`} title="Copy to clipboard">
                    <Copy className="w-3 h-3" /> Copy
                </button>
                <button onClick={onClear} className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-red-900 hover:bg-red-800 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'}`} title="Clear all text">
                    Clear
                </button>
            </div>

            {/* Word Goal Progress */}
            <div className="flex items-center gap-2 ml-auto">
                <input
                    type="number"
                    placeholder="Word goal"
                    value={wordGoal || ''}
                    onChange={(e) => onWordGoalChange(Number(e.target.value))}
                    className={`w-24 px-2 py-1 text-xs rounded border ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'border-gray-300'}`}
                />
                {wordGoal > 0 && (
                    <div className="flex items-center gap-1">
                        <div className="w-20 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${stats.words >= wordGoal ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min((stats.words / wordGoal) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <span className="text-xs">{Math.round((stats.words / wordGoal) * 100)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditorStats;
