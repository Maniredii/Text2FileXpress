import React from 'react';
import {
    Bold, Italic, Underline, Hash, Sparkles, Share2, Save,
    Table, Code, Maximize, Heading1, Heading2, Heading3, Image as ImageIcon
} from 'lucide-react';
import type { Alignment } from '../types';

interface EditorToolbarProps {
    darkMode: boolean;
    fontSize: number;
    lineSpacing: number;
    fontFamily: string;
    addPageNumbers: boolean;
    focusMode: boolean;
    onFontSizeChange: (size: number) => void;
    onLineSpacingChange: (spacing: number) => void;
    onFontFamilyChange: (family: string) => void;
    onTogglePageNumbers: () => void;
    onApplyFormatting: (type: string) => void;
    onInsertHeading: (level: number) => void;
    onInsertList: (type: 'bullet' | 'numbered') => void;
    onChangeCase: (caseType: 'upper' | 'lower' | 'title') => void;
    onInsertLink: () => void;
    onInsertImage: () => void;
    onShowFindReplace: () => void;
    onSummarize: () => void;
    onAutoDetectHeadings: () => void;
    onShowTableEditor: () => void;
    onInsertCodeBlock: () => void;
    onInsertBlockQuote: () => void;
    onInsertHorizontalRule: () => void;
    onGenerateQRCode: () => void;
    onShowPresetManager: () => void;
    onShowDraftManager: () => void;
    onToggleFocusMode: () => void;
    onToggleFullScreen: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
    darkMode,
    fontSize,
    lineSpacing,
    fontFamily,
    addPageNumbers,
    focusMode,
    onFontSizeChange,
    onLineSpacingChange,
    onFontFamilyChange,
    onTogglePageNumbers,
    onApplyFormatting,
    onInsertHeading,
    onInsertList,
    onChangeCase,
    onInsertLink,
    onInsertImage,
    onShowFindReplace,
    onSummarize,
    onAutoDetectHeadings,
    onShowTableEditor,
    onInsertCodeBlock,
    onInsertBlockQuote,
    onInsertHorizontalRule,
    onGenerateQRCode,
    onShowPresetManager,
    onShowDraftManager,
    onToggleFocusMode,
    onToggleFullScreen,
}) => {
    return (
        <>
            {/* Quick Action Buttons Row */}
            <div className="flex items-center gap-2 flex-wrap mb-2 overflow-x-auto pb-1 scrollbar-thin">
                {/* Headings */}
                <div className="flex gap-1 border-r pr-2 border-gray-400">
                    <button onClick={() => onInsertHeading(1)} className={`px-2 py-1 text-xs rounded font-bold ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Heading 1">H1</button>
                    <button onClick={() => onInsertHeading(2)} className={`px-2 py-1 text-xs rounded font-bold ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Heading 2">H2</button>
                    <button onClick={() => onInsertHeading(3)} className={`px-2 py-1 text-xs rounded font-bold ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Heading 3">H3</button>
                </div>

                {/* Lists */}
                <div className="flex gap-1 border-r pr-2 border-gray-400">
                    <button onClick={() => onInsertList('bullet')} className={`px-2 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Bullet List">• List</button>
                    <button onClick={() => onInsertList('numbered')} className={`px-2 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Numbered List">1. List</button>
                </div>

                {/* Text Case */}
                <div className="flex gap-1 border-r pr-2 border-gray-400">
                    <button onClick={() => onChangeCase('upper')} className={`px-2 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="UPPERCASE">AA</button>
                    <button onClick={() => onChangeCase('lower')} className={`px-2 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="lowercase">aa</button>
                    <button onClick={() => onChangeCase('title')} className={`px-2 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Title Case">Aa</button>
                </div>

                {/* Insert Link & Image */}
                <div className="flex gap-1 border-r pr-2 border-gray-400">
                    <button onClick={onInsertLink} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-blue-900' : 'hover:bg-blue-100 bg-blue-50'} text-blue-600 dark:text-blue-300`} title="Insert Link">
                        <span className="text-sm">🔗</span> Link
                    </button>
                    <button onClick={onInsertImage} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-blue-900' : 'hover:bg-blue-100 bg-blue-50'} text-blue-600 dark:text-blue-300`} title="Insert Image">
                        <ImageIcon className="w-3 h-3" /> Image
                    </button>
                </div>

                {/* Find & Replace */}
                <button onClick={onShowFindReplace} className={`px-3 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600 bg-purple-900' : 'hover:bg-purple-100 bg-purple-50'} text-purple-600 dark:text-purple-300`} title="Find & Replace">🔍 Find</button>

                {/* AI Tools */}
                <div className="flex gap-1 border-r pr-2 border-gray-400">
                    <button onClick={onSummarize} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-indigo-900' : 'hover:bg-indigo-100 bg-indigo-50'} text-indigo-600 dark:text-indigo-300`} title="AI Summarize">
                        <Sparkles className="w-3 h-3" /> Summarize
                    </button>
                    <button onClick={onAutoDetectHeadings} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-indigo-900' : 'hover:bg-indigo-100 bg-indigo-50'} text-indigo-600 dark:text-indigo-300`} title="Auto-detect Headings">
                        <Hash className="w-3 h-3" /> Auto H
                    </button>
                </div>

                {/* Advanced Formatting */}
                <div className="flex gap-1 border-r pr-2 border-gray-400">
                    <button onClick={onShowTableEditor} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Insert Table">
                        <Table className="w-3 h-3" /> Table
                    </button>
                    <button onClick={onInsertCodeBlock} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Insert Code Block">
                        <Code className="w-3 h-3" /> Code
                    </button>
                    <button onClick={onInsertBlockQuote} className={`px-3 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Insert Quote">
                        " Quote
                    </button>
                    <button onClick={onInsertHorizontalRule} className={`px-3 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Horizontal Rule">
                        ─ HR
                    </button>
                </div>

                {/* Sharing & Presets & Drafts */}
                <div className="flex gap-1 border-r pr-2 border-gray-400">
                    <button onClick={onGenerateQRCode} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-green-900' : 'hover:bg-green-100 bg-green-50'} text-green-600 dark:text-green-300`} title="Generate QR Code">
                        <Share2 className="w-3 h-3" /> Share
                    </button>
                    <button onClick={onShowPresetManager} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-orange-900' : 'hover:bg-orange-100 bg-orange-50'} text-orange-600 dark:text-orange-300`} title="Manage Presets">
                        <Save className="w-3 h-3" /> Presets
                    </button>
                    <button onClick={onShowDraftManager} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-blue-900' : 'hover:bg-blue-100 bg-blue-50'} text-blue-600 dark:text-blue-300`} title="Manage Drafts">
                        <Save className="w-3 h-3" /> Drafts
                    </button>
                </div>

                {/* Focus Mode */}
                <button onClick={onToggleFocusMode} className={`px-3 py-1 text-xs rounded ${focusMode ? 'bg-green-600 text-white' : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200')}`} title="Focus Mode">
                    {focusMode ? '👁️ Exit Focus' : '🎯 Focus'}
                </button>

                {/* Full Screen */}
                <button onClick={onToggleFullScreen} className={`px-3 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Full Screen">
                    <Maximize className="w-4 h-4 inline mr-1" /> Full Screen
                </button>
            </div>

            {/* Formatting Toolbar */}
            <div className={`flex flex-wrap items-center gap-2 mb-2 p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <select
                    value={fontFamily}
                    onChange={(e) => onFontFamilyChange(e.target.value)}
                    className={`h-9 text-sm rounded-md border-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}`}
                    title="Font Family"
                    style={{ fontFamily: fontFamily }}
                >
                    <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
                    <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
                    <option value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</option>
                    <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                    <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
                    <option value="Trebuchet MS" style={{ fontFamily: 'Trebuchet MS' }}>Trebuchet MS</option>
                    <option value="Tahoma" style={{ fontFamily: 'Tahoma' }}>Tahoma</option>
                    <option value="Palatino Linotype" style={{ fontFamily: 'Palatino Linotype' }}>Palatino</option>
                </select>

                <select
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(Number(e.target.value))}
                    className={`h-9 text-sm rounded-md border-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}`}
                    title="Font Size"
                >
                    <option value={10}>10pt</option>
                    <option value={11}>11pt</option>
                    <option value={12}>12pt</option>
                    <option value={14}>14pt</option>
                    <option value={16}>16pt</option>
                    <option value={18}>18pt</option>
                    <option value={20}>20pt</option>
                    <option value={24}>24pt</option>
                    <option value={28}>28pt</option>
                    <option value={32}>32pt</option>
                    <option value={36}>36pt</option>
                </select>

                <select
                    value={lineSpacing}
                    onChange={(e) => onLineSpacingChange(Number(e.target.value))}
                    className={`h-9 text-sm rounded-md border-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}`}
                    title="Line Spacing"
                >
                    <option value={1}>Single</option>
                    <option value={1.15}>1.15</option>
                    <option value={1.5}>1.5</option>
                    <option value={2}>Double</option>
                    <option value={2.5}>2.5</option>
                    <option value={3}>Triple</option>
                </select>

                <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

                <button
                    onClick={() => onApplyFormatting('bold')}
                    className={`p-2 rounded hover:bg-opacity-80 transition-all ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onApplyFormatting('italic')}
                    className={`p-2 rounded hover:bg-opacity-80 transition-all ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onApplyFormatting('underline')}
                    className={`p-2 rounded hover:bg-opacity-80 transition-all ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Underline (Ctrl+U)"
                >
                    <Underline className="w-4 h-4" />
                </button>
                <button
                    onClick={onTogglePageNumbers}
                    className={`p-2 rounded hover:bg-opacity-80 transition-all ${addPageNumbers ? (darkMode ? 'bg-gray-600' : 'bg-gray-200') : ''} ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Toggle Page Numbers"
                >
                    <Hash className="w-4 h-4" />
                </button>
                <div className={`ml-2 px-3 py-1 text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select text and click a button to format
                </div>
            </div>
        </>
    );
};

export default EditorToolbar;
