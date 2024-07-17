import React from 'react';
import { Formik } from 'formik';
import moment from 'moment';
import { Button, Divider, useDevice } from '@deriv-com/ui';
import { DatePicker, Dropzone, FormField, ModalStepWrapper, WalletText } from '../../../../../../components';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import { documentRequiredValidator, expiryDateValidator } from '../../../../validations';
import { GeneralDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload } from '../SelfieUpload';
import { usePassportUpload } from './hooks';
import './PassportUpload.scss';

type TFooterProps = {
    onClickBack?: () => void;
    onClickNext?: () => void;
};

const PassportUpload: TManualDocumentComponent = ({ onClickBack, onCompletion }) => {
    const { isMobile } = useDevice();
    const { error, initialValues, isPassportUploadSuccess, resetError, submit } = usePassportUpload();

    const Footer: React.FC<TFooterProps> = ({ onClickBack, onClickNext }) => {
        return (
            <div className='wallets-passport-upload__footer'>
                {onClickBack && (
                    <Button color='black' isFullWidth={isMobile} onClick={onClickBack} variant='outlined'>
                        Back
                    </Button>
                )}
                {onClickNext && (
                    <Button isFullWidth={isMobile} onClick={onClickNext}>
                        Next
                    </Button>
                )}
            </div>
        );
    };

    if (isPassportUploadSuccess && onCompletion) {
        onCompletion();
    }

    if (error) {
        return <ManualUploadErrorMessage errorCode={error.code} onRetry={resetError} />;
    }

    return (
        <Formik initialValues={initialValues} onSubmit={submit}>
            {({ setFieldValue, values }) => {
                const handleFileChange = (file?: File) => {
                    setFieldValue('passportFile', file);
                };

                return (
                    <ModalStepWrapper
                        disableAnimation
                        renderFooter={() => <Footer onClickBack={onClickBack} />}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-passport-upload' data-testid='dt_passport-document-upload'>
                            <div className='wallets-passport-upload__wrapper'>
                                <WalletText>First, enter your Passport number and the expiry date.</WalletText>
                                <div className='wallets-passport-upload__input-group'>
                                    <FormField
                                        defaultValue={values.passportNumber}
                                        label='Passport number*'
                                        name='passportNumber'
                                        validationSchema={documentRequiredValidator('Passport number')}
                                    />
                                    <DatePicker
                                        label='Expiry date*'
                                        minDate={moment().add(2, 'days').toDate()}
                                        name='passportExpiryDate'
                                        validationSchema={expiryDateValidator}
                                    />
                                </div>
                                <Divider
                                    className='wallets-passport-upload__divider'
                                    color='var(--border-divider)'
                                    height={2}
                                />
                                <div className='wallets-passport-upload__document-upload'>
                                    <WalletText>
                                        Next, upload the page of your passport that contains your photo.
                                    </WalletText>
                                    <Dropzone
                                        buttonText='Drop file or click here to upload'
                                        defaultFile={values.passportFile}
                                        description='Upload the page of your passport that contains your photo.'
                                        fileFormats={[
                                            'image/jpeg',
                                            'image/jpg',
                                            'image/png',
                                            'image/gif',
                                            'application/pdf',
                                        ]}
                                        icon={<PassportPlaceholder />}
                                        maxSize={8388608}
                                        noClick
                                        onFileChange={handleFileChange}
                                    />
                                    <DocumentRules hints={GeneralDocumentRules} />
                                </div>
                            </div>
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default PassportUpload;
