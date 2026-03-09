import type { ToastType } from '../components/Toast';

export type Alignment = 'left' | 'center' | 'right';

export interface TextStats {
    words: number;
    chars: number;
    paragraphs: number;
    sentences: number;
    readingTime: number;
}

export interface TextSegment {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}

export interface ExportPreset {
    name: string;
    fontSize: number;
    lineSpacing: number;
    alignment: string;
    pageNumbers: boolean;
    fontFamily: string;
}

export interface ToastState {
    message: string;
    type: ToastType;
    visible: boolean;
}

export interface EditorSettings {
    fontSize: number;
    lineSpacing: number;
    fontFamily: string;
    alignment: Alignment;
    addPageNumbers: boolean;
    watermarkText: string;
    pdfPassword: string;
}
