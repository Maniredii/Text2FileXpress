import React from 'react';
import { X, Table as TableIcon, Plus, Minus } from 'lucide-react';

interface TableEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (tableMarkdown: string) => void;
}

const TableEditor: React.FC<TableEditorProps> = ({ isOpen, onClose, onInsert }) => {
    const [rows, setRows] = React.useState(3);
    const [cols, setCols] = React.useState(3);
    const [tableData, setTableData] = React.useState<string[][]>([]);
    const [hasHeader, setHasHeader] = React.useState(true);

    React.useEffect(() => {
        // Initialize table data
        const newData: string[][] = [];
        for (let i = 0; i < rows; i++) {
            const row: string[] = [];
            for (let j = 0; j < cols; j++) {
                row.push(i === 0 && hasHeader ? `Header ${j + 1}` : '');
            }
            newData.push(row);
        }
        setTableData(newData);
    }, [rows, cols, hasHeader]);

    const updateCell = (rowIndex: number, colIndex: number, value: string) => {
        const newData = [...tableData];
        newData[rowIndex][colIndex] = value;
        setTableData(newData);
    };

    const generateMarkdown = () => {
        let markdown = '\n';

        tableData.forEach((row, rowIndex) => {
            markdown += '| ' + row.join(' | ') + ' |\n';

            // Add separator after header row
            if (rowIndex === 0 && hasHeader) {
                markdown += '| ' + Array(cols).fill('---').join(' | ') + ' |\n';
            }
        });

        markdown += '\n';
        return markdown;
    };

    const handleInsert = () => {
        const markdown = generateMarkdown();
        onInsert(markdown);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <TableIcon size={24} />
                        Table Editor
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Table Controls */}
                <div className="mb-4 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rows:</label>
                        <button
                            onClick={() => setRows(Math.max(1, rows - 1))}
                            className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-gray-900 dark:text-white">{rows}</span>
                        <button
                            onClick={() => setRows(Math.min(20, rows + 1))}
                            className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Columns:</label>
                        <button
                            onClick={() => setCols(Math.max(1, cols - 1))}
                            className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-gray-900 dark:text-white">{cols}</span>
                        <button
                            onClick={() => setCols(Math.min(10, cols + 1))}
                            className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={hasHeader}
                            onChange={(e) => setHasHeader(e.target.checked)}
                            className="rounded"
                        />
                        Header Row
                    </label>
                </div>

                {/* Table Grid */}
                <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                        <tbody>
                            {tableData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`border border-gray-300 dark:border-gray-600 p-0 ${rowIndex === 0 && hasHeader ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                }`}
                                        >
                                            <input
                                                type="text"
                                                value={cell}
                                                onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                                className={`w-full px-2 py-1.5 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${rowIndex === 0 && hasHeader ? 'font-semibold' : ''
                                                    }`}
                                                placeholder={rowIndex === 0 && hasHeader ? `Header ${colIndex + 1}` : 'Cell'}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Insert Table
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableEditor;
