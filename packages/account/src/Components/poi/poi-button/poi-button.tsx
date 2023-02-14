import { ButtonLink, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

export const PoiButton = () => (
    <ButtonLink className='account-management__button' to='/account/proof-of-identity'>
        <Text className='dc-btn__text' weight='bold' as='p'>
            {localize('Proof of identity')}
        </Text>
    </ButtonLink>
);
