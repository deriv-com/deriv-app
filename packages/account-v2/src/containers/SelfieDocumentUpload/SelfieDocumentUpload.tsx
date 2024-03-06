import React from 'react';
import { Formik, FormikValues } from 'formik';
import { InferType } from 'yup';
import { Button, Text, useDevice } from '@deriv-com/ui';
import SelfieIcon from '../../assets/manual-upload/selfie-icon.svg';
import { Dropzone } from '../../components/Dropzone';
import { MANUAL_DOCUMENT_SELFIE } from '../../constants/manualFormConstants';
import { getSelfieValidationSchema } from '../../utils/manualFormUtils';

type TSelfieFormValue = InferType<ReturnType<typeof getSelfieValidationSchema>>;

type TSelfieDocumentUpload = {
    formData: FormikValues;
    handleCancel: () => void;
    handleSubmit: (value: TSelfieFormValue) => void;
};

export const SelfieDocumentUpload = ({ formData, handleCancel, handleSubmit }: TSelfieDocumentUpload) => {
    const { isMobile } = useDevice();

    const validationSchema = getSelfieValidationSchema();

    const initialVal = validationSchema.cast({
        [MANUAL_DOCUMENT_SELFIE]: formData[MANUAL_DOCUMENT_SELFIE] ?? validationSchema.getDefault().selfie_with_id,
    });

    return (
        <Formik
            initialValues={initialVal as TSelfieFormValue}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
            {({ dirty, isValid, setFieldValue, values }) => (
                <div className='flex flex-col gap-16'>
                    <Text>Upload your selfie</Text>
                    <Dropzone
                        buttonText={isMobile ? 'Tap here to upload' : 'Drop file or click here to upload'}
                        description='Upload your selfie'
                        fileFormats='image/*'
                        hasFrame
                        icon={<SelfieIcon />}
                        onFileChange={(file: File) => setFieldValue(MANUAL_DOCUMENT_SELFIE, file)}
                    />
                    <Text size={isMobile ? 'sm' : 'xs'}>
                        Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and
                        your face is within the frame.
                    </Text>
                    <div className='flex justify-end gap-16 bg-vp px-8 py-16 border-t-solid-grey-2 border-solid border-t-2'>
                        <Button onClick={handleCancel} type='button' variant='outlined'>
                            Back
                        </Button>
                        <Button disabled={!isValid || !values[MANUAL_DOCUMENT_SELFIE] || !dirty}>
                            Confirm and upload
                        </Button>
                    </div>
                </div>
            )}
        </Formik>
    );
};
