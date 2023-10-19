import { compressImg, convertToBase64, isImageType, getFormatFromMIME, TImage, TFile } from './image/image_utility';

export type TSettings = {
    documentType?: typeof DOCUMENT_TYPE[keyof typeof DOCUMENT_TYPE];
    pageType?: typeof PAGE_TYPE[keyof typeof PAGE_TYPE];
    expirationDate?: string;
    documentId?: string;
    lifetimeValid?: boolean;
    document_issuing_country?: string;
    proof_of_ownership?: {
        details?: {
            email: string;
            payment_identifier: string;
        };
        id?: number;
    };
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

export const compressImageFiles = (files: TFile[]) => {
    const promises: Promise<Blob>[] = [];
    files.forEach(f => {
        const promise = new Promise<Blob>(resolve => {
            if (isImageType(f.type)) {
                convertToBase64(f).then(img => {
                    compressImg(img as TImage).then(compressed_img => {
                        const file_arr = f;
                        file_arr.file = compressed_img;
                        resolve(file_arr.file);
                    });
                });
            } else {
                resolve(f);
            }
        });
        promises.push(promise);
    });

    return Promise.all(promises);
};

export const readFiles = (files: TFile[], getFileReadErrorMessage: (t: string) => string, settings: TSettings) => {
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
                    documentType: settings?.documentType ?? 'utility_bill',
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

export const DOCUMENT_TYPE = {
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
} as const;

export const PAGE_TYPE = {
    back: 'back',
    front: 'front',
    photo: 'photo',
} as const;

export const getSupportedFiles = (filename: string) =>
    /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|pdf|PDF)$/.test(filename);
