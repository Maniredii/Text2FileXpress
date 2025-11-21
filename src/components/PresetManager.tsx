import React from 'react';
import { X, Save, Trash2, Download } from 'lucide-react';

interface ExportPreset {
    name: string;
    fontSize: number;
    lineSpacing: number;
    alignment: string;
    pageNumbers: boolean;
    fontFamily: string;
}

interface PresetManagerProps {
    isOpen: boolean;
    onClose: () => void;
    currentSettings: ExportPreset;
    onLoadPreset: (preset: ExportPreset) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({ isOpen, onClose, currentSettings, onLoadPreset }) => {
    const [presets, setPresets] = React.useState<ExportPreset[]>([]);
    const [presetName, setPresetName] = React.useState('');

    React.useEffect(() => {
        // Load presets from localStorage
        const saved = localStorage.getItem('exportPresets');
        if (saved) {
            setPresets(JSON.parse(saved));
        }
    }, [isOpen]);

    const savePreset = () => {
        if (!presetName.trim()) return;

        const newPreset = { ...currentSettings, name: presetName };
        const updated = [...presets, newPreset];
        setPresets(updated);
        localStorage.setItem('exportPresets', JSON.stringify(updated));
        setPresetName('');
    };

    const deletePreset = (index: number) => {
        const updated = presets.filter((_, i) => i !== index);
        setPresets(updated);
        localStorage.setItem('exportPresets', JSON.stringify(updated));
    };

    const loadPreset = (preset: ExportPreset) => {
        onLoadPreset(preset);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Export Presets</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Save Current Settings */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Save Current Settings</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                            placeholder="Preset name..."
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                            onClick={savePreset}
                            disabled={!presetName.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save size={18} />
                            Save
                        </button>
                    </div>
                </div>

                {/* Saved Presets */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Saved Presets</h3>
                    {presets.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No saved presets yet</p>
                    ) : (
                        <div className="space-y-2">
                            {presets.map((preset, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 dark:text-white">{preset.name}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {preset.fontSize}pt • {preset.lineSpacing}x spacing • {preset.alignment} • {preset.fontFamily}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => loadPreset(preset)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                        >
                                            <Download size={14} />
                                            Load
                                        </button>
                                        <button
                                            onClick={() => deletePreset(index)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PresetManager;
