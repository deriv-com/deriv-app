import React from 'react';
import { Divider, Dropzone, WalletText, WalletTextField } from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import IdentityCardBack from '../../../../../../public/images/accounts/document-back.svg';
import IdentityCardFront from '../../../../../../public/images/accounts/identity-card-front.svg';
import Calendar from '../../../../../../public/images/calendar.svg';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './IdentityCardDocumentUpload.scss';

const IdentityCardDocumentUpload = () => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-identity-card-document-upload' data-testid='dt_passport-document-upload'>
            <WalletText>First, enter your Identity card number and the expiry date.</WalletText>
            <div className='wallets-identity-card-document-upload__input-group'>
                <WalletTextField label='Identity card number*' maxWidth='100%' />
                <WalletTextField
                    label='Expiry date*'
                    maxWidth='100%'
                    renderRightIcon={() => <Calendar />}
                    type='date'
                />
            </div>
            <Divider />
            <div className='wallets-identity-card-document-upload__document-section'>
                <WalletText>Next, upload the front and back of your identity card.</WalletText>
                <div className='wallets-identity-card-document-upload__dropzones'>
                    <Dropzone
                        buttonText='Drop file or click here to upload'
                        description='Upload the front of your identity card.'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        height='25rem'
                        icon={<IdentityCardFront />}
                        maxSize={8388608}
                        minWidth={isDesktop ? '33.5rem' : '100%'}
                        padding={isDesktop ? '4rem 4.7rem 4rem 3.9rem' : '2rem'}
                    />
                    <Dropzone
                        buttonText='Drop file or click here to upload'
                        description='Upload the back of your identity card.'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        height='25rem'
                        icon={<IdentityCardBack />}
                        maxSize={8388608}
                        minWidth={isDesktop ? '31rem' : '100%'}
                        padding={isDesktop ? '4rem 2.4rem' : '2rem'}
                    />
                </div>
                <DocumentRuleHints docType='identityCard' />
            </div>
        </div>
    );
};

export default IdentityCardDocumentUpload;
