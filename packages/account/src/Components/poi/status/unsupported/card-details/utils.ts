import { localize } from '@deriv/translations';
import { FormikErrors, FormikValues } from 'formik';

export const setInitialValues = (fields: FormikValues) => {
    const values: FormikValues = {};
    fields.forEach((field: FormikValues) => {
        values[field.name] = '';
    });
    return values;
};

export const checkIsEmpty = (value: unknown) => {
    return typeof value === 'string' ? !value.trim() : !value;
};

type TFields = {
    name: string;
    label: string;
    type: string;
    required: boolean;
}[];

type TDocument = {
    document_type: string;
    pageType: string;
    name: string;
    icon: string;
    info: string;
}[];

export const validateFields = (values: FormikValues, fields: TFields = [], documents: TDocument = []) => {
    const errors: FormikErrors<FormikValues> = {};

    fields.forEach((field: { name: string; label: string; type: string; required: boolean }) => {
        const { name, label, type } = field;
        const value = values[name];

        if (field.required && checkIsEmpty(value)) {
            errors[name] = localize('{{label}} is required.', {
                label,
            });
        } else if (type === 'text' && value.length > 30) {
            errors[name] = localize('{{label}} must be less than 30 characters.', {
                label,
            });
        } else if (type === 'text' && !/^[\w\s-]{0,30}$/g.test(value)) {
            errors[name] = localize('Only letters, numbers, space, underscore, and hyphen are allowed for {{label}}.', {
                label,
            });
        }
    });

    documents.forEach((document: { name: string }) => {
        const { name } = document;
        const value = values[name];

        if (checkIsEmpty(value)) {
            errors[name] = localize('{{name}} is required.', {
                name,
            });
        } else if (value.errors?.length) {
            errors[name] = value.errors[0];
        }
    });

    return errors;
};
