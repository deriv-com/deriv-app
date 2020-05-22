import { ButtonLink } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

export const PoaButton = () => (
    <ButtonLink to='/account/proof-of-address'>
        <p className='dc-btn__text'>{localize('Submit proof of address')}</p>
    </ButtonLink>
);
