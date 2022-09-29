import * as React from 'react';
import Onboarding from 'Components/onboarding';
import { trading_hub_contents } from 'Constants/trading-hub-content';
import Options from 'Components/options';
import platform_config from 'Constants/platform-config';
import AddOptionsAccount from 'Components/add-options-account';

const TradingHub = () => {
    /*TODO: We need to show this component whenever user click on tour guide button*/
    return (
        <React.Fragment>
            {/* <AddOptionsAccount />
            <Onboarding contents={trading_hub_contents} /> */}
            <Options platformlauncherprops={platform_config} />
        </React.Fragment>
    );
};

export default TradingHub;
