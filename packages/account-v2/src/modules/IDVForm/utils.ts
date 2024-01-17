import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/object';
import { DOCUMENT_LIST } from '../../mocks/idv-form.mock';

export const getExampleFormat = (example_format?: string) => (example_format ? `Example: ${example_format}` : '');

export type TDocument = {
    additional?: {
        display_name?: string;
        example_format?: string;
    };
    example_format?: string;
    id: string;
    text: string;
    value: string;
};

const validateDocumentNumber = (
    documentConfig: TDocument | undefined,
    documentNumber: string,
    context: Yup.TestContext<AnyObject>
) => {
    const isNotSameAsExample = documentNumber === documentConfig?.example_format;
    const exampleFormat = getExampleFormat(documentConfig?.example_format);

    if (!documentNumber && documentConfig?.text) {
        let documentName = '';
        switch (documentConfig.id) {
            case 'drivers_license':
                documentName = 'Driver License Reference number';
                break;
            case 'ssnit':
                documentName = 'SSNIT number';
                break;
            case 'national_id_no_photo':
                documentName = 'NIN';
                break;
            default:
                documentName = 'document number';
                break;
        }
        return context.createError({ message: `Please enter your ${documentName}. ${exampleFormat}` });
    } else if (isNotSameAsExample) {
        return context.createError({ message: 'Please enter a valid ID number' });
    } else if (documentConfig && !new RegExp(documentConfig.value).test(documentNumber)) {
        return context.createError({ message: `Please enter the correct format. ${exampleFormat}` });
    }
    return true;
};

const validateAdditionalDocumentNumber = (
    documentConfig: TDocument | undefined,
    additionalDocNumber: string | undefined,
    context: Yup.TestContext<AnyObject>
) => {
    if (!additionalDocNumber) {
        return context.createError({
            message: `Please enter your ${
                documentConfig?.additional?.display_name?.toLowerCase() ?? 'document number'
            }.`,
        });
    } else if (!new RegExp(documentConfig?.additional?.example_format as string).test(additionalDocNumber)) {
        return context.createError({
            message: 'Please enter the correct format',
        });
    }
    return true;
};

export const getIDVFormValidationSchema = () => {
    return Yup.object().shape({
        document_additional: Yup.string().test({
            name: 'test-additional-document-number',
            test: (value, context) => {
                const documentConfig = getSelectedDocumentConfigData(context.parent.document_type);
                return validateAdditionalDocumentNumber(documentConfig, value, context);
            },
        }),
        document_number: Yup.string().test({
            name: 'test-document-number',
            test: (value, context) => {
                const documentConfig = getSelectedDocumentConfigData(context.parent.document_type);
                return validateDocumentNumber(documentConfig, value as string, context);
            },
        }),
        document_type: Yup.string().required('Please select a document type.'),
    });
};

export const getSelectedDocumentConfigData: (prop: string) => TDocument | undefined = (item: string) => {
    return DOCUMENT_LIST.find(doc => doc.id === item);
};
