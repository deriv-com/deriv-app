import React, { ComponentProps } from 'react';
import { useField } from 'formik';
import { Dropzone } from '../base/Dropzone';

type TFormDocumentUploadField = Omit<ComponentProps<typeof Dropzone>, 'onFileChange'> & {
    name: string;
};

/**
 * FormDocumentUploadField is a wrapper around Dropzone that can be used with Formik.
 * @name FormDocumentUploadField
 * @param name - Name of the field
 * @param [props] - Other props to pass to Dropzone
 * @returns ReactNode
 */
const FormDocumentUploadField = ({ name, ...rest }: TFormDocumentUploadField) => {
    const [, , helpers] = useField(name);
    return <Dropzone {...rest} onFileChange={(file: File) => helpers.setValue(file)} />;
};

export default FormDocumentUploadField;
