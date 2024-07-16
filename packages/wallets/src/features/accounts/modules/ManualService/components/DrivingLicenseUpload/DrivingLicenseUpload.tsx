import React from 'react';
import { Formik } from 'formik';
import moment from 'moment';
import { Divider } from '@deriv-com/ui';
import { DatePicker, Dropzone, FormField, WalletText } from '../../../../../../components';
import DrivingLicenseCardBack from '../../../../../../public/images/accounts/document-back.svg';
import DrivingLicenseCardFront from '../../../../../../public/images/accounts/driving-license-front.svg';
import { documentRequiredValidator, expiryDateValidator } from '../../../../validations';
import { GeneralDocumentRules } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { useDrivingLicenseUpload } from './hooks';
import './DrivingLicenseUpload.scss';

type TDrivingLicenseUploadProps = {
    onCompletion?: () => void;
};

const DrivingLicenseUpload: React.FC<TDrivingLicenseUploadProps> = ({ onCompletion }) => {
    const { error, initialValues, isDrivingLicenseUploadSuccess, submit } = useDrivingLicenseUpload();

    if (isDrivingLicenseUploadSuccess && onCompletion) {
        onCompletion();
    }

    if (error) {
        return <ManualUploadErrorMessage errorCode={error.code} />;
    }

    return (
        <Formik initialValues={initialValues} onSubmit={submit}>
            {({ setFieldValue, values }) => {
                const handleDateChange = (formattedDate: string | null) => {
                    setFieldValue('drivingLicenseExpiryDate', formattedDate);
                };

                return (
                    <div className='wallets-driving-license-upload' data-testid='dt_driving-license-document-upload'>
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
                                onDateChange={handleDateChange}
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
                );
            }}
        </Formik>
    );
};

export default DrivingLicenseUpload;
