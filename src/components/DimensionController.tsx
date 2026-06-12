import { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { cn } from '../utils/utils';
import { convertDimension } from '../utils/imageProcessing';

export type DimensionUnit = 'px' | 'cm' | 'in';

interface DimensionControllerProps {
  originalWidth: number;
  originalHeight: number;
  onDimensionChange: (widthPx: number, heightPx: number) => void;
}

export const DimensionController: React.FC<DimensionControllerProps> = ({
  originalWidth,
  originalHeight,
  onDimensionChange,
}) => {
  const [unit, setUnit] = useState<DimensionUnit>('px');
  const [width, setWidth] = useState<string>(originalWidth.toString());
  const [height, setHeight] = useState<string>(originalHeight.toString());
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const aspectRatio = originalWidth / originalHeight;

  useEffect(() => {
    // Whenever original image changes, reset to original dimensions
    const w = convertDimension(originalWidth, 'px', unit);
    const h = convertDimension(originalHeight, 'px', unit);
    setWidth(w.toFixed(unit === 'px' ? 0 : 2));
    setHeight(h.toFixed(unit === 'px' ? 0 : 2));
  }, [originalWidth, originalHeight, unit]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWidth(val);
    
    const numVal = parseFloat(val);
    if (!isNaN(numVal) && numVal > 0) {
      let newHeight = height;
      if (lockAspectRatio) {
        // Calculate proportional height
        const wPx = convertDimension(numVal, unit, 'px');
        const hPx = wPx / aspectRatio;
        const convertedHeight = convertDimension(hPx, 'px', unit);
        newHeight = convertedHeight.toFixed(unit === 'px' ? 0 : 2);
        setHeight(newHeight);
      }
      onDimensionChange(
        convertDimension(numVal, unit, 'px'),
        convertDimension(parseFloat(newHeight), unit, 'px')
      );
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHeight(val);

    const numVal = parseFloat(val);
    if (!isNaN(numVal) && numVal > 0) {
      let newWidth = width;
      if (lockAspectRatio) {
        const hPx = convertDimension(numVal, unit, 'px');
        const wPx = hPx * aspectRatio;
        const convertedWidth = convertDimension(wPx, 'px', unit);
        newWidth = convertedWidth.toFixed(unit === 'px' ? 0 : 2);
        setWidth(newWidth);
      }
      onDimensionChange(
        convertDimension(parseFloat(newWidth), unit, 'px'),
        convertDimension(numVal, unit, 'px')
      );
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as DimensionUnit;
    const currentWPx = convertDimension(parseFloat(width) || originalWidth, unit, 'px');
    const currentHPx = convertDimension(parseFloat(height) || originalHeight, unit, 'px');
    
    setUnit(newUnit);
    setWidth(convertDimension(currentWPx, 'px', newUnit).toFixed(newUnit === 'px' ? 0 : 2));
    setHeight(convertDimension(currentHPx, 'px', newUnit).toFixed(newUnit === 'px' ? 0 : 2));
  };

  return (
    <div className="bg-surface p-6 rounded-2xl border border-slate-700/50 shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-100">Dimensions</h3>
        <select
          value={unit}
          onChange={handleUnitChange}
          className="bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="px">Pixels (px)</option>
          <option value="cm">Centimeters (cm)</option>
          <option value="in">Inches (in)</option>
        </select>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-1">Width</label>
          <input
            type="number"
            value={width}
            onChange={handleWidthChange}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            min="1"
          />
        </div>

        <button
          onClick={() => setLockAspectRatio(!lockAspectRatio)}
          className={cn(
            "mt-5 p-2 rounded-lg transition-colors duration-200",
            lockAspectRatio ? "bg-primary/20 text-primary" : "bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700"
          )}
          title={lockAspectRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
        >
          {lockAspectRatio ? <Lock size={18} /> : <Unlock size={18} />}
        </button>

        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-1">Height</label>
          <input
            type="number"
            value={height}
            onChange={handleHeightChange}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            min="1"
          />
        </div>
      </div>
      
      {unit !== 'px' && (
        <p className="text-xs text-slate-500 mt-3 flex items-center">
          <span className="w-2 h-2 rounded-full bg-primary/50 mr-2 inline-block"></span>
          Assuming 300 DPI for print conversion
        </p>
      )}
    </div>
  );
};
