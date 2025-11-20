# Text to PDF / DOCX Converter

A pure frontend web application to convert raw text into PDF and DOCX formats instantly. Built with React, Vite, and Tailwind CSS.

## 🔥 Features

- **100% Frontend**: No backend, no server, no database. Works offline.
- **Instant Conversion**: Generates PDF and DOCX files locally in your browser.
- **Modern UI**: Clean, responsive design with Dark Mode support.
- **Text Formatting**: Supports text alignment (Left, Center, Right).
- **Real-time Stats**: Word and character count.
- **Privacy Focused**: Your data never leaves your device.

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

4. Open your browser and visit `http://localhost:5173`.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) (Icons)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **DOCX Generation**: [docx](https://docx.js.org/)
- **File Saving**: [file-saver](https://github.com/eligrey/FileSaver.js)

## 📝 Usage

1. **Enter Filename**: Type a name for your output file (default is `output`).
2. **Type Content**: Paste or type your text in the large text area.
3. **Customize**: 
   - Toggle **Dark Mode** using the moon/sun icon.
   - Adjust **Alignment** using the alignment buttons.
4. **Download**: Click **Download as PDF** or **Download as DOCX**.

## 📄 License

MIT License
