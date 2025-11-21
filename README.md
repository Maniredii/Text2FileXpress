# Text2FileXpress

**Convert text to PDF, DOCX, and TXT instantly - 100% Free & Client-Side**

A pure frontend web application to convert raw text into PDF and DOCX formats instantly. Built with React, Vite, and Tailwind CSS. **Perfect for students and professionals!**

## 🔥 Features

### Core Features
- **100% Frontend**: No backend, no server, no database. Works offline.
- **Instant Conversion**: Generates PDF and DOCX files locally in your browser.
- **Modern UI**: Clean, responsive design with Dark Mode support.
- **Privacy Focused**: Your data never leaves your device.

### Student-Friendly Features ✨
- **📝 Quick Templates**: Pre-made formats for essays, reports, and assignments
- **🔤 Font Size Options**: Choose from 10pt to 24pt
- **📏 Line Spacing**: Single, 1.5, or double spacing
- **📄 Page Numbers**: Automatic page numbering for PDFs
- **📋 Copy to Clipboard**: Quick copy functionality
- **💾 Multiple Export Formats**: PDF, DOCX, and TXT
- **🎨 Text Alignment**: Left, center, or right alignment
- **📊 Real-time Stats**: Word, character, paragraph, sentence count, and reading time
- **🌙 Dark Mode**: Easy on the eyes for late-night studying

### 🆕 Modern 2024-2025 Features
- **🤖 AI-Powered Tools**:
  - Smart text summarization (extractive)
  - Auto-detect and format headings
  - Reading time estimation
- **🎨 Advanced Formatting**:
  - Insert markdown tables with visual editor
  - Code blocks with syntax highlighting
  - Block quotes and horizontal rules
  - Bold, italic, underline with markdown
- **🔗 Sharing & Collaboration**:
  - Generate QR codes for documents
  - Web Share API integration
  - Email document directly
- **💾 Productivity Tools**:
  - Save and load export presets
  - Undo/Redo with history (50 states)
  - Find and replace text
  - Word count goals with progress tracking
  - Focus mode for distraction-free writing
  - Auto-save drafts to localStorage
- **🔒 Enhanced PDF Features**:
  - Watermark support
  - Password protection (note: requires server-side for full encryption)
  - Custom font families (Arial, Times New Roman, Courier, Georgia)
- **⌨️ Keyboard Shortcuts**:
  - Ctrl+B/I/U for formatting
  - Ctrl+S for quick PDF save
  - Ctrl+Z/Y for undo/redo
  - Press ? for full shortcuts list

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd text-to-pdf
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5111`.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) (Icons)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **DOCX Generation**: [docx](https://docx.js.org/)
- **File Saving**: [file-saver](https://github.com/eligrey/FileSaver.js)

## 📝 Usage

### Quick Start with Templates
1. Click on a template (Essay, Report, or Assignment)
2. Fill in the placeholders with your content
3. Customize settings (font size, line spacing, page numbers)
4. Download as PDF, DOCX, or TXT

### Custom Document
1. **Enter Filename**: Type a name for your output file
2. **Type Content**: Paste or type your text
3. **Customize Settings**: 
   - Click the ⚙️ icon to access font size, line spacing, and page number options
   - Toggle **Dark Mode** using the moon/sun icon
   - Adjust **Alignment** using the alignment buttons
4. **Download**: Click PDF, DOCX, or TXT button

## 🎓 Perfect for Students

This tool is specifically designed with students in mind:
- **Essay Writing**: Use the essay template with proper formatting
- **Lab Reports**: Report template with all necessary sections
- **Assignments**: Quick assignment format with student info
- **Study Notes**: Export notes in multiple formats
- **Citations**: Easy copy-paste for bibliography management

## 📄 License

MIT License
