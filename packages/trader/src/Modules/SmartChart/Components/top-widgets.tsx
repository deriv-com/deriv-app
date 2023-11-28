import React from 'react';
import ReactDOM from 'react-dom';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isEnded, isAccumulatorContract, isDigitContract } from '@deriv/shared';
import { ChartTitle } from 'Modules/SmartChart';
import { ChartTitleBeta } from 'Modules/SmartChartBeta';
import BuyToastNotification from './buy-toast-notification';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

type TTopWidgets = {
    InfoBox?: React.ReactNode;
    is_digits_widget_active?: boolean;
    is_mobile?: boolean;
    is_title_enabled?: boolean;
    is_beta_chart?: boolean;
    onSymbolChange?: ReturnType<typeof useTraderStore>['onChange'];
    open?: boolean;
    open_market?: {
        category: string | null;
        subcategory?: string | null;
    };
    theme?: string;
    y_axis_width?: number;
};

const RecentTradeInfo = observer(() => {
    const { contract_trade, client } = useStore();
    const { granularity, filtered_contracts, markers_array } = contract_trade;

    const latest_tick_contract = client.is_beta_chart
        ? filtered_contracts[filtered_contracts.length - 1]
        : markers_array[markers_array.length - 1];
    if (
        !latest_tick_contract?.contract_info.tick_stream ||
        isAccumulatorContract(latest_tick_contract.contract_info.contract_type)
    )
        return null;

    const is_ended = isEnded(latest_tick_contract.contract_info);
    if (is_ended || granularity !== 0) return null;

    const { contract_type, tick_stream, tick_count } = latest_tick_contract.contract_info;
    const current_tick = isDigitContract(contract_type) ? tick_stream.length : Math.max(tick_stream.length - 1, 0);
    return (
        <Text weight='bold' className='recent-trade-info'>
            {localize('Tick')} {current_tick}/{tick_count}
        </Text>
    );
});

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
    is_beta_chart,
}: TTopWidgets) => {
    const ChartTitleComponent = is_beta_chart ? ChartTitleBeta : ChartTitle;
    const ChartTitleLocal = (
        <ChartTitleComponent
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
                {is_mobile && <BuyToastNotification />}
                {ChartTitleLocal}
                {!is_digits_widget_active && <RecentTradeInfo />}
            </div>
        </div>,
        document.getElementById('app_contents') as Element | DocumentFragment
    );

    return (
        <React.Fragment>
            {InfoBox}
            <MobileWrapper>{portal}</MobileWrapper>
            <DesktopWrapper>{ChartTitleLocal}</DesktopWrapper>
        </React.Fragment>
    );
};

export default TopWidgets;
