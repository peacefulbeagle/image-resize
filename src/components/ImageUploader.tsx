import { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { cn } from '../utils/utils';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          onImageSelect(file);
        } else {
          alert('Please upload a valid image file (JPEG, PNG, WebP).');
        }
      }
    },
    [onImageSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type.startsWith('image/')) {
          onImageSelect(file);
        }
      }
    },
    [onImageSelect]
  );

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-72 rounded-[2rem] border-[1.5px] border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden",
        isDragging 
          ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(56,189,248,0.1)]" 
          : "border-slate-700/60 bg-transparent hover:border-slate-500"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleChange}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
        <div className={cn(
          "p-4 rounded-full transition-colors duration-300 mb-2",
          isDragging ? "bg-primary/20 text-primary" : "bg-[#1E293B]/80 text-slate-400"
        )}>
          {isDragging ? <UploadCloud size={40} /> : <ImageIcon size={40} />}
        </div>
        <div className="text-center space-y-1">
          <p className="text-[15px] font-semibold text-white tracking-wide">
            {isDragging ? "Drop your image here" : "Drag & Drop your image here"}
          </p>
          <p className="text-xs text-slate-500">
            or click to browse (JPEG, PNG, WebP)
          </p>
        </div>
      </div>
    </div>
  );
};
