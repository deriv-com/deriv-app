import React from 'react';
import { Field } from 'formik';
import * as Yup from 'yup';
import { ActionScreen } from '@deriv-com/ui';
import { validateField } from '../../utils/validation';

type TFormDocumentUploadField = {
    name: string;
    validationSchema?: Yup.AnySchema;
};

/**
 * FormDocumentUploadField is a wrapper around Dropzone that can be used with Formik.
 * @name FormDocumentUploadField
 * @param name - Name of the field
 * @param [props] - Other props to pass to Dropzone
 * @returns ReactNode
 */
const FormDocumentUploadField = ({ name, validationSchema }: TFormDocumentUploadField) => (
    <Field name={name} validate={validateField(validationSchema)}>
        {() => <ActionScreen title='Should update new dropzone once its completed' />}
    </Field>
);

export default FormDocumentUploadField;
