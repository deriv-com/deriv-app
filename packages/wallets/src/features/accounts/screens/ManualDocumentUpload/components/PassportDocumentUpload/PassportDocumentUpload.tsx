import React from 'react';
import { Dropzone } from '../../../../../../components';
import { Divider, WalletText, WalletTextField } from '../../../../../../components/Base';
import useDevice from '../../../../../../hooks/useDevice';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import Calendar from '../../../../../../public/images/calendar.svg';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './PassportDocumentUpload.scss';

const PassportDocumentUpload = () => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-passport-document-upload' data-testid='dt_passport-document-upload'>
            <WalletText>First, enter your Passport number and the expiry date.</WalletText>
            <div className='wallets-passport-document-upload__input-group'>
                <WalletTextField label='Passport number*' maxWidth='100%' />
                <WalletTextField
                    label='Expiry date*'
                    maxWidth='100%'
                    renderRightIcon={() => <Calendar />}
                    type='date'
                />
            </div>
            <Divider />
            <div className='wallets-passport-document-upload__document-section'>
                <WalletText>Next, upload the page of your passport that contains your photo.</WalletText>
                <Dropzone
                    buttonText='Drop file or click here to upload'
                    description='Upload the page of your passport that contains your photo.'
                    fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                    height='25rem'
                    icon={<PassportPlaceholder />}
                    maxSize={8388608}
                    minWidth={isDesktop ? '72.6rem' : '100%'}
                    padding={isDesktop ? '2.8rem 15.2rem 3.5rem' : '2.4rem 2.5rem 0.4rem'}
                />
                <DocumentRuleHints docType='passport' />
            </div>
        </div>
    );
};

export default PassportDocumentUpload;
