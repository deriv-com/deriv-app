// [TODO] - Will replace the content of this file when it is available in Deriv-utils
import { useMutation } from '@deriv/api-v2';
import { UPLOAD_FILE_TYPE } from 'src/constants';
import 'canvas-toBlob';

declare global {
    interface Blob {
        lastModifiedDate: number;
        name: string;
    }
}

export type TImage = {
    filename: string;
    src: string;
};

export type TFile = File & { file: Blob };

const compressImg = (image: TImage): Promise<Blob> =>
    new Promise(resolve => {
        const img = new Image();
        img.src = image.src;
        img.onload = () => {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            const canvasRes = canvas.getContext('2d');
            if (!canvasRes || !(canvasRes instanceof CanvasRenderingContext2D)) {
                throw new Error('Failed to get 2D context');
            }
            const context: CanvasRenderingContext2D = canvasRes;
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
            const result = { filename: file.name, src: reader.result };
            resolve(result);
        };
    });

const isImageType = (filename: string) => /(gif|jpg|jpeg|tiff|png)$/i.test(filename);

const getFormatFromMIME = (file: Blob) =>
    (file.type.split('/')[1] || (file.name.match(/\.([\w\d]+)$/) || [])[1] || '').toUpperCase();

export { compressImg, convertToBase64, getFormatFromMIME, isImageType };

export type TSettings = Parameters<ReturnType<typeof useMutation<'document_upload'>>['mutate']>[0]['payload'];

export type TFileObject = TSettings & {
    buffer: FileReader['result'];
    documentFormat: string;
    file_size: File['size'];
    filename: File['name'];
};

export const truncateFileName = (file: File, limit: number) => {
    const stringLimitRegex = new RegExp(`(.{${limit || 30}})..+`);
    return file?.name?.replace(stringLimitRegex, `$1….${getFileExtension(file)}`);
};

export const getFileExtension = (file: Blob) => {
    const f = file?.type?.match(/[^/]+$/);
    return f && f[0];
};

export const compressImageFiles = (files?: File[]) => {
    if (!files?.length) return Promise.resolve([]);

    const promises: Promise<Blob>[] = [];
    Array.from(files).forEach(file => {
        const promise = new Promise<Blob>(resolve => {
            if (isImageType(file?.type)) {
                convertToBase64(file).then(img => {
                    compressImg(img as TImage).then(resolve);
                });
            } else {
                resolve(file);
            }
        });
        promises.push(promise);
    });

    return Promise.all(promises);
};

export const readFiles = (
    files: Blob[],
    getFileReadErrorMessage: (t: string) => string,
    settings?: Partial<TSettings>
) => {
    const promises: Promise<Partial<TFileObject> | { message: string }>[] = [];

    files.forEach(f => {
        const fr = new FileReader();
        const promise = new Promise<Partial<TFileObject> | { message: string }>(resolve => {
            fr.onload = () => {
                const fileMetaData = {
                    buffer: fr.result,
                    document_issuing_country: settings?.document_issuing_country,
                    documentFormat: getFormatFromMIME(f),
                    documentId: settings?.document_id,
                    documentType: settings?.document_type ?? UPLOAD_FILE_TYPE.utilityBill,
                    expirationDate: settings?.expiration_date,
                    file_size: f.size,
                    filename: f.name,
                    lifetimeValid: settings?.lifetime_valid,
                    pageType: settings?.page_type,
                    proof_of_ownership: settings?.proof_of_ownership,
                };
                resolve(fileMetaData);
            };

            fr.onerror = () => {
                resolve({
                    message:
                        typeof getFileReadErrorMessage === 'function'
                            ? getFileReadErrorMessage(f.name)
                            : `Unable to read file ${f.name}`,
                });
            };
            // Reading file
            fr.readAsArrayBuffer(f);
        });

        promises.push(promise);
    });

    return Promise.all(promises);
};

export const MAX_DOCUMENT_SIZE = 8388608;

export const SUPPORTED_FILE_TYPES = 'image/png, image/jpeg, image/jpg, image/gif, application/pdf';

export const getSupportedFiles = (filename: string) =>
    /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|pdf|PDF)$/.test(filename);
