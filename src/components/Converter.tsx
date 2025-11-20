import React, { useState, useEffect, useRef } from 'react';
import { FileText, FileType, Download, FileCode, Moon, Sun, AlignLeft, AlignCenter, AlignRight, Copy, BookOpen, Settings, Bold, Italic, Underline } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, UnderlineType } from 'docx';
import { saveAs } from 'file-saver';

const TEMPLATES = {
  blank: '',
  essay: `[Your Name]
[Professor's Name]
[Course Name]
[Date]

Essay Title

Introduction paragraph goes here...

Body paragraph 1...

Body paragraph 2...

Conclusion...`,
  report: `Title: [Report Title]
Author: [Your Name]
Date: [Date]
Course: [Course Name]

Executive Summary
[Brief overview of the report]

Introduction
[Background and purpose]

Methodology
[How the research was conducted]

Findings
[Key results and data]

Conclusion
[Summary and recommendations]

References
[List of sources]`,
  assignment: `Student Name: [Your Name]
Student ID: [ID Number]
Course: [Course Name]
Assignment: [Assignment Title]
Due Date: [Date]

Answer to Question 1:
[Your answer here]

Answer to Question 2:
[Your answer here]`,
  formalLetter: `[Your Name]
[Your Address]
[City, State ZIP Code]
[Email Address]
[Phone Number]

[Date]

[Recipient's Name]
[Recipient's Title]
[Company/Organization Name]
[Address]
[City, State ZIP Code]

Dear [Mr./Ms./Dr.] [Last Name],

[Opening paragraph: State the purpose of your letter]

[Body paragraph: Provide details and supporting information]

[Closing paragraph: Summarize and state desired action]

Sincerely,

[Your Signature]
[Your Typed Name]`,
  coverLetter: `[Your Name]
[Your Address]
[City, State ZIP Code]
[Email] | [Phone]

[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State ZIP Code]

Dear [Hiring Manager's Name],

I am writing to express my strong interest in the [Position Title] position at [Company Name], as advertised on [where you found the job posting]. As a [your current status, e.g., recent graduate, current student] with [relevant experience/skills], I am excited about the opportunity to contribute to your team.

[Body paragraph 1: Highlight your relevant qualifications and experiences]

[Body paragraph 2: Explain why you're interested in this company and position]

[Body paragraph 3: Mention specific skills or achievements that make you a strong candidate]

I would welcome the opportunity to discuss how my background and skills would benefit [Company Name]. Thank you for considering my application. I look forward to hearing from you.

Sincerely,

[Your Name]`,
  requestLetter: `[Your Name]
[Your Address]
[Email] | [Phone]

[Date]

[Recipient's Name]
[Recipient's Title]
[Department/Organization]

Subject: Request for [Specify: Leave/Permission/Information/etc.]

Dear [Mr./Ms./Dr.] [Last Name],

I am writing to formally request [state what you are requesting] for the period of [dates/duration] due to [brief reason].

[Provide detailed explanation and justification for your request]

[Mention any arrangements you have made to minimize impact]

I would be grateful if you could approve this request. Please let me know if you need any additional information or documentation.

Thank you for your consideration.

Respectfully,

[Your Name]
[Student ID/Employee ID if applicable]`,
  recommendationRequest: `[Your Name]
[Your Email]
[Your Phone]

[Date]

[Professor's Name]
[Department]
[University Name]

Dear Professor [Last Name],

I hope this email finds you well. I am writing to ask if you would be willing to write a letter of recommendation for me as I apply for [graduate school/internship/job position] at [institution/company name].

I thoroughly enjoyed your [course name] class during [semester/year], where I [mention specific achievement or project]. I believe your perspective on my [academic abilities/work ethic/specific skills] would greatly strengthen my application.

The application deadline is [date], and the letter should be submitted via [method]. I have attached my resume, personal statement, and [any other relevant documents] for your reference.

I understand this is a significant time commitment, and I would be happy to provide any additional information you might need. Please let me know if you are able to write this recommendation.

Thank you very much for considering my request.

Best regards,

[Your Name]`,
  complaintLetter: `[Your Name]
[Your Address]
[Email] | [Phone]

[Date]

[Recipient's Name]
[Recipient's Title]
[Company/Department Name]
[Address]

Subject: Formal Complaint Regarding [Issue]

Dear [Mr./Ms./Dr.] [Last Name],

I am writing to formally lodge a complaint regarding [briefly state the issue] that occurred on [date].

[Paragraph 1: Describe the situation in detail, including dates, times, and people involved]

[Paragraph 2: Explain how this issue has affected you and why it is unacceptable]

[Paragraph 3: State what resolution or action you expect]

I trust that this matter will be addressed promptly and appropriately. I would appreciate a response within [timeframe] regarding the steps being taken to resolve this issue.

Thank you for your attention to this matter.

Sincerely,

[Your Name]
[Reference Number/Account Number if applicable]`
};

const Converter = () => {
  const [text, setText] = useState('');
  const [filename, setFilename] = useState('output');
  const [isGenerating, setIsGenerating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({ words: 0, chars: 0 });
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [fontSize, setFontSize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [addPageNumbers, setAddPageNumbers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    setStats({ words, chars });
  }, [text]);

  const loadTemplate = (templateKey) => {
    setText(TEMPLATES[templateKey]);
  };

  const applyFormatting = (formatType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (!selectedText) {
      alert('Please select some text first!');
      return;
    }

    let formattedText = '';
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      default:
        return;
    }

    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setText(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    alert('Text copied to clipboard!');
  };

  const handleDownloadTXT = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    saveAs(blob, `${filename}.txt`);
  };

  const handleGeneratePDF = () => {
    if (!text) return;
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxLineWidth = pageWidth - (margin * 2);
      const lineHeight = fontSize * lineSpacing * 0.35;

      doc.setFontSize(fontSize);
      const splitText = doc.splitTextToSize(text, maxLineWidth);
      let cursorY = margin;
      let pageNumber = 1;

      splitText.forEach((line, index) => {
        if (cursorY + lineHeight > pageHeight - margin - (addPageNumbers ? 10 : 0)) {
          if (addPageNumbers) {
            doc.setFontSize(10);
            doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            doc.setFontSize(fontSize);
          }
          doc.addPage();
          pageNumber++;
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

      if (addPageNumbers) {
        doc.setFontSize(10);
        doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

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
      let docAlignment: typeof AlignmentType.LEFT | typeof AlignmentType.CENTER | typeof AlignmentType.RIGHT = AlignmentType.LEFT;
      if (alignment === 'center') docAlignment = AlignmentType.CENTER;
      if (alignment === 'right') docAlignment = AlignmentType.RIGHT;

      const paragraphs = text.split('\n').map(line => {
        return new Paragraph({
          alignment: docAlignment,
          spacing: {
            line: Math.round(lineSpacing * 240),
          },
          children: [
            new TextRun({
              text: line,
              size: fontSize * 2,
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
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-start mb-10">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src="/logo.png" alt="Text2FileXpress Logo" className="w-12 h-12 rounded-lg" />
              <h1 className={`text-4xl font-extrabold sm:text-5xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Text2FileXpress
              </h1>
            </div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Convert your text into professional documents instantly.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-md transition-all`}
              title="Settings"
            >
              <Settings className="w-6 h-6" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-md transition-all`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Templates Section */}
        <div className={`mb-6 p-4 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Templates</h3>
          </div>

          <div className="mb-3">
            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Academic</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => loadTemplate('blank')} className="px-3 py-1.5 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-all text-xs">Blank</button>
              <button onClick={() => loadTemplate('essay')} className="px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all text-xs">Essay</button>
              <button onClick={() => loadTemplate('report')} className="px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all text-xs">Report</button>
              <button onClick={() => loadTemplate('assignment')} className="px-3 py-1.5 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all text-xs">Assignment</button>
            </div>
          </div>

          <div>
            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Letters</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => loadTemplate('formalLetter')} className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-all text-xs">Formal Letter</button>
              <button onClick={() => loadTemplate('coverLetter')} className="px-3 py-1.5 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-all text-xs">Cover Letter</button>
              <button onClick={() => loadTemplate('requestLetter')} className="px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all text-xs">Request Letter</button>
              <button onClick={() => loadTemplate('recommendationRequest')} className="px-3 py-1.5 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-all text-xs">Recommendation</button>
              <button onClick={() => loadTemplate('complaintLetter')} className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all text-xs">Complaint</button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`mb-6 p-4 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Document Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Font Size</label>
                <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className={`w-full rounded-lg px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}>
                  <option value={10}>10pt</option>
                  <option value={11}>11pt</option>
                  <option value={12}>12pt (Default)</option>
                  <option value={14}>14pt</option>
                  <option value={16}>16pt</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Line Spacing</label>
                <select value={lineSpacing} onChange={(e) => setLineSpacing(Number(e.target.value))} className={`w-full rounded-lg px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}>
                  <option value={1}>Single</option>
                  <option value={1.5}>1.5 (Default)</option>
                  <option value={2}>Double</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Page Numbers</label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={addPageNumbers} onChange={(e) => setAddPageNumbers(e.target.checked)} className="mr-2" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Add page numbers</span>
                </label>
              </div>
            </div>
          </div>
        )}

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
                <div className="flex items-center gap-4">
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stats.words} words | {stats.chars} characters
                  </div>
                  <button onClick={copyToClipboard} className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className={`flex gap-1 mb-2 p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <button
                  onClick={() => applyFormatting('bold')}
                  className={`p-2 rounded hover:bg-opacity-80 transition-all ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  title="Bold (select text first)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormatting('italic')}
                  className={`p-2 rounded hover:bg-opacity-80 transition-all ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  title="Italic (select text first)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormatting('underline')}
                  className={`p-2 rounded hover:bg-opacity-80 transition-all ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  title="Underline (select text first)"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <div className={`ml-2 px-3 py-1 text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Select text and click a button to format
                </div>
              </div>

              <textarea
                ref={textareaRef}
                id="content"
                rows={15}
                className={`block w-full rounded-lg shadow-sm focus:ring-indigo-500 sm:text-sm p-4 border resize-y font-mono ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400' : 'border-gray-300 text-gray-800 focus:border-indigo-500'}`}
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ textAlign: alignment as any, fontSize: `${fontSize}px`, lineHeight: lineSpacing }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              <button
                onClick={handleGeneratePDF}
                disabled={!text || isGenerating}
                className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${(!text || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FileText className="w-5 h-5 mr-2" />
                PDF
              </button>

              <button
                onClick={handleGenerateDOCX}
                disabled={!text || isGenerating}
                className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${(!text || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FileType className="w-5 h-5 mr-2" />
                DOCX
              </button>

              <button
                onClick={handleDownloadTXT}
                disabled={!text}
                className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${!text ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className="w-5 h-5 mr-2" />
                TXT
              </button>

              <button
                onClick={copyToClipboard}
                disabled={!text}
                className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${!text ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Copy className="w-5 h-5 mr-2" />
                Copy
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
