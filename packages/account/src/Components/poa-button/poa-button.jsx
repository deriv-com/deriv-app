import { ButtonLink, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

export const PoaButton = () => (
    <ButtonLink to='/account/proof-of-address'>
        <Text className='dc-btn__text' as='p' weight='bold'>
            {localize('Submit proof of address')}
        </Text>
    </ButtonLink>
);
