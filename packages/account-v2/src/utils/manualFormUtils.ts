import { FormikValues } from 'formik';
import * as Yup from 'yup';
import { manualDocumentSelfie, manualDocumentTypesData, TManualDocumentTypes } from '../constants/manualFormConstants';

export const getTitleForFormInputs = (selectedDocument: TManualDocumentTypes) =>
    manualDocumentTypesData[selectedDocument].inputSectionHeader;

export const getTitleForDocumentUpload = (selectedDocument: TManualDocumentTypes) =>
    manualDocumentTypesData[selectedDocument].uploadSectionHeader;

export const getFieldsConfig = (selectedDocument: TManualDocumentTypes) =>
    manualDocumentTypesData[selectedDocument].fields;

export const getUploadConfig = (selectedDocument: TManualDocumentTypes) =>
    manualDocumentTypesData[selectedDocument].uploads;

export const getManualFormValidationSchema = (
    selectedDocument: TManualDocumentTypes,
    isExpiryDateRequired: boolean
) => {
    const fieldsConfig = getFieldsConfig(selectedDocument);
    const uploadConfig = getUploadConfig(selectedDocument);

    const documentExpiryValidation = Yup.object({
        documentExpiry: Yup.string().required(fieldsConfig.documentExpiry.errorMessage),
    }).default(() => ({ documentExpiry: '' }));

    const documentUploadValidation = Object.fromEntries(
        uploadConfig.map(item => [item.pageType, Yup.string().required(item.error).default(null)])
    );

    const baseSchema = Yup.object({
        documentNumber: Yup.string().required(fieldsConfig.documentNumber.errorMessage),
        ...documentUploadValidation,
    });

    return isExpiryDateRequired ? baseSchema.concat(documentExpiryValidation) : baseSchema;
};

export const getSelfieValidationSchema = () => {
    return Yup.object({
        [manualDocumentSelfie]: Yup.mixed<File | null>()
            .test({
                message: 'File is required',
                name: 'file',
                test: value => {
                    return !!value && value instanceof File;
                },
            })
            .required(),
    }).default(() => ({ [manualDocumentSelfie]: null }));
};

export const setInitialValues = (fields: string[]) => {
    const values: FormikValues = {};
    fields.forEach((field: string) => {
        values[field] = '';
    });
    return values;
};
