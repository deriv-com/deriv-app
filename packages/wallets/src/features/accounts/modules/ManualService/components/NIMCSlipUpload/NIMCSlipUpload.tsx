import React, { useState } from 'react';
import { Formik, FormikValues } from 'formik';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Divider, Loader, Text } from '@deriv-com/ui';
import { Dropzone, FormField, ModalStepWrapper } from '../../../../../../components';
import NIMCSlipFront from '../../../../../../public/images/accounts/nimc-slip-front.svg';
import ProofOfAgeIcon from '../../../../../../public/images/accounts/proof-of-age.svg';
import { THooks } from '../../../../../../types';
import { Footer } from '../../../components';
import { getNIMCDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload } from '../SelfieUpload';
import { useNIMCSlipUpload } from './hooks';
import { getNimcSlipUploadValidator } from './utils';
import './NIMCSlipUpload.scss';

const NIMCSlipUpload: TManualDocumentComponent = ({ documentIssuingCountryCode, onClickBack, onCompletion }) => {
    const { localize } = useTranslations();
    const {
        initialValues,
        isLoading,
        resetUploadStatus,
        upload: upload_,
    } = useNIMCSlipUpload(documentIssuingCountryCode);
    const [showSelfieUpload, setShowSelfieUpload] = useState(false);
    const [error, setError] = useState<THooks.DocumentUpload['error']>();

    const upload = async (values: FormikValues) => {
        try {
            await upload_(values);
            onCompletion?.();
        } catch (error) {
            setError((error as THooks.DocumentUpload).error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Formik initialValues={initialValues} onSubmit={upload} validationSchema={getNimcSlipUploadValidator(localize)}>
            {({ dirty, errors, handleSubmit, resetForm, setFieldValue, values }) => {
                const isNIMCFormValid = dirty && !errors.nimcNumber && !errors.nimcCardFront && !errors.nimcCardBack;

                const handleOnClickNext = () => {
                    setShowSelfieUpload(true);
                };

                const onErrorRetry = () => {
                    resetUploadStatus();
                    resetForm();
                    setShowSelfieUpload(false);
                    onClickBack?.();
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
                                disableBack={isLoading}
                                disableNext={!isNIMCFormValid || isLoading}
                                onClickBack={onClickBack}
                                onClickNext={handleOnClickNext}
                            />
                        )}
                        title={localize('Add a real MT5 account')}
                    >
                        <div className='wallets-nimc-slip-upload' data-testid='dt_nimc-upload'>
                            <div className='wallets-nimc-slip-upload__wrapper'>
                                <Text>
                                    <Localize i18n_default_text='First, enter your NIMC slip number.' />
                                </Text>
                                <FormField label={localize('NIMC slip number*')} name='nimcNumber' />
                                <Divider
                                    className='wallets-nimc-slip-upload__divider'
                                    color='var(--border-divider)'
                                    height={2}
                                />
                                <div className='wallets-nimc-slip-upload__document-section'>
                                    <Text>
                                        <Localize i18n_default_text='Next, upload both of the following documents.' />
                                    </Text>
                                    <div className='wallets-nimc-slip-upload__dropzones'>
                                        <div className='wallets-nimc-slip-upload__dropzones--left'>
                                            <Dropzone
                                                buttonText={localize('Drop file or click here to upload')}
                                                defaultFile={values.nimcCardFront}
                                                description={localize('Upload your NIMC slip.')}
                                                fileFormats={[
                                                    'image/jpeg',
                                                    'image/jpg',
                                                    'image/png',
                                                    'image/gif',
                                                    'application/pdf',
                                                ]}
                                                icon={<NIMCSlipFront />}
                                                maxSize={8388608}
                                                noClick
                                                onFileChange={(file?: File) => setFieldValue('nimcCardFront', file)}
                                            />
                                        </div>
                                        <div className='wallets-nimc-slip-upload__dropzones--right'>
                                            <Dropzone
                                                buttonText={localize('Drop file or click here to upload')}
                                                defaultFile={values.nimcCardBack}
                                                description={localize(
                                                    'Upload your proof of age: birth certificate or age declaration document.'
                                                )}
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
                                    <DocumentRules hints={getNIMCDocumentRules(localize)} />
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
