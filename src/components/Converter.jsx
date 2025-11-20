import React, { useState } from 'react';
import { FileText, FileType, Download, FileCode } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const Converter = () => {
    const [text, setText] = useState('');
    const [filename, setFilename] = useState('output');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGeneratePDF = () => {
        if (!text) return;
        setIsGenerating(true);
        try {
            const doc = new jsPDF();

            // Split text to fit page width
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const maxLineWidth = pageWidth - (margin * 2);
            const lineHeight = 7;

            doc.setFontSize(12);
            const splitText = doc.splitTextToSize(text, maxLineWidth);

            let cursorY = margin;

            splitText.forEach(line => {
                if (cursorY + lineHeight > pageHeight - margin) {
                    doc.addPage();
                    cursorY = margin;
                }
                doc.text(line, margin, cursorY);
                cursorY += lineHeight;
            });

            doc.save(`${filename}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateDOCX = async () => {
        if (!text) return;
        setIsGenerating(true);
        try {
            const paragraphs = text.split('\n').map(line => {
                return new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                            size: 24, // 12pt
                        }),
                    ],
                });
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: paragraphs,
                }],
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${filename}.docx`);
        } catch (error) {
            console.error('Error generating DOCX:', error);
            alert('Failed to generate DOCX');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-2">
                        Text to PDF / DOCX
                    </h1>
                    <p className="text-lg text-gray-600">
                        Convert your raw text into professional documents instantly.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8">

                        {/* Filename Input */}
                        <div className="mb-6">
                            <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-2">
                                Filename (without extension)
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    id="filename"
                                    className="block w-full rounded-lg border-gray-300 pl-4 pr-12 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                                    placeholder="output"
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-400 sm:text-sm">.pdf / .docx</span>
                                </div>
                            </div>
                        </div>

                        {/* Text Input */}
                        <div className="mb-8">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Content
                            </label>
                            <textarea
                                id="content"
                                rows={15}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 border resize-y font-mono text-gray-800"
                                placeholder="Type or paste your text here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleGeneratePDF}
                                disabled={!text || isGenerating}
                                className={`flex-1 flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${(!text || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <FileText className="w-6 h-6 mr-2" />
                                {isGenerating ? 'Generating...' : 'Download as PDF'}
                            </button>

                            <button
                                onClick={handleGenerateDOCX}
                                disabled={!text || isGenerating}
                                className={`flex-1 flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${(!text || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <FileType className="w-6 h-6 mr-2" />
                                {isGenerating ? 'Generating...' : 'Download as DOCX'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                        <span>100% Client-side processing</span>
                        <div className="flex gap-4">
                            <span className="flex items-center"><FileCode className="w-4 h-4 mr-1" /> No Backend</span>
                            <span className="flex items-center"><Download className="w-4 h-4 mr-1" /> Instant Download</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Converter;
