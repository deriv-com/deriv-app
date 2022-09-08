import { compressImg, convertToBase64, isImageType, getFormatFromMIME } from './image/image_utility';

export const truncateFileName = (file, limit) => {
    const string_limit_regex = new RegExp(`(.{${limit || 30}})..+`);
    return file?.name?.replace(string_limit_regex, `$1….${getFileExtension(file)}`);
};

export const getFileExtension = file => {
    return file?.type?.match(/[^/]+$/)[0];
};

export const compressImageFiles = files => {
    const promises = [];
    files.forEach(f => {
        const promise = new Promise(resolve => {
            if (isImageType(f.type)) {
                convertToBase64(f).then(img => {
                    compressImg(img).then(compressed_img => {
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

export const readFiles = (files, getFileReadErrorMessage, settings) => {
    const promises = [];

    files.forEach(f => {
        const fr = new FileReader();
        const promise = new Promise(resolve => {
            fr.onload = () => {
                const file_obj = {
                    filename: f.name,
                    buffer: fr.result,
                    documentType: settings?.documentType || 'utility_bill',
                    documentFormat: getFormatFromMIME(f),
                    file_size: f.size,
                    ...settings,
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
    article_of_association: 'article_of_association',
    authorisation_letter: 'authorisation_letter',
    bankstatement: 'bankstatement',
    birth_certificate: 'birth_certificate',
    brokerage_statement: 'brokerage_statement',
    business_documents_others: 'business_documents_others',
    business_poa: 'business_poa',
    coi: 'coi',
    declarations: 'declarations',
    docverification: 'docverification',
    driverslicense: 'driverslicense',
    driving_licence: 'driving_licence',
    edd_others: 'edd_others',
    employment_contract: 'employment_contract',
    insurance_bill: 'insurance_bill',
    memorandum: 'memorandum',
    national_identity_card: 'national_identity_card',
    nimc_slip: 'nimc_slip',
    other: 'other',
    pan_card: 'pan_card',
    passport: 'passport',
    payslip: 'payslip',
    phone_bill: 'phone_bill',
    poa_others: 'poa_others',
    poi_others: 'poi_others',
    power_of_attorney: 'power_of_attorney',
    proofaddress: 'proofaddress',
    proofid: 'proofid',
    proof_of_ownership: 'proof_of_ownership',
    selfie_with_id: 'selfie_with_id',
    student_card: 'student_card',
    tax_photo_id: 'tax_photo_id',
    tax_receipt: 'tax_receipt',
    tax_return: 'tax_return',
    utility_bill: 'utility_bill',
    voter_card: 'voter_card',
};

export const PAGE_TYPE = {
    front: 'front',
    back: 'back',
    photo: 'photo',
};

export const getSupportedFiles = filename => /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|pdf|PDF)$/.test(filename);
