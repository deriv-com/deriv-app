import React from 'react';
import { useFormikContext } from 'formik';
import { Text, useDevice } from '@deriv-com/ui';
import SelfieIcon from '../../assets/manual-upload/selfie-icon.svg';
import { Dropzone } from '../../components/base/Dropzone';

export const SelfieDocumentUpload = () => {
    const { isMobile } = useDevice();
    const { setFieldValue } = useFormikContext();

    return (
        <div className='flex flex-col gap-800'>
            <Text>Upload your selfie</Text>
            <Dropzone
                buttonText={isMobile ? 'Tap here to upload' : 'Drop file or click here to upload'}
                description='Upload your selfie'
                fileFormats='image/*'
                hasFrame
                icon={<SelfieIcon />}
                onFileChange={(file: File) => setFieldValue('selfie', file)}
            />
            <Text size={isMobile ? 'sm' : 'xs'}>
                Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face
                is within the frame.
            </Text>
        </div>
    );
};
