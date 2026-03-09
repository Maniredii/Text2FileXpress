import React from 'react';
import { FileText, FileType, Download, Copy } from 'lucide-react';

interface ActionButtonsProps {
    hasText: boolean;
    isGenerating: boolean;
    onGeneratePDF: () => void;
    onGenerateDOCX: () => void;
    onDownloadTXT: () => void;
    onCopyToClipboard: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    hasText,
    isGenerating,
    onGeneratePDF,
    onGenerateDOCX,
    onDownloadTXT,
    onCopyToClipboard,
}) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <button
                onClick={onGeneratePDF}
                disabled={!hasText || isGenerating}
                className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${(!hasText || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <FileText className="w-5 h-5 mr-2" />
                PDF
            </button>

            <button
                onClick={onGenerateDOCX}
                disabled={!hasText || isGenerating}
                className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${(!hasText || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <FileType className="w-5 h-5 mr-2" />
                DOCX
            </button>

            <button
                onClick={onDownloadTXT}
                disabled={!hasText}
                className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${!hasText ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <Download className="w-5 h-5 mr-2" />
                TXT
            </button>

            <button
                onClick={onCopyToClipboard}
                disabled={!hasText}
                className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${!hasText ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <Copy className="w-5 h-5 mr-2" />
                Copy
            </button>
        </div>
    );
};

export default ActionButtons;
