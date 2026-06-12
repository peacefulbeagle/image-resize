export const DPI = 300;
export const INCH_TO_CM = 2.54;

export const convertDimension = (value: number, fromUnit: string, toUnit: string): number => {
  if (fromUnit === toUnit) return value;
  
  // Convert to Pixels first
  let pxValue = value;
  if (fromUnit === 'in') pxValue = value * DPI;
  else if (fromUnit === 'cm') pxValue = (value / INCH_TO_CM) * DPI;

  // Convert from Pixels to Target Unit
  if (toUnit === 'px') return Math.round(pxValue);
  else if (toUnit === 'in') return pxValue / DPI;
  else if (toUnit === 'cm') return (pxValue / DPI) * INCH_TO_CM;

  return value;
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const convertFileSize = (value: number, unit: string): number => {
  if (unit === 'MB') return value * 1024 * 1024;
  if (unit === 'KB') return value * 1024;
  return value; // Bytes
};

export const getFileSizeFromDataURL = (dataUrl: string): number => {
  const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
  const padding = (dataUrl.charAt(dataUrl.length - 2) === '=') ? 2 : ((dataUrl.charAt(dataUrl.length - 1) === '=') ? 1 : 0);
  return (base64Length * 0.75) - padding;
};

export const resizeAndCompressImage = async (
  fileOrDataUrl: File | string,
  targetWidth: number,
  targetHeight: number,
  targetSizeBytes: number | null,
  outputFormat: 'image/jpeg' | 'image/webp' | 'image/png' = 'image/jpeg'
): Promise<{ dataUrl: string; width: number; height: number; size: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Draw image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // If no target size is specified, return max quality (or default png)
      if (!targetSizeBytes || outputFormat === 'image/png') {
        const dataUrl = canvas.toDataURL(outputFormat, 1.0);
        resolve({
          dataUrl,
          width: targetWidth,
          height: targetHeight,
          size: getFileSizeFromDataURL(dataUrl),
        });
        return;
      }

      // Binary search for quality to hit target file size (JPEG/WebP)
      let minQ = 0.0;
      let maxQ = 1.0;
      let bestDataUrl = canvas.toDataURL(outputFormat, minQ); // lowest possible
      let bestSize = getFileSizeFromDataURL(bestDataUrl);
      
      if (bestSize > targetSizeBytes) {
        // Even at lowest quality, it's too big
        resolve({
          dataUrl: bestDataUrl,
          width: targetWidth,
          height: targetHeight,
          size: bestSize,
        });
        return;
      }

      for (let i = 0; i < 10; i++) { // 10 iterations max
        const midQ = (minQ + maxQ) / 2;
        const currentDataUrl = canvas.toDataURL(outputFormat, midQ);
        const currentSize = getFileSizeFromDataURL(currentDataUrl);

        if (currentSize <= targetSizeBytes) {
          bestDataUrl = currentDataUrl;
          bestSize = currentSize;
          minQ = midQ;
        } else {
          maxQ = midQ;
        }
      }

      resolve({
        dataUrl: bestDataUrl,
        width: targetWidth,
        height: targetHeight,
        size: bestSize,
      });
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    
    if (fileOrDataUrl instanceof File) {
      img.src = URL.createObjectURL(fileOrDataUrl);
    } else {
      img.src = fileOrDataUrl;
    }
  });
};
