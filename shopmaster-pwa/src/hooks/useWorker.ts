import { useCallback } from 'react';

const workerCode = `
self.onmessage = async (e) => {
  const { file } = e.data;
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  
  // Simple resize logic to max 500px width for compression
  const MAX_WIDTH = 500;
  let width = bitmap.width;
  let height = bitmap.height;
  
  if (width > MAX_WIDTH) {
    height *= MAX_WIDTH / width;
    width = MAX_WIDTH;
  }
  
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(bitmap, 0, 0, width, height);
  
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 });
  self.postMessage({ blob });
};
`;

export const useImageCompression = () => {
  const compressImage = useCallback((file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      worker.onmessage = (e) => {
        resolve(e.data.blob);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };

      worker.onerror = (e) => {
        reject(e);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };

      worker.postMessage({ file });
    });
  }, []);

  return { compressImage };
};
