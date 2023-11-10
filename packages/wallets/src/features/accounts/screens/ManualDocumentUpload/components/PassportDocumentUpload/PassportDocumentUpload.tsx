import React from 'react';
import { Divider, WalletText, WalletTextField } from '../../../../../../components/Base';
import { Dropzone } from '../../../../../../components';
import { DocumentRuleHint } from '../DocumentRuleHint';
import useDevice from '../../../../../../hooks/useDevice';
import Calendar from '../../../../../../public/images/calendar.svg';
import ClearPhoto from '../../../../../../public/images/accounts/clear-photo.svg';
import ClockIcon from '../../../../../../public/images/accounts/clock-icon.svg';
import ImageIcon from '../../../../../../public/images/accounts/image-icon.svg';
import LessThanEightIcon from '../../../../../../public/images/accounts/less-than-eight-icon.svg';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import './PassportDocumentUpload.scss';

const documentRules = [
    {
        description: 'A clear colour photo or scanned image',
        icon: <ClearPhoto />,
    },
    {
        description: 'JPEG, JPG, PNG, PDF, or GIF',
        icon: <ImageIcon />,
    },
    {
        description: 'Less than 8MB',
        icon: <LessThanEightIcon />,
    },
    {
        description: 'Must be valid for at least 6 months',
        icon: <ClockIcon />,
    },
];

const PassportDocumentUpload = () => {
    const { isDesktop } = useDevice();

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
                    height='25rem'
                    icon={<PassportPlaceholder />}
                    maxSize={8388608}
                    minWidth={isDesktop ? '72.6rem' : '100%'}
                />
                <div className='wallets-passport-document-upload__rules'>
                    {documentRules.map((rule, idx) => (
                        <DocumentRuleHint key={idx} {...rule} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PassportDocumentUpload;
