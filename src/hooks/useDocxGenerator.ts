import { useCallback } from 'react';
import { Document, Packer, Paragraph, TextRun, AlignmentType, UnderlineType } from 'docx';
import { saveAs } from 'file-saver';
import { parseMarkdown, sanitizeFilename } from '../utils/markdown';
import type { Alignment } from '../types';

interface DOCXOptions {
    fontSize: number;
    lineSpacing: number;
    alignment: Alignment;
    fontFamily: string;
}

export const useDocxGenerator = () => {
    const generateDOCX = useCallback(
        async (text: string, filename: string, options: DOCXOptions): Promise<{ success: boolean; message: string }> => {
            if (!text) return { success: false, message: 'No text to convert' };

            try {
                let docAlignment: typeof AlignmentType.LEFT | typeof AlignmentType.CENTER | typeof AlignmentType.RIGHT = AlignmentType.LEFT;
                if (options.alignment === 'center') docAlignment = AlignmentType.CENTER;
                if (options.alignment === 'right') docAlignment = AlignmentType.RIGHT;

                const paragraphs = text.split('\n').map(line => {
                    const segments = parseMarkdown(line);

                    return new Paragraph({
                        alignment: docAlignment,
                        spacing: {
                            line: Math.round(options.lineSpacing * 240),
                        },
                        children: segments.map(seg => new TextRun({
                            text: seg.text,
                            size: options.fontSize * 2,
                            bold: seg.bold,
                            italics: seg.italic,
                            underline: seg.underline ? { type: UnderlineType.SINGLE } : undefined,
                            font: options.fontFamily,
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
                return { success: true, message: 'DOCX generated successfully!' };
            } catch (error) {
                console.error('Error generating DOCX:', error);
                return { success: false, message: 'Failed to generate DOCX. Please try again.' };
            }
        },
        []
    );

    return { generateDOCX };
};
