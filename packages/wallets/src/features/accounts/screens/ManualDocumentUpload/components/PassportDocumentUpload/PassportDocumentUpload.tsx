import React from 'react';
import { Dropzone } from '../../../../../../components';
import { Divider, WalletText, WalletTextField } from '../../../../../../components/Base';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import Calendar from '../../../../../../public/images/calendar.svg';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './PassportDocumentUpload.scss';

const PassportDocumentUpload = () => {
    return (
        <div className='wallets-passport-document-upload' data-testid='dt_passport-document-upload'>
            <WalletText>First, enter your Passport number and the expiry date.</WalletText>
            <div className='wallets-passport-document-upload__input-group'>
                <WalletTextField label='Passport number*' />
                <WalletTextField label='Expiry date*' renderRightIcon={() => <Calendar />} type='date' />
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
                />
                <DocumentRuleHints docType='passport' />
            </div>
        </div>
    );
};

export default PassportDocumentUpload;
