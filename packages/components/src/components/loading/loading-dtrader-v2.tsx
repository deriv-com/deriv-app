import React from 'react';
import PositionsLoader from './dtrader-v2-loaders/positions-loader';
import ContractDetailsLoader from './dtrader-v2-loaders/contract-details-loader';
import TradeLoader from './dtrader-v2-loaders/trade-loader';

type TLoadingDTraderV2Props = {
    initial_app_loading?: boolean;
    is_closed_tab?: boolean;
    is_contract_details?: boolean;
    is_positions?: boolean;
};

/* TODO: remove this component after /trader package is separated into its own repo.
It's placed here temporarily since it includes dtrader_v2 pages loaders that are currently used in /core and /trader packages. */
const LoadingDTraderV2 = ({
    initial_app_loading,
    is_closed_tab,
    is_contract_details,
    is_positions,
}: TLoadingDTraderV2Props) => {
    if (is_positions)
        return <PositionsLoader initial_app_loading={initial_app_loading} is_closed_tab={is_closed_tab} />;
    if (is_contract_details) return <ContractDetailsLoader />;
    return <TradeLoader />;
};

export default LoadingDTraderV2;
