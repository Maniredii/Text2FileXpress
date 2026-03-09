import type { TextSegment, TextStats } from '../types';

/**
 * Parse markdown-like text into formatted segments.
 * Supports **bold**, *italic*, and __underline__.
 */
export const parseMarkdown = (text: string): TextSegment[] => {
    const segments: TextSegment[] = [];
    let currentPos = 0;

    const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(__([^_]+)__)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > currentPos) {
            segments.push({ text: text.substring(currentPos, match.index) });
        }

        if (match[1]) {
            segments.push({ text: match[2], bold: true });
        } else if (match[3]) {
            segments.push({ text: match[4], italic: true });
        } else if (match[5]) {
            segments.push({ text: match[6], underline: true });
        }

        currentPos = match.index + match[0].length;
    }

    if (currentPos < text.length) {
        segments.push({ text: text.substring(currentPos) });
    }

    return segments.length > 0 ? segments : [{ text }];
};

/**
 * Sanitize a filename to contain only safe characters.
 */
export const sanitizeFilename = (name: string): string => {
    return name.replace(/[^a-z0-9_\-]/gi, '_').replace(/_{2,}/g, '_');
};

/**
 * Calculate text statistics: word count, character count, etc.
 */
export const calculateStats = (text: string): TextStats => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const readingTime = Math.ceil(words / 200);
    return { words, chars, paragraphs, sentences, readingTime };
};

/**
 * Simple extractive text summarization.
 * Takes the first sentence of each paragraph.
 */
export const summarizeText = (text: string): string => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs
        .map(p => {
            const sentences = p.split(/[.!?]+/).filter(s => s.trim());
            return sentences[0] ? sentences[0].trim() + '.' : '';
        })
        .filter(s => s)
        .join(' ');
};

/**
 * Auto-detect and format potential headings in text.
 * Identifies short, title-case lines without ending punctuation.
 */
export const autoDetectHeadings = (text: string): string => {
    const lines = text.split('\n');
    const processedLines = lines.map(line => {
        const trimmed = line.trim();

        if (trimmed.startsWith('#')) return line;

        if (
            trimmed.length > 0 &&
            trimmed.length < 60 &&
            trimmed[0] === trimmed[0].toUpperCase() &&
            !trimmed.match(/[.!?]$/)
        ) {
            const words = trimmed.split(' ');
            const isTitleCase = words.every(w => w[0] === w[0].toUpperCase());

            if (isTitleCase) {
                return `## ${trimmed}`;
            }
        }

        return line;
    });

    return processedLines.join('\n');
};
