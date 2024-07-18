import React from 'react';
import { useFormikContext } from 'formik';
import { Dropzone, ModalStepWrapper, WalletText } from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import SelfieIcon from '../../../../../../public/images/accounts/selfie-icon.svg';
import { Footer } from '../../../components';
import { TManualDocumentComponent } from '../../utils';
import { TSelfieUploadValues } from './types';
import './SelfieUpload.scss';

const SelfieUpload: TManualDocumentComponent = ({ onClickBack, onCompletion }) => {
    const { isDesktop } = useDevice();
    const { dirty, errors, setFieldValue, values } = useFormikContext<TSelfieUploadValues>();

    const isSelfieFormDirty = dirty && !errors.selfieFile;

    return (
        <ModalStepWrapper
            disableAnimation
            renderFooter={() => (
                <Footer
                    disableNext={isSelfieFormDirty}
                    nextText='Confirm and upload'
                    onClickBack={onClickBack}
                    onClickNext={onCompletion}
                />
            )}
            title='Add a real MT5 account'
        >
            <div className='wallets-selfie-upload'>
                <WalletText weight='bold'>Upload your selfie</WalletText>
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
                    Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your
                    face is within the frame.
                </WalletText>
            </div>
        </ModalStepWrapper>
    );
};

export default SelfieUpload;
