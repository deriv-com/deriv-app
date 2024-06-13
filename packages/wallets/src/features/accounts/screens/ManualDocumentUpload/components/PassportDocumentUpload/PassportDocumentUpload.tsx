import React from 'react';
import { useFormikContext } from 'formik';
import moment from 'moment';
import {
    DatePicker,
    Dropzone,
    FlowTextField,
    FormDatePicker,
    FormTextField,
    useFlow,
} from '../../../../../../components';
import { Divider, WalletText } from '../../../../../../components/Base';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import { documentRequiredValidator, expiryDateValidator } from '../../../../validations';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './PassportDocumentUpload.scss';

const PassportDocumentUpload = () => {
    const { setFieldValue: setFormValues, values: formValues } = useFormikContext();

    const handleDateChange = (formattedDate: string | null) => {
        setFormValues('passportExpiryDate', formattedDate);
    };

    return (
        <div className='wallets-passport-document-upload' data-testid='dt_passport-document-upload'>
            <WalletText>First, enter your Passport number and the expiry date.</WalletText>
            <div className='wallets-passport-document-upload__input-group'>
                <FormTextField
                    defaultValue={formValues.passportNumber ?? ''}
                    label='Passport number*'
                    name='passportNumber'
                    validationSchema={documentRequiredValidator('Passport number')}
                />
                <FormDatePicker
                    defaultValue={formValues.passportExpiryDate ?? ''}
                    label='Expiry date*'
                    minDate={moment().add(2, 'days').toDate()}
                    name='passportExpiryDate'
                    onDateChange={handleDateChange}
                    validationSchema={expiryDateValidator}
                />
            </div>
            <Divider />
            <div className='wallets-passport-document-upload__document-upload'>
                <WalletText>Next, upload the page of your passport that contains your photo.</WalletText>
                <Dropzone
                    buttonText='Drop file or click here to upload'
                    defaultFile={formValues.passportCard}
                    description='Upload the page of your passport that contains your photo.'
                    fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                    icon={<PassportPlaceholder />}
                    maxSize={8388608}
                    noClick
                    onFileChange={(file?: File) => setFormValues('passportCard', file)}
                />
                <DocumentRuleHints docType='passport' />
            </div>
        </div>
    );
};

export default PassportDocumentUpload;
