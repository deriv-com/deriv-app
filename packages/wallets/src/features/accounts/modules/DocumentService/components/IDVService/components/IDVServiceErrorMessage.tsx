import React from 'react';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { InlineMessage, WalletText } from '../../../../../../../components';
import './IDVServiceErrorMessage.scss';

const IDVServiceErrorMessage = ({ message }: { message: string }) => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-idv-service-error-message'>
            <WalletText weight='bold'>
                <Localize i18n_default_text='Your identity verification failed because:' />
            </WalletText>
            <InlineMessage message={message} size={!isDesktop ? 'md' : 'sm'} type='error' />
            <WalletText size='sm'>
                <Localize i18n_default_text="Let's try again. Choose another document and enter the corresponding details." />
            </WalletText>
        </div>
    );
};

export default IDVServiceErrorMessage;
