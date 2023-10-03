import { compressImg, convertToBase64, isImageType, getFormatFromMIME, TImage } from './image/image_utility';
import { DocumentUploadRequest } from '@deriv/api-types';

export type TFile = File & { file: Blob };

export type TSettings = {
    documentType: DocumentUploadRequest['document_type'];
    pageType: DocumentUploadRequest['page_type'];
    expirationDate?: string;
    documentId?: string;
    lifetimeValid?: boolean;
    document_issuing_country?: string;
};

type TFileObject = TSettings & {
    filename: File['name'];
    buffer: FileReader['result'];
    documentFormat: string;
    file_size: File['size'];
};

export const truncateFileName = (file: TFile, limit: number) => {
    const string_limit_regex = new RegExp(`(.{${limit || 30}})..+`);
    return file?.name?.replace(string_limit_regex, `$1….${getFileExtension(file)}`);
};

export const getFileExtension = (file: TFile) => {
    const f = file?.type?.match(/[^/]+$/);
    return f && f[0];
};

export const compressImageFiles = (files?: FileList | null) => {
    if (!files?.length) return Promise.resolve([]);

    const promises: Promise<Blob>[] = [];
    Array.from(files).forEach(file => {
        const promise = new Promise<Blob>(resolve => {
            if (isImageType(file.type)) {
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

export const readFiles = (files: Blob[], getFileReadErrorMessage: (t: string) => string, settings: TSettings) => {
    const promises: Promise<TFileObject | { message: string }>[] = [];

    files.forEach(f => {
        const fr = new FileReader();
        const promise = new Promise<TFileObject | { message: string }>(resolve => {
            fr.onload = () => {
                const file_obj = {
                    filename: f.name,
                    buffer: fr.result,
                    documentFormat: getFormatFromMIME(f),
                    file_size: f.size,
                    ...settings,
                    documentType: settings?.documentType || 'utility_bill',
                };
                resolve(file_obj);
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

export const max_document_size = 8388608;

export const supported_filetypes = 'image/png, image/jpeg, image/jpg, image/gif, application/pdf';

export const getSupportedFiles = (filename: string) =>
    /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|pdf|PDF)$/.test(filename);
