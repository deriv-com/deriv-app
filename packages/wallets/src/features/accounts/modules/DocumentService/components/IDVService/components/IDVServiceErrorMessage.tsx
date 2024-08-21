import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { InlineMessage } from '../../../../../../../components';
import useDevice from '../../../../../../../hooks/useDevice';
import './IDVServiceErrorMessage.scss';

const IDVServiceErrorMessage = ({ message }: { message: string }) => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-idv-service-error-message'>
            <Text weight='bold'>
                <Localize i18n_default_text='Your identity verification failed because:' />
            </Text>
            <InlineMessage message={message} size={!isDesktop ? 'md' : 'sm'} type='error' />
            <Text size='sm'>
                <Localize i18n_default_text="Let's try again. Choose another document and enter the corresponding details." />
            </Text>
        </div>
    );
};

export default IDVServiceErrorMessage;
