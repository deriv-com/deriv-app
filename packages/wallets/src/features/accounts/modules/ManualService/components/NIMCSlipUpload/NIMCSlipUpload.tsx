import React, { useState } from 'react';
import { Formik } from 'formik';
import { Divider } from '@deriv-com/ui';
import { Dropzone, FormField, ModalStepWrapper, WalletText } from '../../../../../../components';
import NIMCSlipFront from '../../../../../../public/images/accounts/nimc-slip-front.svg';
import ProofOfAgeIcon from '../../../../../../public/images/accounts/proof-of-age.svg';
import { Footer } from '../../../components';
import { NIMCDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload } from '../SelfieUpload';
import { useNIMCSlipUpload } from './hooks';
import { nimcSlipUploadValidator } from './utils';
import './NIMCSlipUpload.scss';

const NIMCSlipUpload: TManualDocumentComponent = ({ documentIssuingCountryCode, onClickBack, onCompletion }) => {
    const { error, initialValues, isSuccess, resetError, upload } = useNIMCSlipUpload(documentIssuingCountryCode);
    const [showSelfieUpload, setShowSelfieUpload] = useState(false);

    if (!error && isSuccess && onCompletion) {
        onCompletion();
    }

    return (
        <Formik initialValues={initialValues} onSubmit={upload} validationSchema={nimcSlipUploadValidator}>
            {({ dirty, errors, handleSubmit, resetForm, setFieldValue, values }) => {
                const isNIMCFormValid = dirty && !errors.nimcNumber && !errors.nimcCardFront && !errors.nimcCardBack;

                const onErrorRetry = () => {
                    resetError();
                    resetForm();
                    setShowSelfieUpload(false);
                };

                const handleOnClickNext = () => {
                    setShowSelfieUpload(true);
                };

                if (error) {
                    return <ManualUploadErrorMessage errorCode={error.code} onRetry={onErrorRetry} />;
                }

                if (showSelfieUpload) {
                    return (
                        <SelfieUpload
                            onClickBack={() => {
                                setShowSelfieUpload(false);
                            }}
                            onCompletion={handleSubmit}
                        />
                    );
                }
                return (
                    <ModalStepWrapper
                        disableAnimation
                        renderFooter={() => (
                            <Footer
                                disableNext={!isNIMCFormValid}
                                onClickBack={onClickBack}
                                onClickNext={handleOnClickNext}
                            />
                        )}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-nimc-slip-upload' data-testid='dt_nimc-upload'>
                            <div className='wallets-nimc-slip-upload__wrapper'>
                                <WalletText>First, enter your NIMC slip number.</WalletText>
                                <FormField label='NIMC slip number*' name='nimcNumber' />
                                <Divider color='var(--border-divider)' height={2} />
                                <div className='wallets-nimc-slip-upload__document-section'>
                                    <WalletText>Next, upload both of the following documents.</WalletText>
                                    <div className='wallets-nimc-slip-upload__dropzones'>
                                        <div className='wallets-nimc-slip-upload__dropzones--left'>
                                            <Dropzone
                                                buttonText='Drop file or click here to upload'
                                                defaultFile={values.nimcCardFront}
                                                description='Upload your NIMC slip.'
                                                fileFormats={[
                                                    'image/jpeg',
                                                    'image/jpg',
                                                    'image/png',
                                                    'image/gif',
                                                    'application/pdf',
                                                ]}
                                                icon={<NIMCSlipFront />}
                                                maxSize={8388608}
                                                onFileChange={(file?: File) => setFieldValue('nimcCardFront', file)}
                                            />
                                        </div>
                                        <div className='wallets-nimc-slip-upload__dropzones--right'>
                                            <Dropzone
                                                buttonText='Drop file or click here to upload'
                                                defaultFile={values.nimcCardBack}
                                                description='Upload your proof of age: birth certificate or age declaration document.'
                                                fileFormats={[
                                                    'image/jpeg',
                                                    'image/jpg',
                                                    'image/png',
                                                    'image/gif',
                                                    'application/pdf',
                                                ]}
                                                icon={<ProofOfAgeIcon />}
                                                maxSize={8388608}
                                                noClick
                                                onFileChange={(file?: File) => setFieldValue('nimcCardBack', file)}
                                            />
                                        </div>
                                    </div>
                                    <DocumentRules hints={NIMCDocumentRules} />
                                </div>
                            </div>
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default NIMCSlipUpload;
