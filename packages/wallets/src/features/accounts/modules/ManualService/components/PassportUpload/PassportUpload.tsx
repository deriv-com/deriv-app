import React, { useState } from 'react';
import { Formik } from 'formik';
import moment from 'moment';
import { Divider } from '@deriv-com/ui';
import { DatePicker, Dropzone, FormField, ModalStepWrapper, WalletText } from '../../../../../../components';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import { Footer } from '../../../components';
import { GeneralDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload } from '../SelfieUpload';
import { usePassportUpload } from './hooks';
import { passportUploadValidator } from './utils';
import './PassportUpload.scss';

const PassportUpload: TManualDocumentComponent = ({ documentIssuingCountryCode, onClickBack, onCompletion }) => {
    const { error, initialValues, isSuccess, isUploading, resetError, upload } =
        usePassportUpload(documentIssuingCountryCode);
    const [showSelfieUpload, setShowSelfieUpload] = useState(false);

    if (!error && isSuccess && onCompletion) {
        onCompletion();
    }

    return (
        <Formik initialValues={initialValues} onSubmit={upload} validationSchema={passportUploadValidator}>
            {({ dirty, errors, handleSubmit, resetForm, setFieldValue, values }) => {
                const handleFileChange = (file?: File) => {
                    setFieldValue('passportFile', file);
                };
                const isPassportFormDirty =
                    dirty && !errors.passportExpiryDate && !errors.passportFile && !errors.passportNumber;

                const handleOnClickNext = () => {
                    if (isPassportFormDirty) {
                        setShowSelfieUpload(true);
                    }
                };

                if (error) {
                    return (
                        <ManualUploadErrorMessage
                            errorCode={error.code}
                            onRetry={() => {
                                resetError();
                                resetForm();
                            }}
                        />
                    );
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
                                disableNext={!isPassportFormDirty}
                                isNextLoading={isUploading}
                                onClickBack={onClickBack}
                                onClickNext={handleOnClickNext}
                            />
                        )}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-passport-upload' data-testid='dt_passport-document-upload'>
                            <div className='wallets-passport-upload__wrapper'>
                                <WalletText>First, enter your Passport number and the expiry date.</WalletText>
                                <div className='wallets-passport-upload__input-group'>
                                    <FormField label='Passport number*' name='passportNumber' />
                                    <DatePicker
                                        label='Expiry date*'
                                        minDate={moment().add(2, 'days').toDate()}
                                        name='passportExpiryDate'
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
