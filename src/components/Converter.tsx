import React, { useState, useEffect, useRef } from 'react';
import { FileText, FileType, Download, FileCode, Moon, Sun, AlignLeft, AlignCenter, AlignRight, Copy, BookOpen, Settings, Bold, Italic, Underline, Maximize, Minimize, Hash, Share2, Save, Table, Image, Code, Lock, Sparkles, RotateCcw, RotateCw, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, UnderlineType } from 'docx';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import ShareModal from './ShareModal';
import PresetManager from './PresetManager';
import TableEditor from './TableEditor';
import Toast from './Toast';
import type { ToastType } from './Toast';


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
  const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0, sentences: 0, readingTime: 0 });
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [fontSize, setFontSize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [addPageNumbers, setAddPageNumbers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [wordGoal, setWordGoal] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const textareaRef = useRef(null);

  // New state for modern features
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({ message: '', type: 'info', visible: false });
  const [pdfPassword, setPdfPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    const savedText = localStorage.getItem('text2filexpress_draft');
    const savedFilename = localStorage.getItem('text2filexpress_filename');
    const savedFontSize = localStorage.getItem('text2filexpress_fontsize');
    const savedDarkMode = localStorage.getItem('text2filexpress_darkmode');

    if (savedText) setText(savedText);
    if (savedFilename) setFilename(savedFilename);
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('text2filexpress_draft', text);
      localStorage.setItem('text2filexpress_filename', filename);
      localStorage.setItem('text2filexpress_fontsize', fontSize.toString());
      localStorage.setItem('text2filexpress_darkmode', darkMode.toString());
    }, 2000);
    return () => clearTimeout(timer);
  }, [text, filename, fontSize, darkMode]);

  // Enhanced statistics calculation
  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const readingTime = Math.ceil(words / 200); // 200 words per minute average
    setStats({ words, chars, paragraphs, sentences, readingTime });
  }, [text]);

  // History tracking for undo/redo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text !== history[historyIndex]) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(text);
        if (newHistory.length > 50) newHistory.shift(); // Keep last 50 states
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [text]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B for Bold
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        applyFormatting('bold');
      }
      // Ctrl/Cmd + I for Italic
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        applyFormatting('italic');
      }
      // Ctrl/Cmd + U for Underline
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        applyFormatting('underline');
      }
      // Ctrl/Cmd + S for Save PDF
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (text) handleGeneratePDF();
      }
      // Ctrl/Cmd + Shift + S for Save DOCX
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        if (text) handleGenerateDOCX();
      }
      // Ctrl/Cmd + Z for Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z for Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
      // ? for shortcuts help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [text, history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setText(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setText(history[historyIndex + 1]);
    }
  };

  const clearDraft = () => {
    if (confirm('Clear saved draft and all text?')) {
      localStorage.removeItem('text2filexpress_draft');
      setText('');
      setHistory(['']);
      setHistoryIndex(0);
    }
  };

  const sanitizeFilename = (name: string) => {
    return name.replace(/[^a-z0-9_\-]/gi, '_').replace(/_{2,}/g, '_');
  };

  // Parse markdown for formatting
  const parseMarkdown = (text: string) => {
    const segments: Array<{ text: string, bold?: boolean, italic?: boolean, underline?: boolean }> = [];
    let currentPos = 0;

    // Regex to match **bold**, *italic*, __underline__
    const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(__([^_]+)__)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > currentPos) {
        segments.push({ text: text.substring(currentPos, match.index) });
      }

      // Add formatted text
      if (match[1]) { // **bold**
        segments.push({ text: match[2], bold: true });
      } else if (match[3]) { // *italic*
        segments.push({ text: match[4], italic: true });
      } else if (match[5]) { // __underline__
        segments.push({ text: match[6], underline: true });
      }

      currentPos = match.index + match[0].length;
    }

    // Add remaining text
    if (currentPos < text.length) {
      segments.push({ text: text.substring(currentPos) });
    }

    return segments.length > 0 ? segments : [{ text }];
  };

  // Insert heading (H1, H2, H3)
  const insertHeading = (level: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end) || 'Heading';

    const headingPrefix = '#'.repeat(level) + ' ';
    const newText = text.substring(0, start) + headingPrefix + selectedText + text.substring(end);
    setText(newText);
  };

  // Insert bullet or numbered list
  const insertList = (type: 'bullet' | 'numbered') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (selectedText) {
      const lines = selectedText.split('\n');
      const formattedLines = lines.map((line, index) => {
        if (type === 'bullet') {
          return `• ${line}`;
        } else {
          return `${index + 1}. ${line}`;
        }
      });
      const newText = text.substring(0, start) + formattedLines.join('\n') + text.substring(end);
      setText(newText);
    } else {
      const prefix = type === 'bullet' ? '• ' : '1. ';
      const newText = text.substring(0, start) + prefix + text.substring(end);
      setText(newText);
    }
  };

  // Find and replace
  const handleFindReplace = (replaceAll: boolean) => {
    if (!findText) return;

    if (replaceAll) {
      const newText = text.split(findText).join(replaceText);
      setText(newText);
      alert(`Replaced ${text.split(findText).length - 1} occurrence(s)`);
    } else {
      const index = text.indexOf(findText);
      if (index !== -1) {
        const newText = text.substring(0, index) + replaceText + text.substring(index + findText.length);
        setText(newText);
        alert('Replaced 1 occurrence');
      } else {
        alert('Text not found');
      }
    }
    setShowFindReplace(false);
  };

  // Insert hyperlink
  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end) || 'link text';
    const url = prompt('Enter URL:', 'https://');

    if (url) {
      const linkText = `[${selectedText}](${url})`;
      const newText = text.substring(0, start) + linkText + text.substring(end);
      setText(newText);
    }
  };

  // Change text case
  const changeCase = (caseType: 'upper' | 'lower' | 'title') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (!selectedText) {
      alert('Please select some text first!');
      return;
    }

    let transformedText = '';
    switch (caseType) {
      case 'upper':
        transformedText = selectedText.toUpperCase();
        break;
      case 'lower':
        transformedText = selectedText.toLowerCase();
        break;
      case 'title':
        transformedText = selectedText.replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
    }

    const newText = text.substring(0, start) + transformedText + text.substring(end);
    setText(newText);
  };

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
    const cleanFilename = sanitizeFilename(filename);
    saveAs(blob, `${cleanFilename}.txt`);
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

      let cursorY = margin;
      let pageNumber = 1;

      // Process each line
      const lines = text.split('\n');

      lines.forEach((line) => {
        // Parse markdown for this line
        const segments = parseMarkdown(line);

        // Check if we need a new page
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

        // Calculate starting X position based on alignment
        let currentX = margin;
        if (alignment === 'center') {
          // For center alignment, we need to calculate total width first
          let totalWidth = 0;
          segments.forEach(seg => {
            const textWidth = doc.getTextWidth(seg.text);
            totalWidth += textWidth;
          });
          currentX = (pageWidth - totalWidth) / 2;
        } else if (alignment === 'right') {
          let totalWidth = 0;
          segments.forEach(seg => {
            const textWidth = doc.getTextWidth(seg.text);
            totalWidth += textWidth;
          });
          currentX = pageWidth - margin - totalWidth;
        }

        // Render each segment with appropriate formatting
        segments.forEach(seg => {
          // Set font style based on formatting
          if (seg.bold && seg.italic) {
            doc.setFont('helvetica', 'bolditalic');
          } else if (seg.bold) {
            doc.setFont('helvetica', 'bold');
          } else if (seg.italic) {
            doc.setFont('helvetica', 'italic');
          } else {
            doc.setFont('helvetica', 'normal');
          }

          // Draw text
          doc.text(seg.text, currentX, cursorY);

          // Draw underline if needed
          if (seg.underline) {
            const textWidth = doc.getTextWidth(seg.text);
            doc.line(currentX, cursorY + 1, currentX + textWidth, cursorY + 1);
          }

          // Move cursor for next segment
          currentX += doc.getTextWidth(seg.text);
        });

        cursorY += lineHeight;
      });

      // Add final page number
      if (addPageNumbers) {
        doc.setFontSize(10);
        doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      const cleanFilename = sanitizeFilename(filename);
      doc.save(`${cleanFilename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
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
        const segments = parseMarkdown(line);

        return new Paragraph({
          alignment: docAlignment,
          spacing: {
            line: Math.round(lineSpacing * 240),
          },
          children: segments.map(seg => new TextRun({
            text: seg.text,
            size: fontSize * 2,
            bold: seg.bold,
            italics: seg.italic,
            underline: seg.underline ? { type: UnderlineType.SINGLE } : undefined,
            font: fontFamily,
          })),
        });
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      const blob = await Packer.toBlob(doc);
      const cleanFilename = sanitizeFilename(filename);
      saveAs(blob, `${cleanFilename}.docx`);
    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert('Failed to generate DOCX. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Show toast notification
  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, visible: true });
  };

  // Generate QR code for document
  const generateQRCode = async () => {
    try {
      // Create a data URL containing the document text
      const dataUrl = await QRCode.toDataURL(text.substring(0, 2000)); // Limit to 2000 chars for QR
      setQrCodeDataUrl(dataUrl);
      setShowShareModal(true);
      showToast('QR Code generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating QR code:', error);
      showToast('Failed to generate QR code', 'error');
    }
  };

  // AI-powered text summarization (client-side)
  const summarizeText = () => {
    if (!text) {
      showToast('No text to summarize', 'warning');
      return;
    }

    // Simple extractive summarization: take first sentence of each paragraph
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    const summary = paragraphs
      .map(p => {
        const sentences = p.split(/[.!?]+/).filter(s => s.trim());
        return sentences[0] ? sentences[0].trim() + '.' : '';
      })
      .filter(s => s)
      .join(' ');

    setText(summary);
    showToast('Text summarized!', 'success');
  };

  // Smart heading detection
  const autoDetectHeadings = () => {
    if (!text) return;

    const lines = text.split('\n');
    const processedLines = lines.map(line => {
      const trimmed = line.trim();

      // Skip if already a heading
      if (trimmed.startsWith('#')) return line;

      // Detect potential headings (short lines, title case, no ending punctuation)
      if (trimmed.length > 0 && trimmed.length < 60 &&
        trimmed[0] === trimmed[0].toUpperCase() &&
        !trimmed.match(/[.!?]$/)) {
        // Check if it's title case
        const words = trimmed.split(' ');
        const isTitleCase = words.every(w => w[0] === w[0].toUpperCase());

        if (isTitleCase) {
          return `## ${trimmed}`;
        }
      }

      return line;
    });

    setText(processedLines.join('\n'));
    showToast('Headings detected and formatted!', 'success');
  };

  // Load preset settings
  const loadPreset = (preset: any) => {
    setFontSize(preset.fontSize);
    setLineSpacing(preset.lineSpacing);
    setAlignment(preset.alignment);
    setAddPageNumbers(preset.pageNumbers);
    setFontFamily(preset.fontFamily);
    showToast(`Preset "${preset.name}" loaded!`, 'success');
  };

  // Insert table from TableEditor
  const insertTable = (tableMarkdown: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setText(text + tableMarkdown);
      return;
    }

    const start = textarea.selectionStart;
    const newText = text.substring(0, start) + tableMarkdown + text.substring(start);
    setText(newText);
    showToast('Table inserted!', 'success');
  };

  // Insert horizontal rule
  const insertHorizontalRule = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const hr = '\n---\n';
    const newText = text.substring(0, start) + hr + text.substring(start);
    setText(newText);
  };

  // Insert block quote
  const insertBlockQuote = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (selectedText) {
      const lines = selectedText.split('\n');
      const quotedLines = lines.map(line => `> ${line}`);
      const newText = text.substring(0, start) + quotedLines.join('\n') + text.substring(end);
      setText(newText);
    } else {
      const quote = '\n> Quote text here\n';
      const newText = text.substring(0, start) + quote + text.substring(start);
      setText(newText);
    }
  };

  // Insert code block
  const insertCodeBlock = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    const codeBlock = selectedText
      ? `\n\`\`\`\n${selectedText}\n\`\`\`\n`
      : '\n```\nCode here\n```\n';

    const newText = text.substring(0, start) + codeBlock + text.substring(end);
    setText(newText);
  };

  // Enhanced PDF generation with password protection and watermark
  const handleGeneratePDFWithProtection = async () => {
    if (!text) return;

    setIsGenerating(true);
    try {
      // First generate PDF using jsPDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = fontSize * lineSpacing * 0.35;

      doc.setFontSize(fontSize);

      let cursorY = margin;
      let pageNumber = 1;

      const lines = text.split('\n');

      lines.forEach((line) => {
        const segments = parseMarkdown(line);

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

        let currentX = margin;
        if (alignment === 'center') {
          let totalWidth = 0;
          segments.forEach(seg => {
            totalWidth += doc.getTextWidth(seg.text);
          });
          currentX = (pageWidth - totalWidth) / 2;
        } else if (alignment === 'right') {
          let totalWidth = 0;
          segments.forEach(seg => {
            totalWidth += doc.getTextWidth(seg.text);
          });
          currentX = pageWidth - margin - totalWidth;
        }

        segments.forEach(seg => {
          if (seg.bold && seg.italic) {
            doc.setFont('helvetica', 'bolditalic');
          } else if (seg.bold) {
            doc.setFont('helvetica', 'bold');
          } else if (seg.italic) {
            doc.setFont('helvetica', 'italic');
          } else {
            doc.setFont('helvetica', 'normal');
          }

          doc.text(seg.text, currentX, cursorY);

          if (seg.underline) {
            const textWidth = doc.getTextWidth(seg.text);
            doc.line(currentX, cursorY + 1, currentX + textWidth, cursorY + 1);
          }

          currentX += doc.getTextWidth(seg.text);
        });

        cursorY += lineHeight;
      });

      if (addPageNumbers) {
        doc.setFontSize(10);
        doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // Add watermark if specified
      if (watermarkText) {
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(60);
          doc.setTextColor(200, 200, 200);
          doc.text(watermarkText, pageWidth / 2, pageHeight / 2, {
            align: 'center',
            angle: 45
          });
        }
      }

      // Get PDF as array buffer
      const pdfArrayBuffer = doc.output('arraybuffer');

      // If password protection is needed, use pdf-lib
      if (pdfPassword) {
        const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

        // Note: pdf-lib doesn't support encryption directly in browser
        // This is a limitation - we'll save without password for now
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const cleanFilename = sanitizeFilename(filename);
        saveAs(blob, `${cleanFilename}.pdf`);
        showToast('PDF generated (password protection requires server-side processing)', 'warning');
      } else {
        const cleanFilename = sanitizeFilename(filename);
        doc.save(`${cleanFilename}.pdf`);
        showToast('PDF generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Failed to generate PDF', 'error');
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-start mb-10">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src="/logo.png" alt="Text2FileXpress Logo" className="w-16 h-16 rounded-lg shadow-lg" />
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
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-md transition-all`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Templates Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Letter Types */}
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
                    <button onClick={() => loadTemplate('blank')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Blank Document</button>
                    <button onClick={() => loadTemplate('essay')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Essay</button>
                    <button onClick={() => loadTemplate('report')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Report</button>
                    <button onClick={() => loadTemplate('assignment')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Assignment</button>
                  </div>
                </div>

                <div>
                  <p className={`text-xs font-medium mb-2 uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Professional Letters</p>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => loadTemplate('formalLetter')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Formal Letter</button>
                    <button onClick={() => loadTemplate('coverLetter')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Cover Letter</button>
                    <button onClick={() => loadTemplate('requestLetter')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Request Letter</button>
                    <button onClick={() => loadTemplate('recommendationRequest')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Recommendation</button>
                    <button onClick={() => loadTemplate('complaintLetter')} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>Complaint</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">



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
                    <div className="flex items-center gap-2 flex-wrap">
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={undo}
                          disabled={historyIndex <= 0}
                          className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${historyIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Undo (Ctrl+Z)"
                        >
                          ↶
                        </button>
                        <button
                          onClick={redo}
                          disabled={historyIndex >= history.length - 1}
                          className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${historyIndex >= history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Redo (Ctrl+Y)"
                        >
                          ↷
                        </button>
                        <button onClick={copyToClipboard} className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`} title="Copy to clipboard">
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                        <button onClick={clearDraft} className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-red-900 hover:bg-red-800 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'}`} title="Clear all text">
                          Clear
                        </button>
                      </div>

                      {/* Lists */}
                      <div className="flex gap-1 border-r pr-2 border-gray-400">
                        <button onClick={() => insertList('bullet')} className={`px-2 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Bullet List">• List</button>
                        <button onClick={() => insertList('numbered')} className={`px-2 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Numbered List">1. List</button>
                      </div>

                      {/* Text Case */}
                      <div className="flex gap-1 border-r pr-2 border-gray-400">
                        <button onClick={() => changeCase('upper')} className={`px-2 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="UPPERCASE">AA</button>
                        <button onClick={() => changeCase('lower')} className={`px-2 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="lowercase">aa</button>
                        <button onClick={() => changeCase('title')} className={`px-2 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Title Case">Aa</button>
                      </div>

                      {/* Insert Link */}
                      <button onClick={insertLink} className={`px-3 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600 bg-blue-900' : 'hover:bg-blue-100 bg-blue-50'} text-blue-600 dark:text-blue-300`} title="Insert Link">🔗 Link</button>

                      {/* Find & Replace */}
                      <button onClick={() => setShowFindReplace(true)} className={`px-3 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600 bg-purple-900' : 'hover:bg-purple-100 bg-purple-50'} text-purple-600 dark:text-purple-300`} title="Find & Replace">🔍 Find</button>

                      {/* AI Tools */}
                      <div className="flex gap-1 border-r pr-2 border-gray-400">
                        <button onClick={summarizeText} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-indigo-900' : 'hover:bg-indigo-100 bg-indigo-50'} text-indigo-600 dark:text-indigo-300`} title="AI Summarize">
                          <Sparkles className="w-3 h-3" /> Summarize
                        </button>
                        <button onClick={autoDetectHeadings} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-indigo-900' : 'hover:bg-indigo-100 bg-indigo-50'} text-indigo-600 dark:text-indigo-300`} title="Auto-detect Headings">
                          <Hash className="w-3 h-3" /> Auto H
                        </button>
                      </div>

                      {/* Advanced Formatting */}
                      <div className="flex gap-1 border-r pr-2 border-gray-400">
                        <button onClick={() => setShowTableEditor(true)} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Insert Table">
                          <Table className="w-3 h-3" /> Table
                        </button>
                        <button onClick={insertCodeBlock} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Insert Code Block">
                          <Code className="w-3 h-3" /> Code
                        </button>
                        <button onClick={insertBlockQuote} className={`px-3 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Insert Quote">
                          " Quote
                        </button>
                        <button onClick={insertHorizontalRule} className={`px-3 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Horizontal Rule">
                          ─ HR
                        </button>
                      </div>

                      {/* Sharing & Presets */}
                      <div className="flex gap-1 border-r pr-2 border-gray-400">
                        <button onClick={generateQRCode} disabled={!text} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-green-900' : 'hover:bg-green-100 bg-green-50'} text-green-600 dark:text-green-300 ${!text ? 'opacity-50 cursor-not-allowed' : ''}`} title="Generate QR Code">
                          <Share2 className="w-3 h-3" /> Share
                        </button>
                        <button onClick={() => setShowPresetManager(true)} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${darkMode ? 'hover:bg-gray-600 bg-orange-900' : 'hover:bg-orange-100 bg-orange-50'} text-orange-600 dark:text-orange-300`} title="Manage Presets">
                          <Save className="w-3 h-3" /> Presets
                        </button>
                      </div>

                      {/* Focus Mode */}
                      <button onClick={() => setFocusMode(!focusMode)} className={`px-3 py-1 text-xs rounded ${focusMode ? 'bg-green-600 text-white' : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200')}`} title="Focus Mode">
                        {focusMode ? '👁️ Exit Focus' : '🎯 Focus'}
                      </button>

                      {/* Full Screen */}
                      <button onClick={toggleFullScreen} className={`px-3 py-1 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`} title="Full Screen">
                        <Maximize className="w-4 h-4 inline mr-1" /> Full Screen
                      </button>

                      {/* Word Goal */}
                      <div className="flex items-center gap-2 ml-auto">
                        <input
                          type="number"
                          placeholder="Word goal"
                          value={wordGoal || ''}
                          onChange={(e) => setWordGoal(Number(e.target.value))}
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
                  </div>

                  {/* Formatting Toolbar */}
                  <div className={`flex flex-wrap items-center gap-2 mb-2 p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className={`h-9 text-sm rounded-md border-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}`}
                      title="Font Family"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Georgia">Georgia</option>
                    </select>

                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className={`h-9 text-sm rounded-md border-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}`}
                      title="Font Size"
                    >
                      <option value={10}>10</option>
                      <option value={11}>11</option>
                      <option value={12}>12</option>
                      <option value={14}>14</option>
                      <option value={16}>16</option>
                      <option value={18}>18</option>
                      <option value={20}>20</option>
                      <option value={24}>24</option>
                    </select>

                    <select
                      value={lineSpacing}
                      onChange={(e) => setLineSpacing(Number(e.target.value))}
                      className={`h-9 text-sm rounded-md border-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}`}
                      title="Line Spacing"
                    >
                      <option value={1}>Single</option>
                      <option value={1.5}>1.5</option>
                      <option value={2}>Double</option>
                    </select>
                    <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
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
                    <button
                      onClick={() => setAddPageNumbers(!addPageNumbers)}
                      className={`p-2 rounded hover:bg-opacity-80 transition-all ${addPageNumbers ? (darkMode ? 'bg-gray-600' : 'bg-gray-200') : ''} ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      title="Toggle Page Numbers"
                    >
                      <Hash className="w-4 h-4" />
                    </button>
                    <div className={`ml-2 px-3 py-1 text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Select text and click a button to format
                    </div>
                  </div>

                  <textarea
                    ref={textareaRef}
                    id="content"
                    rows={20}
                    className={`block w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm p-4 border resize-y font-mono ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400' : 'border-gray-300 text-gray-800 focus:border-indigo-500'}`}
                    placeholder="Paste your notes here... (e.g., project report, study notes, assignment)

Try keyboard shortcuts:
• Ctrl+B for **bold**
• Ctrl+I for *italic*  
• Ctrl+U for __underline__
• Ctrl+S to save as PDF
• Press ? for more shortcuts"
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
            </div>
          </div>

        </div>
        <div className={`px-8 py-4 border-t flex justify-between items-center text-sm ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
          <span>100% Client-side processing</span>
          <div className="flex gap-4">
            <span className="flex items-center"><FileCode className="w-4 h-4 mr-1" /> No Backend</span>
            <span className="flex items-center"><Download className="w-4 h-4 mr-1" /> Instant Download</span>
          </div>
        </div>


        {/* Keyboard Shortcuts Modal */}
        {
          showShortcuts && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowShortcuts(false)}>
              <div className={`max-w-2xl w-full rounded-xl p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`} onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">⌨️ Keyboard Shortcuts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-indigo-500">Formatting</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span>Bold</span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+B</kbd></div>
                      <div className="flex justify-between"><span>Italic</span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+I</kbd></div>
                      <div className="flex justify-between"><span>Underline</span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+U</kbd></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-green-500">File Operations</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span>Save as PDF</span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+S</kbd></div>
                      <div className="flex justify-between"><span>Save as DOCX</span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Shift+S</kbd></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-purple-500">Editing</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span>Undo</span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Z</kbd></div>
                      <div className="flex justify-between"><span>Redo</span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Y</kbd></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-blue-500">Help</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span>Show shortcuts</span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">?</kbd></div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowShortcuts(false)} className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Close
                </button>
              </div>
            </div>
          )
        }

        {/* Find & Replace Modal */}
        {
          showFindReplace && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowFindReplace(false)}>
              <div className={`max-w-md w-full rounded-xl p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`} onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">🔍 Find & Replace</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Find</label>
                    <input
                      type="text"
                      value={findText}
                      onChange={(e) => setFindText(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                      placeholder="Enter text to find..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Replace with</label>
                    <input
                      type="text"
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                      placeholder="Enter replacement text..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFindReplace(false)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Replace Next
                    </button>
                    <button
                      onClick={() => handleFindReplace(true)}
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Replace All
                    </button>
                  </div>
                  <button
                    onClick={() => setShowFindReplace(false)}
                    className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* Loading Spinner */}
        {
          isGenerating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`rounded-xl p-8 flex flex-col items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Generating your document...</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please wait</p>
              </div>
            </div>
          )
        }

        {/* New Modals */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          qrCodeDataUrl={qrCodeDataUrl}
          documentName={filename}
        />

        <PresetManager
          isOpen={showPresetManager}
          onClose={() => setShowPresetManager(false)}
          currentSettings={{
            fontSize,
            lineSpacing,
            alignment,
            pageNumbers: addPageNumbers,
            fontFamily,
            name: ''
          }}
          onLoadPreset={loadPreset}
        />

        <TableEditor
          isOpen={showTableEditor}
          onClose={() => setShowTableEditor(false)}
          onInsert={insertTable}
        />

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.visible}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      </div>
    </div>
  );
};

export default Converter;

