import { ButtonLink } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

export const PoiButton = () => (
    <ButtonLink to='/account/proof-of-identity'>
        <p className='dc-btn__text'>{localize('Submit proof of identity')}</p>
    </ButtonLink>
);
