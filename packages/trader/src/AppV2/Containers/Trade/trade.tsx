import React from 'react';
import { useDevice } from '@deriv-com/ui';
import ServiceErrorSheet from 'AppV2/Components/ServiceErrorSheet';
import ClosedMarketMessage from 'AppV2/Components/ClosedMarketMessage';
import TradeDesktop from './trade-desktop';
import TradeMobile from './trade-mobile';

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
