import { useMutation } from '@deriv/api';
import { compressImg, convertToBase64, isImageType, getFormatFromMIME, TImage } from './image/image_utility';

export type TSettings = Parameters<ReturnType<typeof useMutation<'document_upload'>>['mutate']>[0]['payload'];

export type TFileObject = TSettings & {
    filename: File['name'];
    buffer: FileReader['result'];
    documentFormat: string;
    file_size: File['size'];
};

export const truncateFileName = (file: File, limit: number) => {
    const string_limit_regex = new RegExp(`(.{${limit || 30}})..+`);
    return file?.name?.replace(string_limit_regex, `$1….${getFileExtension(file)}`);
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
    const promises: Array<Promise<Partial<TFileObject> & { message?: string }>> = [];

    files.forEach(f => {
        const fr = new FileReader();
        const promise = new Promise<Partial<TFileObject> & { message?: string }>(resolve => {
            fr.onload = () => {
                const file_metadata = {
                    filename: f.name,
                    buffer: fr.result,
                    documentFormat: getFormatFromMIME(f),
                    file_size: f.size,
                    documentType: settings?.document_type ?? UPLOAD_FILE_TYPE.utility_bill,
                    documentId: settings?.document_id,
                    expirationDate: settings?.expiration_date,
                    lifetimeValid: settings?.lifetime_valid,
                    pageType: settings?.page_type,
                    proof_of_ownership: settings?.proof_of_ownership,
                    document_issuing_country: settings?.document_issuing_country,
                };
                resolve(file_metadata);
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

export const UPLOAD_FILE_TYPE = Object.freeze({
    amlglobalcheck: 'amlglobalcheck',
    bankstatement: 'bankstatement',
    docverification: 'docverification',
    driverslicense: 'driverslicense',
    driving_licence: 'driving_licence',
    national_identity_card: 'national_identity_card',
    other: 'other',
    passport: 'passport',
    power_of_attorney: 'power_of_attorney',
    proof_of_ownership: 'proof_of_ownership',
    proofaddress: 'proofaddress',
    proofid: 'proofid',
    utility_bill: 'utility_bill',
});

export const PAGE_TYPE = Object.freeze({
    back: 'back',
    front: 'front',
    photo: 'photo',
});

export const getSupportedFiles = (filename: string) =>
    /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|pdf|PDF)$/.test(filename);
