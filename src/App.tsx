import { useState, useEffect, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { DimensionController } from './components/DimensionController';
import { SizeController } from './components/SizeController';
import { ImagePreview } from './components/ImagePreview';
import { resizeAndCompressImage } from './utils/imageProcessing';

function App() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [processedSize, setProcessedSize] = useState<number>(0);
  
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [targetDimensions, setTargetDimensions] = useState({ width: 0, height: 0 });
  
  const [targetSizeBytes, setTargetSizeBytes] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImageSelect = (file: File) => {
    setOriginalFile(file);
    setOriginalSize(file.size);
    
    const objectUrl = URL.createObjectURL(file);
    setOriginalImage(objectUrl);
    
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setTargetDimensions({ width: img.width, height: img.height });
    };
    img.src = objectUrl;
  };

  const processImage = useCallback(async () => {
    if (!originalFile || targetDimensions.width === 0) return;
    
    setIsProcessing(true);
    try {
      // Determine format based on original file type, defaulting to jpeg if unsupported
      const type = originalFile.type;
      const outputFormat = (type === 'image/jpeg' || type === 'image/webp' || type === 'image/png') 
        ? type as 'image/jpeg' | 'image/webp' | 'image/png' 
        : 'image/jpeg';

      const result = await resizeAndCompressImage(
        originalFile,
        targetDimensions.width,
        targetDimensions.height,
        targetSizeBytes,
        outputFormat
      );
      
      setProcessedImage(result.dataUrl);
      setProcessedSize(result.size);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [originalFile, targetDimensions, targetSizeBytes]);

  // Debounce the processing so it doesn't run on every single keystroke instantly
  useEffect(() => {
    const timer = setTimeout(() => {
      processImage();
    }, 500);
    return () => clearTimeout(timer);
  }, [processImage]);

  const handleDownload = () => {
    if (!processedImage || !originalFile) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    
    // Create new filename
    const nameParts = originalFile.name.split('.');
    const ext = nameParts.pop();
    const baseName = nameParts.join('.');
    link.download = `${baseName}_resized.${ext}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 font-sans selection:bg-primary/30">
      <header className="bg-surface border-b border-slate-800/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              ProResizer
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: Controls */}
          <div className="xl:col-span-4 space-y-6">
            {!originalImage ? (
              <ImageUploader onImageSelect={handleImageSelect} />
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-slate-700/50">
                  <span className="text-sm text-slate-300 truncate mr-4">
                    {originalFile?.name}
                  </span>
                  <button 
                    onClick={() => {
                      setOriginalImage(null);
                      setProcessedImage(null);
                      setOriginalFile(null);
                    }}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Change Image
                  </button>
                </div>

                <DimensionController 
                  originalWidth={originalDimensions.width}
                  originalHeight={originalDimensions.height}
                  onDimensionChange={(w, h) => setTargetDimensions({ width: Math.round(w), height: Math.round(h) })}
                />
                
                <SizeController 
                  onSizeTargetChange={setTargetSizeBytes}
                />
              </div>
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="xl:col-span-8 bg-surface/30 p-6 rounded-3xl border border-slate-800 min-h-[500px]">
            <ImagePreview 
              originalImage={originalImage}
              processedImage={processedImage}
              originalSize={originalSize}
              processedSize={processedSize}
              originalDimensions={originalDimensions}
              processedDimensions={targetDimensions}
              isProcessing={isProcessing}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
