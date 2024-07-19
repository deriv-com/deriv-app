import React, { useState } from 'react';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import moment from 'moment';
import { TSocketError } from '@deriv/api-v2/types';
import { Divider } from '@deriv-com/ui';
import { DatePicker, Dropzone, FormField, ModalStepWrapper, WalletText } from '../../../../../../components';
import DrivingLicenseCardBack from '../../../../../../public/images/accounts/document-back.svg';
import DrivingLicenseCardFront from '../../../../../../public/images/accounts/driving-license-front.svg';
import { documentRequiredValidator, expiryDateValidator } from '../../../../validations';
import { Footer } from '../../../components';
import { GeneralDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload, useSelfieUpload } from '../SelfieUpload';
import { useDrivingLicenseUpload } from './hooks';
import './DrivingLicenseUpload.scss';

const DrivingLicenseUpload: TManualDocumentComponent = ({ documentIssuingCountryCode, onClickBack, onCompletion }) => {
    const {
        error: errorDrivingLicenseUpload,
        initialValues: initialValuesDrivingLicenseUpload,
        isSuccess: isDrivingLicenseUploadSuccess,
        resetError: resetErrorDrivingLicenseUpload,
        submit: uploadDrivingLicense,
    } = useDrivingLicenseUpload(documentIssuingCountryCode);
    const {
        error: errorSelfieUpload,
        initialValues: initialValuesSelfieUpload,
        isSuccess: isSelfieUploadSuccess,
        resetError: resetErrorSelfieUpload,
        submit: uploadSelfie,
    } = useSelfieUpload(documentIssuingCountryCode);
    const [showSelfieUpload, setShowSelfieUpload] = useState(false);
    const [uploadError, setUploadError] = useState<TSocketError<'document_upload'>['error']>();

    const submit = async (values: FormikValues, helpers: FormikHelpers<typeof initialValuesDrivingLicenseUpload>) => {
        await uploadDrivingLicense(values, helpers);
        await uploadSelfie(values);
        if (errorDrivingLicenseUpload || errorSelfieUpload) {
            setUploadError(errorDrivingLicenseUpload || errorSelfieUpload);
        } else if (isDrivingLicenseUploadSuccess && isSelfieUploadSuccess && onCompletion) {
            onCompletion();
        }
    };

    return (
        <Formik
            initialValues={{ ...initialValuesDrivingLicenseUpload, ...initialValuesSelfieUpload }}
            onSubmit={submit}
        >
            {({ dirty, errors, handleSubmit, resetForm, setFieldValue, values }) => {
                const isDrivingLicenseFormDirty =
                    dirty &&
                    !errors.drivingLicenceNumber &&
                    !errors.drivingLicenseExpiryDate &&
                    !errors.drivingLicenseCardBack &&
                    !errors.drivingLicenseCardFront;

                const onErrorRetry = () => {
                    resetErrorDrivingLicenseUpload();
                    resetErrorSelfieUpload();
                    resetForm();
                };

                const handleOnClickNext = () => {
                    if (isDrivingLicenseFormDirty) {
                        setShowSelfieUpload(true);
                    }
                };

                if (uploadError) {
                    return <ManualUploadErrorMessage errorCode={uploadError.code} onRetry={onErrorRetry} />;
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
                                disableNext={!isDrivingLicenseFormDirty}
                                onClickBack={onClickBack}
                                onClickNext={handleOnClickNext}
                            />
                        )}
                        title='Add a real MT5 account'
                    >
                        <div
                            className='wallets-driving-license-upload'
                            data-testid='dt_driving-license-document-upload'
                        >
                            <WalletText>First, enter your Driving licence number and the expiry date.</WalletText>
                            <div className='wallets-driving-license-upload__input-group'>
                                <FormField
                                    defaultValue={values.drivingLicenceNumber ?? ''}
                                    label='Driving licence number*'
                                    name='drivingLicenceNumber'
                                    validationSchema={documentRequiredValidator('Driving licence number')}
                                />
                                <DatePicker
                                    defaultValue={values.drivingLicenseExpiryDate ?? ''}
                                    label='Expiry date*'
                                    minDate={moment().add(2, 'days').toDate()}
                                    name='drivingLicenseExpiryDate'
                                    placeholder='DD/MM/YYYY'
                                    validationSchema={expiryDateValidator}
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
                                        onFileChange={(file?: File) => setFieldValue('drivingLicenseCardFront', file)}
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
                                        onFileChange={(file?: File) => setFieldValue('drivingLicenseCardBack', file)}
                                    />
                                </div>
                                <DocumentRules hints={GeneralDocumentRules} />
                            </div>
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default DrivingLicenseUpload;
