import { Download } from 'lucide-react';
import { formatBytes } from '../utils/imageProcessing';
import { cn } from '../utils/utils';

interface ImagePreviewProps {
  originalImage: string | null;
  processedImage: string | null;
  originalSize: number;
  processedSize: number;
  originalDimensions: { width: number; height: number };
  processedDimensions: { width: number; height: number };
  isProcessing: boolean;
  onDownload: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  originalImage,
  processedImage,
  originalSize,
  processedSize,
  originalDimensions,
  processedDimensions,
  isProcessing,
  onDownload
}) => {
  if (!originalImage) {
    return (
      <div className="h-full min-h-[500px] flex items-center justify-center bg-[#131B2F]/40 rounded-[2rem] border border-slate-800/60 shadow-inner">
        <p className="text-slate-500/80 text-[13px] font-medium tracking-wide">Upload an image to see the preview</p>
      </div>
    );
  }

  const savings = originalSize > 0 ? ((originalSize - processedSize) / originalSize) * 100 : 0;
  const isBigger = processedSize > originalSize;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Original */}
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-end">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Original</h3>
            <span className="text-xs text-slate-500">
              {originalDimensions.width} × {originalDimensions.height} px
            </span>
          </div>
          <div className="relative flex-1 bg-surface rounded-2xl border border-slate-700/50 overflow-hidden group min-h-[250px]">
            <img 
              src={originalImage} 
              alt="Original" 
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          <div className="bg-slate-800/50 py-2 px-4 rounded-lg flex justify-between items-center text-sm">
            <span className="text-slate-400">File Size</span>
            <span className="font-mono text-slate-200">{formatBytes(originalSize)}</span>
          </div>
        </div>

        {/* Processed */}
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-end">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center">
              Output
              {isProcessing && (
                <span className="ml-2 w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
              )}
            </h3>
            <span className="text-xs text-primary/80">
              {processedDimensions.width} × {processedDimensions.height} px
            </span>
          </div>
          <div className="relative flex-1 bg-surface rounded-2xl border border-primary/30 overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.05)] min-h-[250px]">
            {processedImage && (
              <img 
                src={processedImage} 
                alt="Processed" 
                className={cn(
                  "absolute inset-0 w-full h-full object-contain transition-opacity duration-300",
                  isProcessing ? "opacity-50" : "opacity-100"
                )}
              />
            )}
          </div>
          <div className={cn(
            "py-2 px-4 rounded-lg flex justify-between items-center text-sm transition-colors",
            isBigger ? "bg-red-500/10 text-red-400" : "bg-success/10 text-success"
          )}>
            <span>New Size</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono">{formatBytes(processedSize)}</span>
              {!isBigger && savings > 0 && (
                <span className="text-xs bg-success/20 px-2 py-0.5 rounded-full text-success">
                  -{savings.toFixed(1)}%
                </span>
              )}
              {isBigger && (
                <span className="text-xs bg-red-500/20 px-2 py-0.5 rounded-full text-red-400">
                  +{(savings * -1).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onDownload}
        disabled={isProcessing || !processedImage}
        className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98]"
      >
        <Download size={20} />
        <span>Download Optimized Image</span>
      </button>
    </div>
  );
};
