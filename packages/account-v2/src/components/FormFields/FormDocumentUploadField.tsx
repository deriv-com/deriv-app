import React, { ComponentProps } from 'react';
import { Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { validateField } from '../../utils/validation';
import { Dropzone } from '../Dropzone';

type TFormDocumentUploadField = Omit<ComponentProps<typeof Dropzone>, 'onFileChange'> & {
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
const FormDocumentUploadField = ({ name, validationSchema, ...rest }: TFormDocumentUploadField) => (
    <Field name={name} validate={validateField(validationSchema)}>
        {({ form }: FieldProps<File>) => (
            <Dropzone {...rest} onFileChange={(file: File) => form.setFieldValue(name, file)} />
        )}
    </Field>
);

export default FormDocumentUploadField;
