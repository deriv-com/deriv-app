import * as React from 'react';
// import Onboarding from 'Components/onboarding';
// import { trading_hub_contents } from 'Constants/trading-hub-content';
import AddOptionsAccount from '../../components/add-options-account/add-options-account';

const TradingHub = () => {
    /*TODO: We need to show this component whenever user click on tour guide button*/
    // return (<Onboarding contents={trading_hub_contents} />;)
    return <AddOptionsAccount />;
};

export default TradingHub;
