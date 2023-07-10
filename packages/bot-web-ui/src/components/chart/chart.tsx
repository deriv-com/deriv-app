import React from 'react';
import classNames from 'classnames';
import { ActiveSymbols, ForgetRequest } from '@deriv/api-types';
// TODO Remove this after smartcharts is replaced
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ChartTitle, SmartChart } from '@deriv/deriv-charts';
import { isDesktop, isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import ToolbarWidgets from './toolbar-widgets';

interface TChartProps {
    chart_type: string;
    getMarketsOrder: (active_symbols: ActiveSymbols) => string[];
    granularity: number;
    is_drawer_open: boolean;
    is_socket_opened: boolean;
    onSymbolChange: (symbol: string) => void;
    setChartStatus: (status: boolean) => void;
    settings: object;
    show_digits_stats: boolean;
    symbol: object;
    updateChartType: (chart_type: string) => void;
    updateGranularity: (granularity: number) => void;
    wsForget: (request: ForgetRequest) => void;
    wsForgetStream: (stream_id: string) => void;
    wsSendRequest: (req: { [k: string]: unknown }) => void;
    wsSubscribe: (req: { [k: string]: unknown }, callback: () => void) => void;
}

const Chart = ({
    chart_type,
    getMarketsOrder,
    granularity,
    is_drawer_open,
    is_socket_opened,
    onSymbolChange,
    setChartStatus,
    settings,
    show_digits_stats,
    symbol,
    updateChartType,
    updateGranularity,
    wsForget,
    wsForgetStream,
    wsSendRequest,
    wsSubscribe,
}: TChartProps) => {
    const barriers: [] = [];
    return (
        <div
            className={classNames('dashboard__chart-wrapper', {
                'dashboard__chart-wrapper--expanded': is_drawer_open && !isMobile(),
            })}
        >
            <SmartChart
                id='dbot'
                barriers={barriers}
                showLastDigitStats={show_digits_stats}
                chartControlsWidgets={null}
                enabledChartFooter={false}
                chartStatusListener={v => setChartStatus(!v)}
                toolbarWidget={() => (
                    <ToolbarWidgets updateChartType={updateChartType} updateGranularity={updateGranularity} />
                )}
                chartType={chart_type}
                isMobile={isMobile()}
                enabledNavigationWidget={isDesktop()}
                granularity={granularity}
                requestAPI={wsSendRequest}
                requestForget={wsForget}
                requestForgetStream={wsForgetStream}
                requestSubscribe={wsSubscribe}
                settings={settings}
                symbol={symbol}
                topWidgets={() => <ChartTitle onChange={onSymbolChange} />}
                isConnectionOpened={is_socket_opened}
                getMarketsOrder={getMarketsOrder}
            />
        </div>
    );
};

export default connect(({ chart_store, common, ui, run_panel }: RootStore) => ({
    chart_type: chart_store.chart_type,
    getMarketsOrder: chart_store.getMarketsOrder,
    granularity: chart_store.granularity,
    last_contract: {
        is_digit_contract: false,
    },
    is_drawer_open: run_panel.is_drawer_open,
    is_socket_opened: common.is_socket_opened,
    onSymbolChange: chart_store.onSymbolChange,
    setChartStatus: chart_store.setChartStatus,
    settings: {
        assetInformation: false, // ui.is_chart_asset_info_visible,
        countdown: true,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    },
    symbol: chart_store.symbol,
    updateChartType: chart_store.updateChartType,
    updateGranularity: chart_store.updateGranularity,
    wsForget: chart_store.wsForget,
    wsForgetStream: chart_store.wsForgetStream,
    wsSendRequest: chart_store.wsSendRequest,
    wsSubscribe: chart_store.wsSubscribe,
}))(Chart);
