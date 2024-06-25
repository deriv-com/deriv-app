import { localize } from '@deriv-com/translations';
import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/types';
import { isAdditionalDocumentValid, isDocumentNumberValid } from '../Helpers/utils';
import { TDocument } from 'Types';

const validateDocumentNumber = (documentNumber: string, context: Yup.TestContext<AnyObject>) => {
    const result = isDocumentNumberValid(documentNumber, context.parent.document_type);

    if (result) {
        return context.createError({ message: result });
    }
    return true;
};

const validateAdditionalDocumentNumber = (additional_document_number: string, context: Yup.TestContext<AnyObject>) => {
    const result = isAdditionalDocumentValid(context.parent.document_type, additional_document_number);
    if (result) {
        return context.createError({ message: result });
    }
    return true;
};

export const getIDVFormValidationSchema = () => {
    return Yup.object({
        document_additional: Yup.string()
            .test({
                name: 'testAdditionalDocumentNumber',
                test: (value, context) => {
                    return validateAdditionalDocumentNumber(value as string, context);
                },
            })
            .default(''),
        document_number: Yup.string()
            .test({
                name: 'testDocumentNumber',
                test: (value, context) => {
                    return validateDocumentNumber(value as string, context);
                },
            })
            .default(''),
        document_type: Yup.mixed<TDocument>().required(localize('Please select a document type.')),
    });
};
