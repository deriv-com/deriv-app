import * as Yup from 'yup';
import { MANUAL_DOCUMENT_TYPES_DATA, TManualDocumentTypes } from '../constants/manualFormConstants';

export const getTitleForFormInputs = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].inputSectionHeader;

export const getTitleForDocumentUpload = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].uploadSectionHeader;

export const getFieldsData = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].fields;

export const getManualFormValidationSchema = (selectedDocument: TManualDocumentTypes) => {
    const fieldsData = MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].fields;
    return Yup.object({
        document: Yup.string().required('Document is required.'),
        document_expiry: Yup.string().required(fieldsData.documentExpiry.errorMessage),
        document_number: Yup.string().required(fieldsData.documentNumber.errorMessage),
    });
};
