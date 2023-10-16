import 'canvas-toBlob';

declare global {
    interface Blob {
        lastModifiedDate: number;
        name: string;
    }
}

export type TImage = {
    src: string;
    filename: string;
};

export type TFile = File & { file: Blob };

const compressImg = (image: TImage): Promise<Blob> =>
    new Promise(resolve => {
        const img = new Image();
        img.src = image.src;
        img.onload = () => {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            const canvas_res = canvas.getContext('2d');
            if (!canvas_res || !(canvas_res instanceof CanvasRenderingContext2D)) {
                throw new Error('Failed to get 2D context');
            }
            const context: CanvasRenderingContext2D = canvas_res;
            if (img.naturalWidth > 2560) {
                const width = 2560;
                const scaleFactor = width / img.naturalWidth;
                canvas.width = width;
                canvas.height = img.naturalHeight * scaleFactor;
            } else {
                canvas.height = img.naturalHeight;
                canvas.width = img.naturalWidth;
            }

            context.fillStyle = 'transparent';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.save();
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                blob => {
                    const filename = image.filename.replace(/\.[^/.]+$/, '.jpg');
                    const file = new Blob([blob as BlobPart], {
                        type: 'image/jpeg',
                    });
                    file.lastModifiedDate = Date.now();
                    file.name = filename;
                    resolve(file);
                },
                'image/jpeg',
                0.9
            ); // <----- set quality here
        };
    });

const convertToBase64 = (file: File) =>
    new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const result = { src: reader.result, filename: file.name };
            resolve(result);
        };
    });

const isImageType = (filename: string) => /(gif|jpg|jpeg|tiff|png)$/i.test(filename);

const getFormatFromMIME = (file: Blob) =>
    (file.type.split('/')[1] || (file.name.match(/\.([\w\d]+)$/) || [])[1] || '').toUpperCase();

export { compressImg, convertToBase64, isImageType, getFormatFromMIME };
