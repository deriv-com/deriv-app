import * as React from 'react';
import Onboarding from 'Components/onboarding';
import { trading_hub_contents } from 'Constants/trading-hub-content';
import Options from 'Components/options';
import platform_config from 'Constants/platform-config';
import AddOptionsAccount from 'Components/add-options-account';
import CFDAccounts from 'Components/CFDs';

const TradingHub = () => {
    return (
        <div className='trading-hub'>
            Trading Hub
            <CFDAccounts account_type='real' />
            <AddOptionsAccount />
            <Onboarding contents={trading_hub_contents} />
            <Options platformlauncherprops={platform_config} />
        </div>
    );
};

export default TradingHub;
