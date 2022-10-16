import React from 'react';
import { ChartTitle, SmartChart } from '@deriv/deriv-charts';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import ToolbarWidgets from './toolbar-widgets';

interface TChartProps {
    chart_type: string;
    granularity: number;
    is_mobile: boolean;
    is_socket_opened: boolean;
    onSymbolChange: (symbol: string) => void;
    setChartStatus: (status: boolean) => void;
    settings: object;
    show_digits_stats: boolean;
    symbol: object;
    updateChartType: (chart_type: string) => void;
    updateGranularity: (granularity: number) => void;
    wsForget: (request) => void;
    wsForgetStream: (stream_id: string) => void;
    wsSendRequest: (req) => void;
    wsSubscribe: (req, callback) => void;
    getMarketsOrder: (active_symbols) => void;
}

const Chart = ({
    chart_type,
    granularity,
    is_mobile,
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
    getMarketsOrder,
}: TChartProps) => {
    const barriers = [];
    return (
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
            isMobile={is_mobile}
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
    );
};

export default connect(({ chart_store, common, ui }: RootStore) => ({
    is_mobile: ui.is_mobile,
    is_socket_opened: common.is_socket_opened,
    updateChartType: chart_store.updateChartType,
    updateGranularity: chart_store.updateGranularity,
    granularity: chart_store.granularity,
    chart_type: chart_store.chart_type,
    onSymbolChange: chart_store.onSymbolChange,
    settings: {
        assetInformation: false, // ui.is_chart_asset_info_visible,
        countdown: true,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    },
    last_contract: {
        is_digit_contract: false,
    },
    symbol: chart_store.symbol,
    setChartStatus: chart_store.setChartStatus,
    wsForget: chart_store.wsForget,
    wsForgetStream: chart_store.wsForgetStream,
    wsSendRequest: chart_store.wsSendRequest,
    wsSubscribe: chart_store.wsSubscribe,
    getMarketsOrder: chart_store.getMarketsOrder,
}))(Chart);
