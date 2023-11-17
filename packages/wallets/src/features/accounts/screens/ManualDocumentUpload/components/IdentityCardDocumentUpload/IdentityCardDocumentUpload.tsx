import React from 'react';
import { Divider, Dropzone, WalletText, WalletTextField } from '../../../../../../components';
import IdentityCardBack from '../../../../../../public/images/accounts/document-back.svg';
import IdentityCardFront from '../../../../../../public/images/accounts/identity-card-front.svg';
import Calendar from '../../../../../../public/images/calendar.svg';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './IdentityCardDocumentUpload.scss';

const IdentityCardDocumentUpload = () => {
    return (
        <div className='wallets-identity-card-document-upload' data-testid='dt_identity-card-document-upload'>
            <WalletText>First, enter your Identity card number and the expiry date.</WalletText>
            <div className='wallets-identity-card-document-upload__input-group'>
                <WalletTextField label='Identity card number*' />
                <WalletTextField label='Expiry date*' renderRightIcon={() => <Calendar />} type='date' />
            </div>
            <Divider />
            <div className='wallets-identity-card-document-upload__document-section'>
                <WalletText>Next, upload the front and back of your identity card.</WalletText>
                <div className='wallets-identity-card-document-upload__dropzones'>
                    <div className='wallets-identity-card-document-upload__dropzones--left'>
                        <Dropzone
                            buttonText='Drop file or click here to upload'
                            description='Upload the front of your identity card.'
                            fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                            icon={<IdentityCardFront />}
                            maxSize={8388608}
                        />
                    </div>
                    <div className='wallets-identity-card-document-upload__dropzones--right'>
                        <Dropzone
                            buttonText='Drop file or click here to upload'
                            description='Upload the back of your identity card.'
                            fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                            icon={<IdentityCardBack />}
                            maxSize={8388608}
                        />
                    </div>
                </div>
                <DocumentRuleHints docType='identityCard' />
            </div>
        </div>
    );
};

export default IdentityCardDocumentUpload;
