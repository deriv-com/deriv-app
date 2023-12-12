import React from 'react';
import { ActiveSymbols } from '@deriv/api-types';
import { isDesktop } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { ChartBottomWidgets } from './chart-widgets';
import SmartChartSwitcher from './smart-chart-switcher';
import AccumulatorsChartElements from '../../SmartChart/Components/Markers/accumulators-chart-elements';
import ToolbarWidgets from '../../SmartChart/Components/toolbar-widgets';
import ToolbarWidgetsBeta from '../../SmartChartBeta/Components/toolbar-widgets';
import AllMarkers from '../../SmartChart/Components/all-markers.jsx';
import type { TBottomWidgetsParams } from './trade';

type TTradeChartProps = {
    bottomWidgets?: (props: TBottomWidgetsParams) => React.ReactElement;
    has_barrier?: boolean;
    is_accumulator: boolean;
    topWidgets: () => React.ReactElement;
};

const TradeChart = observer((props: TTradeChartProps) => {
    const { has_barrier, is_accumulator, topWidgets } = props;
    const { client, ui, common, contract_trade, portfolio } = useStore();
    const {
        accumulator_barriers_data,
        accumulator_contract_barriers_data,
        chart_type,
        granularity,
        has_crossed_accu_barriers,
        markers_array,
        updateChartType,
        updateGranularity,
    } = contract_trade;
    const { all_positions } = portfolio;
    const { is_chart_countdown_visible, is_chart_layout_default, is_dark_mode_on, is_mobile, is_positions_drawer_on } =
        ui;
    const { current_language, is_socket_opened } = common;
    const { currency, is_beta_chart, should_show_eu_content } = client;
    const {
        active_symbols,
        barriers_flattened: extra_barriers,
        chartStateChange,
        chart_layout,
        exportLayout,
        has_alternative_source,
        is_trade_enabled,
        main_barrier_flattened: main_barrier,
        setChartStatus,
        show_digits_stats,
        symbol,
        wsForget,
        wsForgetStream,
        wsSendRequest,
        wsSubscribe,
    } = useTraderStore();

    const settings = {
        countdown: is_chart_countdown_visible,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: current_language.toLowerCase(),
        position: is_chart_layout_default ? 'bottom' : 'left',
        theme: is_dark_mode_on ? 'dark' : 'light',
        ...(is_accumulator ? { whitespace: 190, minimumLeftBars: is_mobile ? 3 : undefined } : {}),
        ...(has_barrier ? { whitespace: 110 } : {}),
    };

    const { current_spot, current_spot_time } = accumulator_barriers_data || {};

    const getBottomWidgets = React.useCallback(
        ({ digits, tick }: TBottomWidgetsParams) => (
            <ChartBottomWidgets digits={digits} tick={tick} show_accumulators_stats={is_accumulator} />
        ),
        [is_accumulator]
    );

    const getMarketsOrder = (active_symbols: ActiveSymbols): string[] => {
        const synthetic_index = 'synthetic_index';
        const has_synthetic_index = active_symbols.some(s => s.market === synthetic_index);
        return active_symbols
            .slice()
            .sort((a, b) => (a.display_name < b.display_name ? -1 : 1))
            .map(s => s.market)
            .reduce(
                (arr, market) => {
                    if (arr.indexOf(market) === -1) arr.push(market);
                    return arr;
                },
                has_synthetic_index ? [synthetic_index] : []
            );
    };

    const barriers = main_barrier ? [main_barrier, ...extra_barriers] : extra_barriers;

    // max ticks to display for mobile view for tick chart
    const max_ticks = granularity === 0 ? 8 : 24;

    if (!symbol || !active_symbols.length) return null;

    return (
        <SmartChartSwitcher
            allowTickChartTypeOnly={show_digits_stats || is_accumulator}
            barriers={barriers}
            bottomWidgets={
                (is_accumulator || show_digits_stats) && isDesktop() ? getBottomWidgets : props.bottomWidgets
            }
            chartControlsWidgets={null}
            chartData={{
                activeSymbols: JSON.parse(JSON.stringify(active_symbols)),
            }}
            chartStatusListener={(v: boolean) => setChartStatus(!v)}
            chartType={chart_type}
            clearChart={false}
            contracts_array={markers_array}
            crosshair={is_mobile ? 0 : undefined}
            crosshairTooltipLeftAllow={560}
            feedCall={{
                activeSymbols: false,
            }}
            enabledNavigationWidget={isDesktop()}
            enabledChartFooter={false}
            getMarketsOrder={getMarketsOrder}
            granularity={show_digits_stats || is_accumulator ? 0 : Number(granularity)}
            hasAlternativeSource={has_alternative_source}
            id='trade'
            importedLayout={chart_layout}
            initialData={{
                activeSymbols: JSON.parse(JSON.stringify(active_symbols)),
            }}
            isConnectionOpened={is_socket_opened}
            isLive
            isMobile={is_mobile}
            is_beta={is_beta_chart}
            leftMargin={isDesktop() && is_positions_drawer_on ? 328 : 80}
            maxTick={is_mobile ? max_ticks : undefined}
            onExportLayout={exportLayout}
            requestAPI={wsSendRequest}
            requestForget={wsForget}
            requestForgetStream={wsForgetStream}
            requestSubscribe={wsSubscribe}
            settings={settings}
            shouldFetchTradingTimes
            should_show_eu_content={should_show_eu_content}
            should_zoom_out_on_yaxis={is_accumulator}
            showLastDigitStats={isDesktop() ? show_digits_stats : false}
            stateChangeListener={chartStateChange}
            symbol={symbol}
            toolbarWidget={() => {
                if (is_beta_chart) {
                    return (
                        <ToolbarWidgetsBeta
                            is_mobile={is_mobile}
                            updateChartType={updateChartType}
                            updateGranularity={updateGranularity}
                        />
                    );
                }
                return (
                    <ToolbarWidgets
                        is_mobile={is_mobile}
                        updateChartType={updateChartType}
                        updateGranularity={updateGranularity}
                    />
                );
            }}
            topWidgets={is_trade_enabled ? topWidgets : undefined}
            yAxisMargin={{
                top: is_mobile ? 76 : 106,
            }}
        >
            {!is_beta_chart &&
                markers_array.map(marker => {
                    const Marker = AllMarkers[marker.type as keyof typeof AllMarkers];
                    return (
                        <Marker
                            currency={currency}
                            granularity={granularity}
                            is_dark_theme={is_dark_mode_on}
                            {...marker}
                            key={marker.key}
                        />
                    );
                })}
            {is_accumulator && (
                <AccumulatorsChartElements
                    all_positions={all_positions}
                    current_spot={current_spot}
                    current_spot_time={current_spot_time}
                    has_crossed_accu_barriers={has_crossed_accu_barriers}
                    is_beta_chart={is_beta_chart}
                    is_mobile={is_mobile}
                    should_show_profit_text={!!accumulator_contract_barriers_data.accumulators_high_barrier}
                    symbol={symbol}
                />
            )}
        </SmartChartSwitcher>
    );
});
export default TradeChart;
