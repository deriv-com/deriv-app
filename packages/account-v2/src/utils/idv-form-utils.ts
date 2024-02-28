import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/object';

export const getExampleFormat = (example_format?: string) => (example_format ? `Example: ${example_format}` : '');

export type TDocument = {
    additional?: {
        display_name?: string;
        example_format?: string;
        format?: string;
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
    const isSameAsExample = documentNumber === documentConfig?.example_format;
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
    } else if (isSameAsExample) {
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
    } else if (
        documentConfig?.additional?.format &&
        !new RegExp(documentConfig?.additional?.format).test(additionalDocNumber)
    ) {
        return context.createError({
            message: 'Please enter the correct format',
        });
    }
    return true;
};

export const getIDVFormValidationSchema = (list: TDocument[]) => {
    return Yup.object({
        document_additional: Yup.string().test({
            name: 'test-additional-document-number',
            test: (value, context) => {
                const documentConfig = getSelectedDocumentConfigData(context.parent.document_type, list);
                return validateAdditionalDocumentNumber(documentConfig, value, context);
            },
        }),
        document_number: Yup.string().test({
            name: 'test-document-number',
            test: (value, context) => {
                const documentConfig = getSelectedDocumentConfigData(context.parent.document_type, list);
                return validateDocumentNumber(documentConfig, value as string, context);
            },
        }),
        document_type: Yup.string().required('Please select a document type.'),
    });
};

export const getSelectedDocumentConfigData: (prop: string, list: TDocument[]) => TDocument | undefined = (
    item: string,
    list: TDocument[] = []
) => {
    return list?.find(doc => doc.id === item);
};
