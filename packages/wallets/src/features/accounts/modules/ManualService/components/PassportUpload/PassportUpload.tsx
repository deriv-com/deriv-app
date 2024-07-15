import React, { useEffect } from 'react';
import { Formik } from 'formik';
import moment from 'moment';
import { Button, Divider } from '@deriv-com/ui';
import { DatePicker, Dropzone, FormField, ModalStepWrapper, WalletText } from '../../../../../../components';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import { documentRequiredValidator, expiryDateValidator } from '../../../../validations';
import { GeneralDocumentRules } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { usePassportUpload } from './hooks';
import './PassportUpload.scss';

type TFooterProps = {
    onClickBack?: () => void;
    onClickNext?: () => void;
};

const Footer: React.FC<TFooterProps> = ({ onClickBack, onClickNext }) => {
    return (
        <div className='wallets-passport-upload__footer'>
            {onClickBack && <Button onClick={onClickBack}>Back</Button>}
            {onClickNext && <Button onClick={onClickNext}>Next</Button>}
        </div>
    );
};

const PassportUpload = ({ onRender }) => {
    const { initialValues, submit } = usePassportUpload();

    return (
        <Formik initialValues={initialValues} onSubmit={submit}>
            {({ setFieldValue }) => {
                const handleDateChange = (dateString: string | null) => {
                    setFieldValue('passportExpiryDate', dateString);
                };

                const handleFileChange = (file?: File) => {
                    setFieldValue('passportFile', file);
                };

                return (
                    <div className='wallets-passport-upload' data-testid='dt_passport-document-upload'>
                        <WalletText>First, enter your Passport number and the expiry date.</WalletText>
                        <div className='wallets-passport-upload__input-group'>
                            <FormField
                                // defaultValue={formValues.passportNumber ?? ''}
                                label='Passport number*'
                                name='passportNumber'
                                validationSchema={documentRequiredValidator('Passport number')}
                            />
                            <DatePicker
                                // defaultValue={formValues.passportExpiryDate ?? ''}
                                label='Expiry date*'
                                minDate={moment().add(2, 'days').toDate()}
                                name='passportExpiryDate'
                                onDateChange={handleDateChange}
                                validationSchema={expiryDateValidator}
                            />
                        </div>
                        <Divider color='var(--border-divider)' height={2} />
                        <div className='wallets-passport-upload__document-upload'>
                            <WalletText>Next, upload the page of your passport that contains your photo.</WalletText>
                            <Dropzone
                                buttonText='Drop file or click here to upload'
                                // defaultFile={formValues.passportCard}
                                description='Upload the page of your passport that contains your photo.'
                                fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                                icon={<PassportPlaceholder />}
                                maxSize={8388608}
                                noClick
                                onFileChange={handleFileChange}
                            />
                            <DocumentRules hints={GeneralDocumentRules} />
                        </div>
                    </div>
                );
            }}
        </Formik>
    );
};

export default PassportUpload;
