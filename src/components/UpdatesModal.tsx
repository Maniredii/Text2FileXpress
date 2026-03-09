import React from 'react';
import { X, Calendar, Activity } from 'lucide-react';

interface UpdateItem {
    version?: string;
    date: string;
    title: string;
    changes: string[];
}

const UPDATES: UpdateItem[] = [
    {
        version: '2.0.0',
        date: 'March 9, 2026',
        title: 'Major Feature Update & UI Polish',
        changes: [
            'Added Multiple Drafts management: You can now save, name, and seamlessly load between multiple work-in-progress drafts natively in your browser.',
            'Implemented native client-side PDF password encryption for ultimate data privacy.',
            'Added Image insertion support `![alt text](url)` built right into the markdown preview engine.',
            'Brought more typography flexibility: added new fonts (Verdana, Trebuchet MS, Tahoma, Palatino) and font sizes up to 36pt.',
            'Rebuilt underlying text engine to intelligently toggle markdown formatting on & off, preventing double-formatting.',
        ]
    },
    {
        version: '1.5.0',
        date: 'March 8, 2026',
        title: 'UX Improvements & Editor Splitting',
        changes: [
            'Introduced Live Markdown Preview split-pane, allowing real-time render checking of MD syntax.',
            'Added drag-and-drop support: you can now seamlessly drop `.txt` and `.md` files directly onto the editor.',
            'Fixed the font family picker to properly restyle the editor and preview components.',
            'Re-engineered toolbars to be fully mobile-responsive with horizontal scrolling.',
            'Replaced obtrusive alerts with non-blocking, elegant Toast notifications.',
            'Added direct Heading hierarchy insert buttons (H1/H2/H3).'
        ]
    },
    {
        version: '1.1.0',
        date: 'March 7, 2026',
        title: 'Performance & Structural Refactoring',
        changes: [
            'Performed massive architectural refactoring to split generic monolithic logic into targeted custom hooks (`useDrafts`, `usePDFGenerator`, `useAutoSave`).',
            'Extracted templates into their own dedicated configuration module.',
        ]
    },
    {
        version: '1.0.0',
        date: 'March 5, 2026',
        title: 'Initial Release',
        changes: [
            'Launched MVP of Text2FileXpress application.',
            'Implemented basic PDF and DOCX exporting functionalities.',
            'Added standard Word & Character counters.'
        ]
    }
];

interface UpdatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    darkMode?: boolean;
}

const UpdatesModal: React.FC<UpdatesModalProps> = ({ isOpen, onClose, darkMode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
            <div
                className={`w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="w-6 h-6 text-indigo-500" />
                        Release Notes
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content list */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
                    {UPDATES.map((update, index) => (
                        <div key={index} className="relative">
                            {/* Timeline dot and line (desktop only) */}
                            <div className="hidden md:block absolute left-0 top-1.5 bottom-[-2rem] w-px bg-indigo-200 dark:bg-indigo-900 last:hidden"></div>
                            <div className="hidden md:flex absolute left-[-0.3rem] top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-gray-800"></div>

                            <div className="md:pl-8">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {update.title} {update.version && <span className="text-sm font-medium px-2 py-0.5 ml-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full">v{update.version}</span>}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {update.date}
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {update.changes.map((change, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-indigo-500 mr-2 mt-1.5 text-xs">●</span>
                                            <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: change.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono text-xs text-pink-500">$1</code>') }}></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t text-center ${darkMode ? 'border-gray-700 bg-gray-850' : 'border-gray-200 bg-gray-50'}`}>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm w-full sm:w-auto"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdatesModal;
