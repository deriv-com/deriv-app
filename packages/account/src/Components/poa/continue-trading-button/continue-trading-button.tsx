import { ButtonLink, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

export const ContinueTradingButton = () => (
    <ButtonLink className='account-management__button' to='/'>
        <Text className='dc-btn__text' as='p' weight='bold' data-testid='continue_btn_text'>
            {localize('Continue trading')}
        </Text>
    </ButtonLink>
);
