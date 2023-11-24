import React from 'react';
import { Dropzone, FlowTextField, useFlow } from '../../../../../../components';
import { Divider, WalletText } from '../../../../../../components/Base';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './PassportDocumentUpload.scss';

const PassportDocumentUpload = () => {
    const { setFormValues } = useFlow();

    return (
        <div className='wallets-passport-document-upload' data-testid='dt_passport-document-upload'>
            <WalletText>First, enter your Passport number and the expiry date.</WalletText>
            <div className='wallets-passport-document-upload__input-group'>
                <FlowTextField label='Passport number*' name='passportNumber' />
                <FlowTextField label='Expiry date*' name='passportExpiryDate' placeholder='DD/MM/YYYY' type='date' />
            </div>
            <Divider />
            <div className='wallets-passport-document-upload__document-section'>
                <WalletText>Next, upload the page of your passport that contains your photo.</WalletText>
                <Dropzone
                    buttonText='Drop file or click here to upload'
                    description='Upload the page of your passport that contains your photo.'
                    fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                    icon={<PassportPlaceholder />}
                    maxSize={8388608}
                    onFileChange={(file: File) => setFormValues('passportCard', file)}
                />
                <DocumentRuleHints docType='passport' />
            </div>
        </div>
    );
};

export default PassportDocumentUpload;
