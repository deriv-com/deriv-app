import { compressImg, convertToBase64, isImageType, getFormatFromMIME, TImage } from './image/image_utility';

export type TFile = File & { file: Blob };

type TSettings = {
    documentType: {
        passport: string;
        national_identity_card: string;
        driving_licence: string;
        utility_bill: string;
        bankstatement: string;
        power_of_attorney: string;
        amlglobalcheck: string;
        docverification: string;
        proofid: string;
        driverslicense: string;
        proofaddress: string;
        other: string;
    };
    pageType: {
        front: string;
        back: string;
        photo: string;
    };
    expirationDate?: string;
    documentId?: string;
    lifetimeValid?: boolean;
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

export const DOCUMENT_TYPE = {
    passport: 'passport',
    national_identity_card: 'national_identity_card',
    driving_licence: 'driving_licence',
    utility_bill: 'utility_bill',
    bankstatement: 'bankstatement',
    power_of_attorney: 'power_of_attorney',
    amlglobalcheck: 'amlglobalcheck',
    docverification: 'docverification',
    proofid: 'proofid',
    driverslicense: 'driverslicense',
    proofaddress: 'proofaddress',
    proof_of_ownership: 'proof_of_ownership',
    other: 'other',
};

export const PAGE_TYPE = {
    front: 'front',
    back: 'back',
    photo: 'photo',
};

export const getSupportedFiles = (filename: string) =>
    /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|pdf|PDF)$/.test(filename);
