import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { AssetInformation, ChartTitle } from 'Modules/SmartChart';
import { isEnded } from 'Stores/Modules/Contract/Helpers/logic';

const TradeInfo = ({ markers_array }) => {
    const latest_tick_contract = markers_array[markers_array.length - 1];
    if (!latest_tick_contract || !latest_tick_contract.contract_info.tick_stream) return null;

    const is_ended = isEnded(latest_tick_contract.contract_info);
    if (is_ended) return null;

    const { tick_stream, tick_count } = latest_tick_contract.contract_info;
    return (
        <span className='recent-trade-info'>
            {localize('Tick')} {Math.max(tick_stream.length - 1, 0)}/{tick_count}
        </span>
    );
};

const RecentTradeInfo = connect(({ modules }) => ({
    markers_array: modules.contract_trade.markers_array,
}))(TradeInfo);

const TopWidgets = ({ InfoBox, is_mobile, is_title_enabled = true, onSymbolChange }) => {
    return (
        <React.Fragment>
            {InfoBox}
            <ChartTitle
                enabled={is_title_enabled}
                onChange={onSymbolChange}
                searchInputClassName='data-hj-whitelist'
                portalNodeId={is_mobile ? 'deriv_app' : undefined}
                containerId={is_mobile ? 'app_contents' : undefined}
            />
            {is_mobile && <RecentTradeInfo />}
            <AssetInformation />
        </React.Fragment>
    );
};

TopWidgets.propTypes = {
    InfoBox: PropTypes.node,
    is_mobile: PropTypes.bool,
    is_title_enabled: PropTypes.bool,
    onSymbolChange: PropTypes.func,
};

export default TopWidgets;
