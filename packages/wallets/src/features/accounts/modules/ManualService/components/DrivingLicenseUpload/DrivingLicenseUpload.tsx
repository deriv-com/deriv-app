import React, { useState } from 'react';
import { Formik } from 'formik';
import moment from 'moment';
import { Divider } from '@deriv-com/ui';
import { DatePicker, Dropzone, FormField, ModalStepWrapper, WalletText } from '../../../../../../components';
import DrivingLicenseCardBack from '../../../../../../public/images/accounts/document-back.svg';
import DrivingLicenseCardFront from '../../../../../../public/images/accounts/driving-license-front.svg';
import { Footer } from '../../../components';
import { GeneralDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload } from '../SelfieUpload';
import { useDrivingLicenseUpload } from './hooks';
import { drivingLicenseUploadValidator } from './utils';
import './DrivingLicenseUpload.scss';

const DrivingLicenseUpload: TManualDocumentComponent = ({ documentIssuingCountryCode, onClickBack, onCompletion }) => {
    const { error, initialValues, isSuccess, isUploading, resetError, upload } =
        useDrivingLicenseUpload(documentIssuingCountryCode);
    const [showSelfieUpload, setShowSelfieUpload] = useState(false);

    if (!error && isSuccess && onCompletion) {
        onCompletion();
    }

    return (
        <Formik initialValues={initialValues} onSubmit={upload} validationSchema={drivingLicenseUploadValidator}>
            {({ dirty, errors, handleSubmit, resetForm, setFieldValue, values }) => {
                const isDrivingLicenseFormValid =
                    dirty &&
                    !errors.drivingLicenseNumber &&
                    !errors.drivingLicenseExpiryDate &&
                    !errors.drivingLicenseCardBack &&
                    !errors.drivingLicenseCardFront;

                const onErrorRetry = () => {
                    resetError();
                    resetForm();
                    setShowSelfieUpload(false);
                    if (onClickBack) {
                        onClickBack();
                    }
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
                                disableBack={isUploading}
                                disableNext={!isDrivingLicenseFormValid || isUploading}
                                isNextLoading={isUploading}
                                onClickBack={onClickBack}
                                onClickNext={handleOnClickNext}
                            />
                        )}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-driving-license-upload' data-testid='dt_driving-license-upload'>
                            <div className='wallets-driving-license-upload__wrapper'>
                                <WalletText>First, enter your Driving licence number and the expiry date.</WalletText>
                                <div className='wallets-driving-license-upload__input-group'>
                                    <FormField
                                        defaultValue={values.drivingLicenseNumber ?? ''}
                                        label='Driving licence number*'
                                        name='drivingLicenseNumber'
                                    />
                                    <DatePicker
                                        defaultValue={values.drivingLicenseExpiryDate ?? ''}
                                        label='Expiry date*'
                                        minDate={moment().add(2, 'days').toDate()}
                                        name='drivingLicenseExpiryDate'
                                        placeholder='DD/MM/YYYY'
                                    />
                                </div>
                                <Divider color='var(--border-divider)' height={2} />
                                <div className='wallets-driving-license-upload__document-upload'>
                                    <WalletText>Next, upload the front and back of your driving licence.</WalletText>
                                    <div className='wallets-driving-license-upload__dropzone'>
                                        <Dropzone
                                            buttonText='Drop file or click here to upload'
                                            defaultFile={values.drivingLicenseCardFront}
                                            description='Upload the front of your driving licence.'
                                            fileFormats={[
                                                'image/jpeg',
                                                'image/jpg',
                                                'image/png',
                                                'image/gif',
                                                'application/pdf',
                                            ]}
                                            icon={<DrivingLicenseCardFront />}
                                            maxSize={8388608}
                                            noClick
                                            onFileChange={(file?: File) =>
                                                setFieldValue('drivingLicenseCardFront', file)
                                            }
                                        />
                                        <Dropzone
                                            buttonText='Drop file or click here to upload'
                                            defaultFile={values.drivingLicenseCardBack}
                                            description='Upload the back of your driving licence.'
                                            fileFormats={[
                                                'image/jpeg',
                                                'image/jpg',
                                                'image/png',
                                                'image/gif',
                                                'application/pdf',
                                            ]}
                                            icon={<DrivingLicenseCardBack />}
                                            maxSize={8388608}
                                            noClick
                                            onFileChange={(file?: File) =>
                                                setFieldValue('drivingLicenseCardBack', file)
                                            }
                                        />
                                    </div>
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

export default DrivingLicenseUpload;
