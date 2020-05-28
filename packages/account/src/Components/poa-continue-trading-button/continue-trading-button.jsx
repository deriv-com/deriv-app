import { ButtonLink } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

export const ContinueTradingButton = () => (
    <ButtonLink to='/'>
        <p className='dc-btn__text'>{localize('Continue trading')}</p>
    </ButtonLink>
);
