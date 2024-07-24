import React from 'react';
import { InlineMessage, WalletText } from '../../../../../../../components';
import useDevice from '../../../../../../../hooks/useDevice';
import './IDVServiceErrorMessage.scss';

const IDVServiceErrorMessage = ({ message }: { message: string }) => {
    const { isMobile } = useDevice();

    return (
        <div className='wallets-idv-error-message'>
            <WalletText weight='bold'>Your identity verification failed because:</WalletText>
            <InlineMessage message={message} size={isMobile ? 'md' : 'sm'} type='error' />
            <WalletText size='sm'>
                Let&apos;s try again. Choose another document and enter the corresponding details.
            </WalletText>
        </div>
    );
};

export default IDVServiceErrorMessage;
