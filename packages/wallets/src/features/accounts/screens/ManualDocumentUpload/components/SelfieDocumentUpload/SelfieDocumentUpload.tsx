import React from 'react';
import { Dropzone, WalletText } from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import SelfieIcon from '../../../../../../public/images/accounts/selfie-icon.svg';
import './SelfieDocumentUpload.scss';

const SelfieDocumentUpload = () => {
    const { isDesktop } = useDevice();
    return (
        <div className='wallets-selfie-document-upload'>
            <WalletText>Upload your selfie</WalletText>
            <Dropzone
                buttonText='Drop file or click here to upload'
                description='Upload your selfie'
                descriptionColor={isDesktop ? 'less-prominent' : 'general'}
                fileFormats='image/*'
                hasFrame={isDesktop}
                icon={<SelfieIcon />}
            />
            <WalletText color={isDesktop ? 'less-prominent' : 'general'}>
                Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face
                is within the frame.
            </WalletText>
        </div>
    );
};

export default SelfieDocumentUpload;
