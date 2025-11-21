import React from 'react';
import { X, Copy, Mail, Share2, Check } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    qrCodeDataUrl: string;
    documentName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, qrCodeDataUrl, documentName }) => {
    const [copied, setCopied] = React.useState(false);

    if (!isOpen) return null;

    const handleCopyQR = async () => {
        try {
            // Copy QR code data URL to clipboard
            await navigator.clipboard.writeText(qrCodeDataUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: documentName,
                    text: `Check out my document: ${documentName}`,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Document</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* QR Code Display */}
                    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Scan to access document</p>
                        {qrCodeDataUrl && (
                            <img src={qrCodeDataUrl} alt="QR Code" className="w-48 h-48 border-4 border-white rounded-lg" />
                        )}
                        <button
                            onClick={handleCopyQR}
                            className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy QR Code'}
                        </button>
                    </div>

                    {/* Share Options */}
                    <div className="grid grid-cols-2 gap-3">
                        {navigator.share && (
                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Share2 size={18} />
                                Share
                            </button>
                        )}
                        <button
                            onClick={() => {
                                window.location.href = `mailto:?subject=${encodeURIComponent(documentName)}&body=${encodeURIComponent('Please find the attached document.')}`;
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Mail size={18} />
                            Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
