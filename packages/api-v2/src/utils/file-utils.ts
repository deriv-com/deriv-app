const DEFAULT_IMAGE_WIDTH = 2560;
const DEFAULT_IMAGE_QUALITY = 0.9;
const WORD_SIZE = 4;

type TCompressImageOption = {
    maxWidth?: number;
    quality?: number;
};

type TBase64Image = {
    filename: string;
    src: string;
};

type TCompressImage = TBase64Image & {
    options?: TCompressImageOption;
};

export type TFileObject = {
    filename: File['name'];
    buffer: FileReader['result'];
    fileSize: File['size'];
};

/**
 * Compress an image and return it as a Blob.
 * @param {TCompressImage} params - The parameters for image compression.
 * @param {string} params.src - The source image URL or data URI.
 * @param {string} params.filename - The desired filename for the compressed image.
 * @param {Object} [params.options] - Options for image compression.
 * @param {number} [params.options.maxWidth=DEFAULT_IMAGE_WIDTH] - The maximum width for the compressed image.
 * @param {number} [params.options.quality=DEFAULT_IMAGE_QUALITY] - The image quality (0 to 1) for compression.
 * @returns {Promise<Blob>} A Promise that resolves with the compressed image as a Blob.
 */
export const compressImage = ({ src, filename, options }: TCompressImage): Promise<Blob> => {
    const { maxWidth = DEFAULT_IMAGE_WIDTH, quality = DEFAULT_IMAGE_QUALITY } = options || {};

    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const canvas_context = canvas.getContext('2d');
            if (!canvas_context || !(canvas_context instanceof CanvasRenderingContext2D)) {
                return reject(new Error('Failed to get 2D context'));
            }

            if (image.naturalWidth > maxWidth) {
                const width = DEFAULT_IMAGE_WIDTH;
                const scaleFactor = width / image.naturalWidth;
                canvas.width = width;
                canvas.height = image.naturalHeight * scaleFactor;
            } else {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
            }

            canvas_context.fillStyle = 'transparent';
            canvas_context.fillRect(0, 0, canvas.width, canvas.height);
            canvas_context.save();
            canvas_context.drawImage(image, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                blob => {
                    if (!blob) return;
                    const modified_filename = filename.replace(/\.[^/.]+$/, '.jpg');
                    const file = new Blob([blob], { type: 'image/jpeg' });
                    file.lastModifiedDate = Date.now();
                    file.name = modified_filename;
                    resolve(file);
                },
                'image/jpeg',
                quality
            );
        };
    });
};

/**
 * Convert a File to a Base64 encoded image representation.
 * @param {File} file - The File object to convert to Base64.
 * @returns {Promise<TBase64Image>} A Promise that resolves with an object containing the Base64 image data and the filename.
 */
export const convertToBase64 = (file: File): Promise<TBase64Image> => {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            resolve({
                src: reader.result?.toString() || '',
                filename: file.name,
            });
        };
    });
};

/**
 * Check if a given filename has a supported image format extension.
 *
 * @param {string} filename - The filename to check for a supported image format.
 * @returns {boolean} True if the filename has a supported image format extension, false otherwise.
 */
export const isSupportedImageFormat = (filename: string) => /\.(png|jpg|jpeg|gif|pdf)$/gi.test(filename ?? '');

/**
 * Convert image to base64 and cmpress an image file if it is a supported image format.
 *
 * @param {File} file - The File object to compress.
 * @returns {Promise<Blob>} A Promise that resolves with the compressed image as a Blob.
 */
export const compressImageFile = (file: File) => {
    return new Promise<Blob>(resolve => {
        if (isSupportedImageFormat(file.name)) {
            convertToBase64(file).then(img => {
                compressImage(img).then(resolve);
            });
        } else {
            resolve(file);
        }
    });
};

/**
 * Get Uint8Array from number
 *
 * @param {num} number - The number to convert to Uint8Array.
 * @returns {Uint8Array} Uint8Array
 */
export function numToUint8Array(num: number) {
    const typedArray = new Uint8Array(WORD_SIZE);
    const dv = new DataView(typedArray.buffer);
    dv.setUint32(0, num);
    return typedArray;
}

/**
 * Turn binary into array of chunks
 *
 * @param {binary} Uint8Array - Uint8Array to be chunked.
 * @returns {Uint8Array[]} Array of Uint8Array chunks
 */
export const generateChunks = (binary: Uint8Array, { chunkSize = 16384 /* 16KB */ }) => {
    const chunks = [];
    for (let i = 0; i < binary.length; i++) {
        const item = binary[i];
        if (i % chunkSize === 0) {
            chunks.push([item]);
        } else {
            chunks[chunks.length - 1].push(item);
        }
    }
    return chunks.map(b => new Uint8Array(b)).concat(new Uint8Array([]));
};

/**
 * Read a file and return it as modified object with a buffer of the file contents.
 * @param {Blob} file - The file to read.
 * @returns {Promise<TFileObject>} A Promise that resolves with the file as a TFileObject.
 *
 */
export const readFile = (file: Blob) => {
    const fr = new FileReader();
    return new Promise<
        | TFileObject
        | {
              message: string;
          }
    >(resolve => {
        fr.onload = () => {
            const fileMetadata = {
                filename: file.name,
                buffer: fr.result,
                fileSize: file.size,
            };
            resolve(fileMetadata);
        };

        fr.onerror = () => {
            resolve({
                message: `Unable to read file ${file.name}`,
            });
        };

        // Reading file
        fr.readAsArrayBuffer(file);
    });
};
