import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const ExpiryText = ({ expiry_epoch, has_error }) => {
    const formatted_date =
        expiry_epoch && !has_error
            ? new Date(expiry_epoch * 1000)
                  .toUTCString()
                  .replace('GMT', 'GMT +0')
                  .substring(5)
                  .replace(/(\d{2}) (\w{3} \d{4})/, '$1 $2,')
            : '';

    return (
        <Text as='div' size='xxxs' line_height='s' className='expiry-text-container'>
            <Localize i18n_default_text='Expiry: {{date}}' values={{ date: formatted_date }} />
        </Text>
    );
};

export default ExpiryText;
