import * as Yup from 'yup';
import type { TDocumentTypeItem } from '../types';

export const documentTypeValidator = Yup.string().required('Please select a document type.');

export const getDocumentNumberValidator = (document: TDocumentTypeItem, example: string) => {
    return Yup.string()
        .required(`Please enter your ${document.text} number.`)
        .test({
            name: 'test-document-number',
            test: (value, context) => {
                let pattern;

                if (document.pattern) {
                    try {
                        pattern = new RegExp(document.pattern);
                    } catch (err) {
                        // Passport pattern has (?i) which is not supported in RegExp
                        // Replace the (?i) flag with the 'i' flag
                        const match = document.pattern?.match(/(\(\?i\))/);
                        if (match) {
                            const patternWithoutFlag = document.pattern.replace(/(\(\?i\))/, '');
                            pattern = new RegExp(patternWithoutFlag, 'i');
                        }
                    }

                    if (pattern && value && !value.match(pattern)) {
                        return context.createError({
                            message: `Please enter the correct format. Exmaple: ${example}`,
                        });
                    }
                }
                return true;
            },
        });
};