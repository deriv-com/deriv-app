import { ButtonLink, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

export const ContinueTradingButton = () => (
    <ButtonLink to='/'>
        <Text className='dc-btn__text account-management__continue' as='p' weight='bold'>
            {localize('Continue trading')}
        </Text>
    </ButtonLink>
);
