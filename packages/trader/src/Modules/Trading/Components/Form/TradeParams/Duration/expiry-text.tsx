import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TExpiryText = {
    expiry_epoch?: number;
    has_error?: boolean;
    fixed_date?: string;
};
const ExpiryText = ({ expiry_epoch, has_error, fixed_date }: TExpiryText) => {
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
            <Localize i18n_default_text='Expiry: {{date}}' values={{ date: fixed_date || formatted_date }} />
        </Text>
    );
};

export default ExpiryText;
