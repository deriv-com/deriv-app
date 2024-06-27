import React from 'react';
import { routes } from '@deriv/shared';
import PositionsLoader from './dtrader-v2-loaders/positions-loader';
import ContractDetailsLoader from './dtrader-v2-loaders/contract-details-loader';
import TradeLoader from './dtrader-v2-loaders/trade-loader';

type TLoadingDTraderV2Props = {
    is_closed_tab?: boolean;
};

const LoadingDTraderV2 = ({ is_closed_tab }: TLoadingDTraderV2Props) => {
    if (window.location.pathname === routes.trader_positions) return <PositionsLoader is_closed_tab={is_closed_tab} />;
    if (window.location.pathname.startsWith('/contract/')) return <ContractDetailsLoader />;
    return <TradeLoader />;
};

export default LoadingDTraderV2;
