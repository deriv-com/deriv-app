import React from 'react';
import { Formik, FormikValues } from 'formik';
import { InferType } from 'yup';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';
import { MANUAL_DOCUMENT_SELFIE } from '../../constants/manualFormConstants';
import { getSelfieValidationSchema } from '../../utils/manual-form-utils';

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
            {({ dirty, isValid, values }) => (
                <div className='flex flex-col gap-800'>
                    <Text>Upload your selfie</Text>
                    <ActionScreen title='Should update new dropzone once its completed' />
                    <Text size={isMobile ? 'sm' : 'xs'}>
                        Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and
                        your face is within the frame.
                    </Text>
                    <div className='flex justify-end gap-800 bg-vp px-400 py-800 border-t-solid-grey-2 border-solid border-t-100'>
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
