import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TCompareAccountsCard } from 'Components/props.types';

const CFDCompareAccountsButton = ({ trading_platforms }: TCompareAccountsCard) => {
    return (
        <Button className='compare-cfd-account__button' type='button' primary_light>
            {localize('Add')}
        </Button>
    );
};

export default CFDCompareAccountsButton;
