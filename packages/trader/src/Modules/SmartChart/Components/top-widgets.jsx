import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isEnded, isDigitContract } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { AssetInformation, ChartTitle } from 'Modules/SmartChart';

const TradeInfo = ({ markers_array, granularity }) => {
    const latest_tick_contract = markers_array[markers_array.length - 1];
    if (!latest_tick_contract || !latest_tick_contract.contract_info.tick_stream) return null;

    const is_ended = isEnded(latest_tick_contract.contract_info);
    if (is_ended || granularity !== 0) return null;

    const { contract_type, tick_stream, tick_count } = latest_tick_contract.contract_info;
    const current_tick = isDigitContract(contract_type) ? tick_stream.length : Math.max(tick_stream.length - 1, 0);
    return (
        <span className='recent-trade-info'>
            {localize('Tick')} {current_tick}/{tick_count}
        </span>
    );
};

const RecentTradeInfo = connect(({ modules }) => ({
    granularity: modules.contract_trade.granularity,
    markers_array: modules.contract_trade.markers_array,
}))(TradeInfo);

const TopWidgets = ({
    InfoBox,
    is_mobile,
    is_title_enabled = true,
    onSymbolChange,
    y_axis_width,
    theme,
    open_market,
    open,
    is_digits_widget_active,
}) => {
    const ChartTitleLocal = (
        <ChartTitle
            open_market={open_market}
            open={open}
            enabled={is_title_enabled}
            onChange={onSymbolChange}
            searchInputClassName='data-hj-whitelist'
            isNestedList={is_mobile}
            portalNodeId={is_mobile ? 'deriv_app' : undefined}
        />
    );

    const portal = ReactDOM.createPortal(
        <div className={`smartcharts-${theme}`}>
            <div
                className='top-widgets-portal'
                style={{
                    width: `calc(100% - ${y_axis_width ? y_axis_width + 5 : 0}px)`,
                }}
            >
                {ChartTitleLocal}
                {!is_digits_widget_active && <RecentTradeInfo />}
            </div>
        </div>,
        document.getElementById('app_contents')
    );

    return (
        <React.Fragment>
            {InfoBox}
            <MobileWrapper>{portal}</MobileWrapper>
            <DesktopWrapper>{ChartTitleLocal}</DesktopWrapper>
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
