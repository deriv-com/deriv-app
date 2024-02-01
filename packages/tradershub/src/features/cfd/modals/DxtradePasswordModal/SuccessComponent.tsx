import React from 'react';
import { useActiveTradingAccount } from '@deriv/api';
import { PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens';
import SuccessButtonGroup from './ButtonGroups/SuccessButtonGroup';

const SuccessComponent = () => {
    const { data: activeTrading } = useActiveTradingAccount();
    const isDemo = activeTrading?.is_virtual;

    const successDescription = isDemo
        ? `Congratulations, you have successfully created your demo ${PlatformDetails.dxtrade.title} account.`
        : `Congratulations, you have successfully created your real ${PlatformDetails.dxtrade.title} account. To start trading, transfer funds from your Deriv account into this account.`;

    return (
        <CFDSuccess
            description={successDescription}
            platform={PlatformDetails.dxtrade.platform}
            renderButtons={SuccessButtonGroup}
        />
    );
};

export default SuccessComponent;
