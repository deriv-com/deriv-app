import { localize } from '@deriv-com/translations';
import Yup from 'yup';
import { AnyObject } from 'yup/lib/types';
import { isAdditionalDocumentValid, isDocumentNumberValid } from '../Helpers/utils';

const validateDocumentNumber = (documentNumber: string, context: Yup.TestContext<AnyObject>) => {
    const result = isDocumentNumberValid(documentNumber, context.parent.documentType);

    if (result) {
        return context.createError({ message: result });
    }
    return true;
};

const validateAdditionalDocumentNumber = (additional_document_number: string, context: Yup.TestContext<AnyObject>) => {
    const result = isAdditionalDocumentValid(context.parent.documentType, additional_document_number);
    if (result) {
        return context.createError({ message: result });
    }
    return true;
};

export const getIDVFormValidationSchema = () => {
    return Yup.object({
        additionalDocument: Yup.string()
            .test({
                name: 'testAdditionalDocumentNumber',
                test: (value, context) => {
                    return validateAdditionalDocumentNumber(value as string, context);
                },
            })
            .default(''),
        documentNumber: Yup.string()
            .test({
                name: 'testDocumentNumber',
                test: (value, context) => {
                    return validateDocumentNumber(value as string, context);
                },
            })
            .default(''),
        documentType: Yup.string().required(localize('Please select a document type.')),
    });
};
