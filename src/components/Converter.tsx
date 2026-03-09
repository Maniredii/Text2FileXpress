import React, { useState, useEffect, useRef, useCallback, type DragEvent } from 'react';
import { FileCode, Download, Moon, Sun, AlignLeft, AlignCenter, AlignRight, Upload, Eye, EyeOff } from 'lucide-react';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';

// Hooks
import { useEditorHistory } from '../hooks/useEditorHistory';
import { useAutoSave, loadSavedDraft } from '../hooks/useAutoSave';
import { useDrafts } from '../hooks/useDrafts';
import { useToast } from '../hooks/useToast';
import { usePDFGenerator } from '../hooks/usePDFGenerator';
import { useDocxGenerator } from '../hooks/useDocxGenerator';

// Components
import SidebarTemplates from './SidebarTemplates';
import EditorToolbar from './EditorToolbar';
import EditorStats from './EditorStats';
import ActionButtons from './ActionButtons';
import ShareModal from './ShareModal';
import PresetManager from './PresetManager';
import DraftManager from './DraftManager';
import TableEditor from './TableEditor';
import Toast from './Toast';
import Footer from './Footer';

// Utils & Constants
import { TEMPLATES } from '../utils/templates';
import { calculateStats, sanitizeFilename, summarizeText as summarizeTextUtil, autoDetectHeadings as autoDetectHeadingsUtil } from '../utils/markdown';
import type { Alignment } from '../types';

const Converter = () => {
  // ── Core State ──────────────────────────────────────────────
  const [text, setText] = useState('');
  const [filename, setFilename] = useState('output');
  const [isGenerating, setIsGenerating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ── Editor Settings ─────────────────────────────────────────
  const [alignment, setAlignment] = useState<Alignment>('left');
  const [fontSize, setFontSize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [addPageNumbers, setAddPageNumbers] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [wordGoal, setWordGoal] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');
  const [pdfPassword, setPdfPassword] = useState('');

  // ── UI Modals & Panels ──────────────────────────────────────
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [showDraftManager, setShowDraftManager] = useState(false);
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Custom Hooks ────────────────────────────────────────────
  const { undo, redo, pushHistory, reset: resetHistory, canUndo, canRedo } = useEditorHistory();
  const { drafts, saveDraft, loadDraft, deleteDraft, renameDraft } = useDrafts();
  const { toast, showToast, hideToast } = useToast();
  const { generatePDF } = usePDFGenerator();
  const { generateDOCX } = useDocxGenerator();

  useAutoSave({ text, filename, fontSize, darkMode });

  // ── Computed Values ─────────────────────────────────────────
  const stats = calculateStats(text);

  // ── Load Saved Draft on Mount ───────────────────────────────
  useEffect(() => {
    const saved = loadSavedDraft();
    if (saved.text) setText(saved.text);
    if (saved.filename) setFilename(saved.filename);
    if (saved.fontSize) setFontSize(saved.fontSize);
    if (saved.darkMode !== undefined) setDarkMode(saved.darkMode);
  }, []);

  // ── History Tracking ────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      pushHistory(text);
    }, 500);
    return () => clearTimeout(timer);
  }, [text]);

  // ── Keyboard Shortcuts ──────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        applyFormatting('bold');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        applyFormatting('italic');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        applyFormatting('underline');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (text) handleGeneratePDF();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        if (text) handleGenerateDOCX();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [text]);

  // ── Editor Actions ──────────────────────────────────────────

  const handleUndo = useCallback(() => {
    const result = undo();
    if (result !== null) setText(result);
  }, [undo]);

  const handleRedo = useCallback(() => {
    const result = redo();
    if (result !== null) setText(result);
  }, [redo]);

  const clearDraft = useCallback(() => {
    if (confirm('Clear saved draft and all text?')) {
      localStorage.removeItem('text2filexpress_draft');
      setText('');
      resetHistory();
    }
  }, [resetHistory]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text);
    showToast('Text copied to clipboard!', 'success');
  }, [text, showToast]);

  const loadTemplate = useCallback((templateKey: string) => {
    setText(TEMPLATES[templateKey] || '');
  }, []);

  // ── Text Manipulation ──────────────────────────────────────

  const applyFormatting = useCallback((formatType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (!selectedText) {
      showToast('Please select some text first!', 'warning');
      return;
    }

    let formattedText = '';
    let prefix = '';
    let suffix = '';

    switch (formatType) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        break;
      case 'italic':
        prefix = '*';
        suffix = '*';
        break;
      case 'underline':
        prefix = '__';
        suffix = '__';
        break;
      default:
        return;
    }

    if (selectedText.startsWith(prefix) && selectedText.endsWith(suffix) && selectedText.length >= prefix.length + suffix.length) {
      // Remove formatting if it already exists
      formattedText = selectedText.substring(prefix.length, selectedText.length - suffix.length);
    } else {
      // Add formatting
      formattedText = `${prefix}${selectedText}${suffix}`;
    }

    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  }, [text, showToast]);

  const insertHeading = useCallback((level: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end) || 'Heading';
    const headingPrefix = '#'.repeat(level) + ' ';
    const newText = text.substring(0, start) + headingPrefix + selectedText + text.substring(end);
    setText(newText);
  }, [text]);

  const insertList = useCallback((type: 'bullet' | 'numbered') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (selectedText) {
      const lines = selectedText.split('\n');
      const formattedLines = lines.map((line, index) =>
        type === 'bullet' ? `• ${line}` : `${index + 1}. ${line}`
      );
      const newText = text.substring(0, start) + formattedLines.join('\n') + text.substring(end);
      setText(newText);
    } else {
      const prefix = type === 'bullet' ? '• ' : '1. ';
      const newText = text.substring(0, start) + prefix + text.substring(end);
      setText(newText);
    }
  }, [text]);

  const changeCase = useCallback((caseType: 'upper' | 'lower' | 'title') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (!selectedText) {
      showToast('Please select some text first!', 'warning');
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
  }, [text, showToast]);

  const insertLink = useCallback(() => {
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
  }, [text]);

  const insertImage = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end) || 'image description';
    const url = prompt('Enter Image URL:', 'https://');

    if (url) {
      const imageText = `![${selectedText}](${url})`;
      const newText = text.substring(0, start) + imageText + text.substring(end);
      setText(newText);
    }
  }, [text]);

  const handleFindReplace = useCallback((replaceAll: boolean) => {
    if (!findText) return;

    if (replaceAll) {
      const newText = text.split(findText).join(replaceText);
      setText(newText);
      showToast(`Replaced ${text.split(findText).length - 1} occurrence(s)`, 'success');
    } else {
      const index = text.indexOf(findText);
      if (index !== -1) {
        const newText = text.substring(0, index) + replaceText + text.substring(index + findText.length);
        setText(newText);
        showToast('Replaced 1 occurrence', 'success');
      } else {
        showToast('Text not found', 'warning');
      }
    }
    setShowFindReplace(false);
  }, [text, findText, replaceText, showToast]);

  const insertTable = useCallback((tableMarkdown: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setText(prev => prev + tableMarkdown);
      return;
    }
    const start = textarea.selectionStart;
    const newText = text.substring(0, start) + tableMarkdown + text.substring(start);
    setText(newText);
    showToast('Table inserted!', 'success');
  }, [text, showToast]);

  const insertHorizontalRule = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const hr = '\n---\n';
    const newText = text.substring(0, start) + hr + text.substring(start);
    setText(newText);
  }, [text]);

  const insertBlockQuote = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (selectedText) {
      const quotedLines = selectedText.split('\n').map(line => `> ${line}`);
      const newText = text.substring(0, start) + quotedLines.join('\n') + text.substring(end);
      setText(newText);
    } else {
      const quote = '\n> Quote text here\n';
      const newText = text.substring(0, start) + quote + text.substring(start);
      setText(newText);
    }
  }, [text]);

  const insertCodeBlock = useCallback(() => {
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
  }, [text]);

  // ── AI Features ─────────────────────────────────────────────

  const handleSummarize = useCallback(() => {
    if (!text) {
      showToast('No text to summarize', 'warning');
      return;
    }
    setText(summarizeTextUtil(text));
    showToast('Text summarized!', 'success');
  }, [text, showToast]);

  const handleAutoDetectHeadings = useCallback(() => {
    if (!text) return;
    setText(autoDetectHeadingsUtil(text));
    showToast('Headings detected and formatted!', 'success');
  }, [text, showToast]);

  // ── Sharing & QR ────────────────────────────────────────────

  const generateQRCode = useCallback(async () => {
    try {
      const dataUrl = await QRCode.toDataURL(text.substring(0, 2000));
      setQrCodeDataUrl(dataUrl);
      setShowShareModal(true);
      showToast('QR Code generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating QR code:', error);
      showToast('Failed to generate QR code', 'error');
    }
  }, [text, showToast]);

  // ── File Generation ─────────────────────────────────────────

  const pdfOptions = {
    fontSize,
    lineSpacing,
    alignment,
    addPageNumbers,
    fontFamily,
    watermarkText,
    pdfPassword,
  };

  const handleGeneratePDF = useCallback(async () => {
    if (!text) return;
    setIsGenerating(true);
    const result = await generatePDF(text, filename, pdfOptions);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
    setIsGenerating(false);
  }, [text, filename, pdfOptions, generatePDF, showToast]);

  const handleGenerateDOCX = useCallback(async () => {
    if (!text) return;
    setIsGenerating(true);
    const result = await generateDOCX(text, filename, {
      fontSize, lineSpacing, alignment, fontFamily,
    });
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
    setIsGenerating(false);
  }, [text, filename, fontSize, lineSpacing, alignment, fontFamily, generateDOCX, showToast]);

  const handleDownloadTXT = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' });
    const cleanFilename = sanitizeFilename(filename);
    saveAs(blob, `${cleanFilename}.txt`);
    showToast('TXT file downloaded!', 'success');
  }, [text, filename, showToast]);

  // ── Preset Loading ──────────────────────────────────────────

  const loadPreset = useCallback((preset: any) => {
    setFontSize(preset.fontSize);
    setLineSpacing(preset.lineSpacing);
    setAlignment(preset.alignment);
    setAddPageNumbers(preset.pageNumbers);
    setFontFamily(preset.fontFamily);
    showToast(`Preset "${preset.name}" loaded!`, 'success');
  }, [showToast]);

  // ── Fullscreen ──────────────────────────────────────────────

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  // ── Drag & Drop File Import ─────────────────────────────────

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    const validTypes = ['text/plain', 'text/markdown', 'text/md', ''];
    const validExtensions = ['.txt', '.md', '.markdown', '.text'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      showToast('Please drop a .txt or .md file', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setFilename(nameWithoutExt);
      showToast(`Imported "${file.name}" successfully!`, 'success');
    };
    reader.onerror = () => {
      showToast('Failed to read file', 'error');
    };
    reader.readAsText(file);
  }, [showToast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setFilename(nameWithoutExt);
      showToast(`Imported "${file.name}" successfully!`, 'success');
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset so same file can be imported again
  }, [showToast]);

  // ── Simple Markdown to HTML for Preview ──────────────────────

  const renderMarkdownPreview = useCallback((inputText: string): string => {
    let html = inputText
      // Escape HTML first
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headings
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-3 mb-1">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-1">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // Bold, italic, underline
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/__(.+?)__/g, '<u>$1</u>')
      // Block quotes
      .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-indigo-400 pl-3 italic text-gray-500">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-3 border-gray-300" />')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-green-400 rounded p-2 my-2 text-sm overflow-x-auto"><code>$1</code></pre>')
      // Inline code
      .replace(/`(.+?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">$1</code>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto max-h-96 rounded-lg my-2 object-contain border dark:border-gray-600" />')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-500 underline" target="_blank">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br/>');

    return html;
  }, []);

  // ── Render ──────────────────────────────────────────────────

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-[95%] mx-auto">

        {/* Header */}
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

        {/* Main Layout: Sidebar + Editor */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar Templates */}
          <SidebarTemplates darkMode={darkMode} onLoadTemplate={loadTemplate} />

          {/* Main Content Area */}
          <div className="flex-1">
            <div className={`rounded-2xl shadow-xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="p-8">

                {/* Filename & Alignment Row */}
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

                {/* Stats & Toolbar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="content" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Your Content
                    </label>

                    <EditorStats
                      darkMode={darkMode}
                      stats={stats}
                      canUndo={canUndo}
                      canRedo={canRedo}
                      wordGoal={wordGoal}
                      onWordGoalChange={setWordGoal}
                      onUndo={handleUndo}
                      onRedo={handleRedo}
                      onCopy={copyToClipboard}
                      onClear={clearDraft}
                    />
                  </div>

                  <EditorToolbar
                    darkMode={darkMode}
                    fontSize={fontSize}
                    lineSpacing={lineSpacing}
                    fontFamily={fontFamily}
                    addPageNumbers={addPageNumbers}
                    focusMode={focusMode}
                    onFontSizeChange={setFontSize}
                    onLineSpacingChange={setLineSpacing}
                    onFontFamilyChange={setFontFamily}
                    onTogglePageNumbers={() => setAddPageNumbers(!addPageNumbers)}
                    onApplyFormatting={applyFormatting}
                    onInsertHeading={insertHeading}
                    onInsertList={insertList}
                    onChangeCase={changeCase}
                    onInsertLink={insertLink}
                    onInsertImage={insertImage}
                    onShowFindReplace={() => setShowFindReplace(true)}
                    onSummarize={handleSummarize}
                    onAutoDetectHeadings={handleAutoDetectHeadings}
                    onShowTableEditor={() => setShowTableEditor(true)}
                    onInsertCodeBlock={insertCodeBlock}
                    onInsertBlockQuote={insertBlockQuote}
                    onInsertHorizontalRule={insertHorizontalRule}
                    onGenerateQRCode={generateQRCode}
                    onShowPresetManager={() => setShowPresetManager(true)}
                    onShowDraftManager={() => setShowDraftManager(true)}
                    onToggleFocusMode={() => setFocusMode(!focusMode)}
                    onToggleFullScreen={toggleFullScreen}
                  />

                  {/* Preview Toggle & Import Button */}
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-all ${showPreview ? 'bg-indigo-600 text-white' : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700')}`}
                      title="Toggle Live Preview"
                    >
                      {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showPreview ? 'Hide Preview' : 'Live Preview'}
                    </button>
                    <label
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                      title="Import a .txt or .md file"
                    >
                      <Upload className="w-3.5 h-3.5" /> Import File
                      <input type="file" accept=".txt,.md,.markdown,.text" className="hidden" onChange={handleFileInput} />
                    </label>
                  </div>

                  {/* Drag & Drop Zone + Editor Area */}
                  <div
                    className={`relative transition-all rounded-lg ${isDragOver ? 'ring-4 ring-indigo-400 ring-opacity-70' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {/* Drag overlay */}
                    {isDragOver && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-indigo-600 bg-opacity-20 rounded-lg border-2 border-dashed border-indigo-400">
                        <div className="flex flex-col items-center gap-2 text-indigo-600 dark:text-indigo-300">
                          <Upload className="w-10 h-10" />
                          <span className="font-semibold text-lg">Drop your file here</span>
                          <span className="text-sm">.txt or .md files supported</span>
                        </div>
                      </div>
                    )}

                    <div className={`flex gap-0 ${showPreview ? 'flex-col lg:flex-row' : ''}`}>
                      {/* Textarea */}
                      <textarea
                        ref={textareaRef}
                        id="content"
                        rows={20}
                        className={`block ${showPreview ? 'w-full lg:w-1/2' : 'w-full'} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm p-4 border resize-y ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400' : 'border-gray-300 text-gray-800 focus:border-indigo-500'}`}
                        placeholder={`Paste your notes here... (e.g., project report, study notes, assignment)

Try keyboard shortcuts:
• Ctrl+B for **bold**
• Ctrl+I for *italic*  
• Ctrl+U for __underline__
• Ctrl+S to save as PDF
• Press ? for more shortcuts

💡 Tip: Drag & drop a .txt or .md file here to import!`}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{
                          textAlign: alignment as any,
                          fontSize: `${fontSize}px`,
                          lineHeight: lineSpacing,
                          fontFamily: fontFamily,
                        }}
                      />

                      {/* Live Preview Panel */}
                      {showPreview && (
                        <div
                          className={`${showPreview ? 'w-full lg:w-1/2' : 'hidden'} rounded-lg border p-4 overflow-y-auto ${darkMode ? 'bg-gray-750 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
                          style={{
                            minHeight: '400px',
                            maxHeight: '600px',
                            fontSize: `${fontSize}px`,
                            lineHeight: lineSpacing,
                            fontFamily: fontFamily,
                          }}
                        >
                          <div className={`text-xs font-semibold uppercase tracking-wider mb-3 pb-2 border-b ${darkMode ? 'text-gray-400 border-gray-600' : 'text-gray-500 border-gray-200'}`}>
                            📄 Live Preview
                          </div>
                          {text ? (
                            <div
                              dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(text) }}
                              style={{ textAlign: alignment as any }}
                            />
                          ) : (
                            <p className={`italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Start typing to see a preview...</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <ActionButtons
                  hasText={!!text}
                  isGenerating={isGenerating}
                  onGeneratePDF={handleGeneratePDF}
                  onGenerateDOCX={handleGenerateDOCX}
                  onDownloadTXT={handleDownloadTXT}
                  onCopyToClipboard={copyToClipboard}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className={`px-8 py-4 border-t flex justify-between items-center text-sm ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
          <span>100% Client-side processing</span>
          <div className="flex gap-4">
            <span className="flex items-center"><FileCode className="w-4 h-4 mr-1" /> No Backend</span>
            <span className="flex items-center"><Download className="w-4 h-4 mr-1" /> Instant Download</span>
          </div>
        </div>

        {/* ── Modals ─────────────────────────────────────────── */}

        {/* Keyboard Shortcuts Modal */}
        {showShortcuts && (
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
        )}

        {/* Find & Replace Modal */}
        {showFindReplace && (
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
                  <button onClick={() => handleFindReplace(false)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Replace Next
                  </button>
                  <button onClick={() => handleFindReplace(true)} className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Replace All
                  </button>
                </div>
                <button onClick={() => setShowFindReplace(false)} className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl p-8 flex flex-col items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
              <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Generating your document...</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please wait</p>
            </div>
          </div>
        )}

        {/* External Modals */}
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

        <DraftManager
          isOpen={showDraftManager}
          onClose={() => setShowDraftManager(false)}
          drafts={drafts}
          currentText={text}
          onLoadDraft={(draft) => {
            setText(draft.text);
            setShowDraftManager(false);
            showToast(`Loaded draft: ${draft.name}`, 'success');
          }}
          onSaveNewDraft={(currentText) => {
            saveDraft(currentText);
            showToast('Saved as new draft!', 'success');
          }}
          onDeleteDraft={(id) => {
            deleteDraft(id);
            showToast('Draft deleted', 'info');
          }}
          onRenameDraft={(id, newName) => {
            renameDraft(id, newName);
            showToast('Draft renamed', 'success');
          }}
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
          onClose={hideToast}
        />

        {/* Footer */}
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Converter;
