import React from 'react';
import ReactDOM from 'react-dom';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { ChartTitle } from 'Modules/SmartChart';
import { ChartTitleBeta } from 'Modules/SmartChartBeta';
import { useTraderStore } from 'Stores/useTraderStores';
import RecentTradeInfo from './recent-trade-info';

type TTopWidgets = {
    InfoBox?: React.ReactNode;
    is_digits_widget_active?: boolean;
    is_mobile?: boolean;
    is_title_enabled?: boolean;
    is_beta_chart?: boolean;
    onSymbolChange?: ReturnType<typeof useTraderStore>['onChange'];
    open?: boolean;
    open_market?: {
        category?: string;
        subcategory?: string;
    } | null;
    theme?: string;
    y_axis_width?: number;
};

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
