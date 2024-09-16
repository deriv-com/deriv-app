import React from 'react';
import { Localize } from '@deriv-com/translations';
import { InlineMessage, Text } from '@deriv-com/ui';
import './IDVServiceErrorMessage.scss';

const IDVServiceErrorMessage = ({ message }: { message: string }) => (
    <div className='wallets-idv-service-error-message'>
        <Text weight='bold'>
            <Localize i18n_default_text='Your identity verification failed because:' />
        </Text>
        <InlineMessage variant='error'>{message}</InlineMessage>
        <Text size='sm'>
            <Localize i18n_default_text="Let's try again. Choose another document and enter the corresponding details." />
        </Text>
    </div>
);

export default IDVServiceErrorMessage;
