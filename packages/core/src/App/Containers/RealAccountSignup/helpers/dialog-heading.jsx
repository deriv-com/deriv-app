import React from 'react';
import { Text } from '@deriv-lib/components';
import { Localize } from '@deriv-lib/translations';

export const DialogHeading = () => (
    <Text as='h2' align='center' className='status-dialog__message-header' weight='bold'>
        <Localize i18n_default_text='Your account is ready' />
    </Text>
);
