import React from 'react';
import { Button } from '@deriv/components';
import { TModifiedTradingPlatformAvailableAccount } from 'Components/props.types';

type TCFDCompareAccountsPlatformLabelProps = {
    trading_platforms: TModifiedTradingPlatformAvailableAccount;
};

const CFDCompareAccountsButton = ({ trading_platforms }: TCFDCompareAccountsPlatformLabelProps) => {
    return (
        <div>
            <Button className='compare-cfd-account__button' type='button' primary_light>
                Add
            </Button>
        </div>
    );
};

export default CFDCompareAccountsButton;
