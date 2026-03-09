import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { parseMarkdown, sanitizeFilename } from '../utils/markdown';
import type { Alignment } from '../types';

interface PDFOptions {
    fontSize: number;
    lineSpacing: number;
    alignment: Alignment;
    addPageNumbers: boolean;
    fontFamily: string;
    watermarkText: string;
    pdfPassword: string;
}

export const usePDFGenerator = () => {
    /**
     * Generate a basic PDF from text content.
     */
    const generatePDF = useCallback(
        async (text: string, filename: string, options: PDFOptions): Promise<{ success: boolean; message: string }> => {
            if (!text) return { success: false, message: 'No text to convert' };

            try {
                const doc = new jsPDF();
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 20;
                const lineHeight = options.fontSize * options.lineSpacing * 0.35;

                doc.setFontSize(options.fontSize);

                let cursorY = margin;
                let pageNumber = 1;

                const lines = text.split('\n');

                lines.forEach((line) => {
                    const segments = parseMarkdown(line);

                    if (cursorY + lineHeight > pageHeight - margin - (options.addPageNumbers ? 10 : 0)) {
                        if (options.addPageNumbers) {
                            doc.setFontSize(10);
                            doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                            doc.setFontSize(options.fontSize);
                        }
                        doc.addPage();
                        pageNumber++;
                        cursorY = margin;
                    }

                    let currentX = margin;
                    if (options.alignment === 'center') {
                        let totalWidth = 0;
                        segments.forEach(seg => { totalWidth += doc.getTextWidth(seg.text); });
                        currentX = (pageWidth - totalWidth) / 2;
                    } else if (options.alignment === 'right') {
                        let totalWidth = 0;
                        segments.forEach(seg => { totalWidth += doc.getTextWidth(seg.text); });
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

                if (options.addPageNumbers) {
                    doc.setFontSize(10);
                    doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                }

                const cleanFilename = sanitizeFilename(filename);
                doc.save(`${cleanFilename}.pdf`);
                return { success: true, message: 'PDF generated successfully!' };
            } catch (error) {
                console.error('Error generating PDF:', error);
                return { success: false, message: 'Failed to generate PDF. Please try again.' };
            }
        },
        []
    );

    /**
     * Generate a PDF with watermark and optional password protection.
     */
    const generatePDFWithProtection = useCallback(
        async (text: string, filename: string, options: PDFOptions): Promise<{ success: boolean; message: string }> => {
            if (!text) return { success: false, message: 'No text to convert' };

            try {
                const doc = new jsPDF({
                    encryption: options.pdfPassword ? {
                        userPassword: options.pdfPassword,
                        ownerPassword: options.pdfPassword,
                        userPermissions: ['print', 'modify', 'copy', 'annot-forms']
                    } : undefined
                });
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 20;
                const lineHeight = options.fontSize * options.lineSpacing * 0.35;

                doc.setFontSize(options.fontSize);

                let cursorY = margin;
                let pageNumber = 1;

                const lines = text.split('\n');

                lines.forEach((line) => {
                    const segments = parseMarkdown(line);

                    if (cursorY + lineHeight > pageHeight - margin - (options.addPageNumbers ? 10 : 0)) {
                        if (options.addPageNumbers) {
                            doc.setFontSize(10);
                            doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                            doc.setFontSize(options.fontSize);
                        }
                        doc.addPage();
                        pageNumber++;
                        cursorY = margin;
                    }

                    let currentX = margin;
                    if (options.alignment === 'center') {
                        let totalWidth = 0;
                        segments.forEach(seg => { totalWidth += doc.getTextWidth(seg.text); });
                        currentX = (pageWidth - totalWidth) / 2;
                    } else if (options.alignment === 'right') {
                        let totalWidth = 0;
                        segments.forEach(seg => { totalWidth += doc.getTextWidth(seg.text); });
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

                if (options.addPageNumbers) {
                    doc.setFontSize(10);
                    doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                }

                // Add watermark if specified
                if (options.watermarkText) {
                    const totalPages = doc.getNumberOfPages();
                    for (let i = 1; i <= totalPages; i++) {
                        doc.setPage(i);
                        doc.setFontSize(60);
                        doc.setTextColor(200, 200, 200);
                        doc.text(options.watermarkText, pageWidth / 2, pageHeight / 2, {
                            align: 'center',
                            angle: 45
                        });
                    }
                }

                const cleanFilename = sanitizeFilename(filename);
                doc.save(`${cleanFilename}.pdf`);

                if (options.pdfPassword) {
                    return { success: true, message: 'Password-protected PDF generated successfully!' };
                } else {
                    return { success: true, message: 'PDF generated successfully!' };
                }
            } catch (error) {
                console.error('Error generating PDF:', error);
                return { success: false, message: 'Failed to generate PDF' };
            }
        },
        []
    );

    return { generatePDF, generatePDFWithProtection };
};
