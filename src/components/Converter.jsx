import React, { useState, useEffect } from 'react';
import { FileText, FileType, Download, FileCode, Moon, Sun, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const Converter = () => {
  const [text, setText] = useState('');
  const [filename, setFilename] = useState('output');
  const [isGenerating, setIsGenerating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({ words: 0, chars: 0 });
  const [alignment, setAlignment] = useState('left');

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    setStats({ words, chars });
  }, [text]);

  const handleGeneratePDF = () => {
    if (!text) return;
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
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

        if (alignment === 'center') {
          doc.text(line, pageWidth / 2, cursorY, { align: 'center' });
        } else if (alignment === 'right') {
          doc.text(line, pageWidth - margin, cursorY, { align: 'right' });
        } else {
          doc.text(line, margin, cursorY);
        }

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
      let docAlignment = AlignmentType.LEFT;
      if (alignment === 'center') docAlignment = AlignmentType.CENTER;
      if (alignment === 'right') docAlignment = AlignmentType.RIGHT;

      const paragraphs = text.split('\n').map(line => {
        return new Paragraph({
          alignment: docAlignment,
          children: [
            new TextRun({
              text: line,
              size: 24,
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
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-start mb-10">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg" />
              <h1 className={`text-4xl font-extrabold sm:text-5xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Text to PDF / DOCX
              </h1>
            </div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Convert your raw text into professional documents instantly.
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-md transition-all`}
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        <div className={`rounded-2xl shadow-xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="p-8">

            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="flex-1">
                <label htmlFor="filename" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filename (without extension)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="filename"
                    className={`block w-full rounded-lg pl-4 pr-12 py-3 focus:ring-indigo-500 sm:text-sm border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400' : 'border-gray-300 focus:border-indigo-500'}`}
                    placeholder="output"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className={`sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>.pdf / .docx</span>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Text Alignment
                </label>
                <div className={`flex rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-1`}>
                  <button
                    onClick={() => setAlignment('left')}
                    className={`p-2 rounded-md transition-all ${alignment === 'left' ? (darkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : (darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`}
                  >
                    <AlignLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setAlignment('center')}
                    className={`p-2 rounded-md transition-all ${alignment === 'center' ? (darkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : (darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`}
                  >
                    <AlignCenter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setAlignment('right')}
                    className={`p-2 rounded-md transition-all ${alignment === 'right' ? (darkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : (darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`}
                  >
                    <AlignRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="content" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Content
                </label>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stats.words} words | {stats.chars} characters
                </div>
              </div>
              <textarea
                id="content"
                rows={15}
                className={`block w-full rounded-lg shadow-sm focus:ring-indigo-500 sm:text-sm p-4 border resize-y font-mono ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400' : 'border-gray-300 text-gray-800 focus:border-indigo-500'}`}
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ textAlign: alignment }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
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

          <div className={`px-8 py-4 border-t flex justify-between items-center text-sm ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
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
