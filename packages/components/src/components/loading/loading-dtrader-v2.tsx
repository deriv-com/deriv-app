import React from 'react';
import PositionsLoader from './dtrader-v2-loaders/positions-loader';
import ContractDetailsLoader from './dtrader-v2-loaders/contract-details-loader';
import TradeLoader from './dtrader-v2-loaders/trade-loader';
import HeaderLoader from './dtrader-v2-loaders/header-loader';

type TLoadingDTraderV2Props = {
    initial_app_loading?: boolean;
    is_closed_tab?: boolean;
    is_contract_details?: boolean;
    is_header?: boolean;
    is_positions?: boolean;
};

const LoadingDTraderV2 = ({
    initial_app_loading,
    is_closed_tab,
    is_contract_details,
    is_header,
    is_positions,
}: TLoadingDTraderV2Props) => {
    if (is_header) return <HeaderLoader show_notifications_skeleton={!is_positions} />;
    if (is_positions)
        return <PositionsLoader initial_app_loading={initial_app_loading} is_closed_tab={is_closed_tab} />;
    if (is_contract_details) return <ContractDetailsLoader />;
    return <TradeLoader />;
};

export default LoadingDTraderV2;
