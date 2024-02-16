import * as Yup from 'yup';
import {
    MANUAL_DOCUMENT_SELFIE,
    MANUAL_DOCUMENT_TYPES_DATA,
    TManualDocumentTypes,
} from '../constants/manualFormConstants';

export const getTitleForFormInputs = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].inputSectionHeader;

export const getTitleForDocumentUpload = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].uploadSectionHeader;

export const getFieldsConfig = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].fields;

export const getUploadConfig = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].uploads;

export const getManualFormValidationSchema = (
    selectedDocument: TManualDocumentTypes,
    isExpiryDateRequired: boolean
) => {
    const fieldsConfig = getFieldsConfig(selectedDocument);
    const uploadConfig = getUploadConfig(selectedDocument);

    const documentExpiryValidation = {
        document_expiry: isExpiryDateRequired
            ? Yup.string().required(fieldsConfig.documentExpiry.errorMessage)
            : Yup.string().notRequired(),
    };

    const documentUploadValidation = Object.fromEntries(
        uploadConfig.map(item => [item.pageType, Yup.string().required(item.error)])
    );

    return Yup.object({
        document_number: Yup.string().required(fieldsConfig.documentNumber.errorMessage),
        ...documentExpiryValidation,
        ...documentUploadValidation,
    });
};

export const getSelfieValidationSchema = () => {
    return Yup.object({
        [MANUAL_DOCUMENT_SELFIE]: Yup.mixed<File | null>()
            .test({
                message: 'File is required',
                name: 'file',
                test: value => {
                    return !!value && value instanceof File;
                },
            })
            .required(),
    }).default(() => ({ [MANUAL_DOCUMENT_SELFIE]: null }));
};
