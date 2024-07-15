import React from 'react';
import { useFormikContext } from 'formik';
import { Dropzone, WalletText } from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import SelfieIcon from '../../../../../../public/images/accounts/selfie-icon.svg';
import { TSelfieUploadValues } from './types';
import './SelfieUpload.scss';

const SelfieUpload = () => {
    const { isDesktop } = useDevice();
    const { setFieldValue, values } = useFormikContext<TSelfieUploadValues>();

    return (
        <div className='wallets-selfie-upload'>
            <WalletText>Upload your selfie</WalletText>
            <Dropzone
                buttonText='Drop file or click here to upload'
                defaultFile={values.selfieFile}
                description='Upload your selfie'
                descriptionColor={isDesktop ? 'less-prominent' : 'general'}
                fileFormats='image/*'
                hasFrame={isDesktop}
                icon={<SelfieIcon />}
                noClick
                onFileChange={(file?: File) => setFieldValue('selfieFile', file)}
            />
            <WalletText color={isDesktop ? 'less-prominent' : 'general'}>
                Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face
                is within the frame.
            </WalletText>
        </div>
    );
};

export default SelfieUpload;
