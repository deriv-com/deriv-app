import * as Yup from 'yup';
import {
    MANUAL_DOCUMENT_TYPES,
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
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].upload;

export const getManualFormValidationSchema = (selectedDocument: TManualDocumentTypes) => {
    const fieldsData = MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].fields;
    return Yup.object({
        document_expiry: Yup.string().required(fieldsData.documentExpiry.errorMessage),
        document_number: Yup.string().required(fieldsData.documentNumber.errorMessage),
    });
};

export const getSelfieValidationSchema = () => {
    return Yup.object({
        [MANUAL_DOCUMENT_TYPES.SELFIE]: Yup.mixed().test({
            message: 'File is required',
            name: 'file',
            test: value => {
                return value && value instanceof File;
            },
        }),
    });
};
