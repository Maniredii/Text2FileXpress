import React from 'react';
import { BookOpen } from 'lucide-react';

interface SidebarTemplatesProps {
    darkMode: boolean;
    onLoadTemplate: (templateKey: string) => void;
}

const SidebarTemplates: React.FC<SidebarTemplatesProps> = ({ darkMode, onLoadTemplate }) => {
    return (
        <div className="w-full md:w-64 flex-shrink-0">
            <div className={`p-4 rounded-xl border sticky top-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Letter Types</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <p className={`text-xs font-medium mb-2 uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Academic</p>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => onLoadTemplate('blank')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Blank Document</button>
                            <button onClick={() => onLoadTemplate('essay')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Essay</button>
                            <button onClick={() => onLoadTemplate('report')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Report</button>
                            <button onClick={() => onLoadTemplate('assignment')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Assignment</button>
                        </div>
                    </div>

                    <div>
                        <p className={`text-xs font-medium mb-2 uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Professional Letters</p>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => onLoadTemplate('formalLetter')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Formal Letter</button>
                            <button onClick={() => onLoadTemplate('coverLetter')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Cover Letter</button>
                            <button onClick={() => onLoadTemplate('requestLetter')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Request Letter</button>
                            <button onClick={() => onLoadTemplate('recommendationRequest')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Recommendation</button>
                            <button onClick={() => onLoadTemplate('complaintLetter')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Complaint</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarTemplates;
