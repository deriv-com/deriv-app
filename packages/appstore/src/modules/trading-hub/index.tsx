import * as React from 'react';
import Onboarding from 'Components/onboarding';
import { trading_hub_contents } from 'Constants/trading-hub-content';

const TradingHub = () => {
    return <Onboarding contents={trading_hub_contents} />;
};

export default TradingHub;
