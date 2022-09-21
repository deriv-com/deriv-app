import * as React from 'react';
import Onboarding from 'Components/onboarding';
import { trading_hub_contents } from 'Constants/trading-hub-content';
import Options from '../../components/options';
import platform_config from '../../constants/platform-config';

const TradingHub = () => {
    /*TODO: We need to show this component whenever user click on tour guide button*/
    return <Options platformlauncherprops={platform_config} />;
};

export default TradingHub;
