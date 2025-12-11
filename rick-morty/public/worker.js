// worker.js
self.onmessage = async (e) => {
    const { file, type } = e.data; // file is ArrayBuffer

    // Use OffscreenCanvas if available, otherwise strict limitations apply
    if (typeof OffscreenCanvas !== 'undefined') {
        try {
            const blob = new Blob([file], { type });
            const bitmap = await createImageBitmap(blob);
            
            // Resize logic: max dimension 300px
            const maxDim = 300;
            let width = bitmap.width;
            let height = bitmap.height;
            
            if (width > height) {
                if (width > maxDim) {
                    height *= maxDim / width;
                    width = maxDim;
                }
            } else {
                if (height > maxDim) {
                    width *= maxDim / height;
                    height = maxDim;
                }
            }

            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bitmap, 0, 0, width, height);

            const compressedBlob = await canvas.convertToBlob({
                type: 'image/jpeg',
                quality: 0.7
            });

            self.postMessage({ blob: compressedBlob });
        } catch (err) {
            // Fallback: return original if compression fails in worker
            console.error(err);
            self.postMessage({ blob: new Blob([file], { type }) });
        }
    } else {
        // Fallback for browsers without OffscreenCanvas
        self.postMessage({ blob: new Blob([file], { type }) });
    }
};