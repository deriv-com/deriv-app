import { ButtonLink, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

export const PoiButton = () => (
    <ButtonLink to='/account/proof-of-identity'>
        <Text className='dc-btn__text' weight='bold' as='p'>
            {localize('Submit proof of identity')}
        </Text>
    </ButtonLink>
);
