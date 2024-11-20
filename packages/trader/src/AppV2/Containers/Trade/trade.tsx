import React from 'react';
import { observer } from 'mobx-react';
import { useDevice } from '@deriv-com/ui';
import TradeDesktop from './trade-desktop';
import TradeMobile from './trade-mobile';
import ServiceErrorSheet from 'AppV2/Components/ServiceErrorSheet';
import ClosedMarketMessage from 'AppV2/Components/ClosedMarketMessage';

const Trade = () => {
    const { isMobile } = useDevice();

    return (
        <React.Fragment>
            {isMobile ? <TradeMobile /> : <TradeDesktop />}
            <ServiceErrorSheet />
            <ClosedMarketMessage />
        </React.Fragment>
    );
};

export default Trade;
