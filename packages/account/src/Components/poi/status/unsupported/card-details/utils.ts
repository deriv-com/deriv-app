import { localize } from '@deriv/translations';
import { FormikErrors, FormikValues } from 'formik';

export const setInitialValues = (fields: FormikValues) => {
    const values: FormikValues = {};
    fields.forEach((field: FormikValues) => {
        values[field.name] = '';
    });
    return values;
};

export const checkIsEmpty = (value: string | unknown) => {
    return typeof value === 'string' ? !value.trim() : !value;
};

export const validateFields = (values: FormikValues, fields = [], documents = []) => {
    const errors: FormikErrors<FormikValues> = {};

    fields.forEach((field: { name: string; label: string; type: string; required: boolean }) => {
        const { name, label, type } = field;
        const value = values[name];

        if (field.required && checkIsEmpty(value)) {
            errors[name] = localize('{{label}} is required.', {
                label,
            });
        } else if (type === 'text' && !/^[\w\s-]{0,30}$/g.test(value)) {
            errors[name] = localize('Only letters, numbers, space, underscore, and hyphen are allowed for {{label}}.', {
                label,
            });
        }
    });

    documents.forEach((document: { name: string; label: string }) => {
        const { name, label } = document;
        const value = values[name];

        if (checkIsEmpty(value)) {
            errors[name] = localize('{{label}} is required.', {
                label,
            });
        } else if (value.errors?.length) {
            errors[name] = value.errors[0];
        }
    });

    return errors;
};
