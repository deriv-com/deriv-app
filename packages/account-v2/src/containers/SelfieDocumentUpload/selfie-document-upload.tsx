import React from 'react';
import { Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Text, useDevice } from '@deriv-com/ui';
import SelfieIcon from '../../assets/manual-upload/selfie-icon.svg';
import { Dropzone } from '../../components/Dropzone';
import { validateField } from '../../utils/validation';

type TSelfieDocumentUpload = {
    name: string;
    validationSchema?: Yup.AnySchema;
};

export const SelfieDocumentUpload = ({ name, validationSchema }: TSelfieDocumentUpload) => {
    const { isMobile } = useDevice();

    return (
        <Field name={name} validate={validateField(validationSchema)}>
            {({ form }: FieldProps<File>) => (
                <div className='flex flex-col gap-800'>
                    <Text>Upload your selfie</Text>
                    <Dropzone
                        buttonText={isMobile ? 'Tap here to upload' : 'Drop file or click here to upload'}
                        description='Upload your selfie'
                        fileFormats='image/*'
                        hasFrame
                        icon={<SelfieIcon />}
                        onFileChange={(file: File) => form.setFieldValue(name, file)}
                    />
                    <Text size={isMobile ? 'sm' : 'xs'}>
                        Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and
                        your face is within the frame.
                    </Text>
                </div>
            )}
        </Field>
    );
};
