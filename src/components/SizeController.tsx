import { useState } from 'react';
import { convertFileSize } from '../utils/imageProcessing';

export type SizeUnit = 'Bytes' | 'KB' | 'MB';

interface SizeControllerProps {
  onSizeTargetChange: (targetSizeBytes: number | null) => void;
}

export const SizeController: React.FC<SizeControllerProps> = ({ onSizeTargetChange }) => {
  const [unit, setUnit] = useState<SizeUnit>('KB');
  const [value, setValue] = useState<string>('');

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    
    const numVal = parseFloat(val);
    if (!isNaN(numVal) && numVal > 0) {
      onSizeTargetChange(convertFileSize(numVal, unit));
    } else {
      onSizeTargetChange(null);
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as SizeUnit;
    setUnit(newUnit);
    
    const numVal = parseFloat(value);
    if (!isNaN(numVal) && numVal > 0) {
      onSizeTargetChange(convertFileSize(numVal, newUnit));
    }
  };

  return (
    <div className="bg-surface p-6 rounded-2xl border border-slate-700/50 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-slate-100">Target File Size</h3>
        <p className="text-sm text-slate-400 mt-1">Leave empty for maximum quality</p>
      </div>

      <div className="flex space-x-3">
        <input
          type="number"
          value={value}
          onChange={handleValueChange}
          placeholder="e.g. 500"
          className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          min="1"
        />
        <select
          value={unit}
          onChange={handleUnitChange}
          className="bg-slate-800 text-slate-200 rounded-lg px-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="Bytes">Bytes</option>
          <option value="KB">KB</option>
          <option value="MB">MB</option>
        </select>
      </div>
    </div>
  );
};
