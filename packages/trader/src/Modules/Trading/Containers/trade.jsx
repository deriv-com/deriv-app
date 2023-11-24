import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, Div100vhContainer, MobileWrapper, SwipeableWrapper } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import ChartLoader from 'App/Components/Elements/chart-loader';
import PositionsDrawer from 'App/Components/Elements/PositionsDrawer';
import MarketIsClosedOverlay from 'App/Components/Elements/market-is-closed-overlay';
import Test from './test.jsx';
import { ChartBottomWidgets, ChartTopWidgets, DigitsWidget } from './chart-widgets';
import FormLayout from '../Components/Form/form-layout';
import AllMarkers from '../../SmartChart/Components/all-markers.jsx';
import AccumulatorsChartElements from '../../SmartChart/Components/Markers/accumulators-chart-elements';
import ToolbarWidgets from '../../SmartChart/Components/toolbar-widgets';
import ToolbarWidgetsBeta from '../../SmartChartBeta/Components/toolbar-widgets.jsx';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

const BottomWidgetsMobile = ({ tick, digits, setTick, setDigits }) => {
    React.useEffect(() => {
        setTick(tick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick]);

    React.useEffect(() => {
        setDigits(digits);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [digits]);

    // render nothing for bottom widgets on chart in mobile
    return null;
};

const Trade = observer(() => {
    const { client, common, ui } = useStore();
    const {
        form_components,
        getFirstOpenMarket,
        has_barrier,
        is_accumulator,
        is_chart_loading,
        is_market_closed,
        is_synthetics_available,
        is_synthetics_trading_market_available,
        is_trade_enabled,
        is_turbos,
        is_vanilla,
        onChange,
        onMount,
        onUnmount,
        prepareTradeStore,
        setContractTypes,
        setIsDigitsWidgetActive,
        setMobileDigitView,
        should_show_active_symbols_loading,
        show_digits_stats,
        symbol,
    } = useTraderStore();
    const {
        notification_messages_ui: NotificationMessages,
        has_only_forward_starting_contracts: is_market_unavailable_visible,
        should_show_multipliers_onboarding,
        is_dark_mode_on: is_dark_theme,
        is_mobile,
    } = ui;
    const { is_eu } = client;
    const { network_status } = common;

    const [digits, setDigits] = React.useState([]);
    const [tick, setTick] = React.useState({});
    const [try_synthetic_indices, setTrySyntheticIndices] = React.useState(false);
    const [try_open_markets, setTryOpenMarkets] = React.useState(false);
    const [category, setCategory] = React.useState(null);
    const [subcategory, setSubcategory] = React.useState(null);
    const [swipe_index, setSwipeIndex] = React.useState(0);
    const charts_ref = React.useRef();

    const open_market = React.useMemo(() => {
        if (try_synthetic_indices) {
            return { category: 'synthetics' };
        } else if (try_open_markets && category) {
            return { category, subcategory };
        }
        return null;
    }, [try_synthetic_indices, try_open_markets, category, subcategory]);

    React.useEffect(() => {
        onMount();
        if (!is_synthetics_available) {
            const setMarket = async () => {
                const markets_to_search = ['forex', 'indices', 'commodities']; // none-synthetic
                const { category: market_cat, subcategory: market_subcat } =
                    (await getFirstOpenMarket(markets_to_search)) ?? {};
                if (market_cat) {
                    setCategory(market_cat);
                    setSubcategory(market_subcat);
                }
            };

            setMarket();
        }
        return () => onUnmount();
    }, [onMount, onUnmount, getFirstOpenMarket, is_synthetics_available]);

    React.useEffect(() => {
        if (is_mobile) {
            setDigits([]);
        }
        setTrySyntheticIndices(false);
        setTryOpenMarkets(false);
    }, [is_mobile, symbol, setDigits, setTrySyntheticIndices, is_synthetics_available]);

    React.useEffect(() => {
        const selectMultipliers = async () => {
            await setContractTypes();

            onChange({ target: { name: 'contract_type', value: 'multiplier' } });
        };
        if (should_show_multipliers_onboarding && !is_chart_loading && (is_synthetics_available || !is_market_closed)) {
            selectMultipliers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [should_show_multipliers_onboarding, is_chart_loading]);

    const bottomWidgets = React.useCallback(({ digits: d, tick: t }) => {
        return <BottomWidgetsMobile digits={d} tick={t} setTick={setTick} setDigits={setDigits} />;
    }, []);

    const onChangeSwipeableIndex = index => {
        setMobileDigitView(index === 0);
        setIsDigitsWidgetActive(index === 0);
        setSwipeIndex(index);
    };

    const onTryOtherMarkets = async () => {
        if (!is_synthetics_available) {
            setTryOpenMarkets(true);
            setTimeout(() => setTryOpenMarkets(false));
        } else {
            setTrySyntheticIndices(true);
            setTimeout(() => setTrySyntheticIndices(false));
        }
    };

    const topWidgets = React.useCallback(
        ({ ...params }) => (
            <ChartTopWidgets
                open_market={open_market}
                open={try_synthetic_indices || try_open_markets}
                charts_ref={charts_ref}
                {...params}
            />
        ),
        [open_market, try_synthetic_indices, try_open_markets]
    );

    const form_wrapper_class = is_mobile ? 'mobile-wrapper' : 'sidebar__container desktop-only';
    const chart_height_offset = React.useMemo(() => {
        if (is_accumulator) return '295px';
        if (is_turbos) return '300px';
        return '259px';
    }, [is_turbos, is_accumulator]);

    return (
        <div
            id='trade_container'
            className={classNames('trade-container', {
                [`trade-container--${is_accumulator ? 'accumulators' : 'turbos'}`]: is_accumulator || is_turbos,
            })}
        >
            <DesktopWrapper>
                <PositionsDrawer />
            </DesktopWrapper>
            {/* Div100vhContainer is workaround for browsers on devices
                    with toolbars covering screen height,
                    using css vh is not returning correct screen height */}
            <Div100vhContainer
                id='chart_container'
                className='chart-container'
                is_disabled={isDesktop()}
                height_offset={chart_height_offset}
            >
                <NotificationMessages />
                <React.Suspense
                    fallback={<ChartLoader is_dark={is_dark_theme} is_visible={!symbol || is_chart_loading} />}
                >
                    <DesktopWrapper>
                        <div className={classNames('chart-container__wrapper', { 'vanilla-trade-chart': is_vanilla })}>
                            <ChartLoader is_visible={is_chart_loading || should_show_active_symbols_loading} />
                            <ChartTrade
                                topWidgets={topWidgets}
                                charts_ref={charts_ref}
                                is_accumulator={is_accumulator}
                            />
                        </div>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <ChartLoader is_visible={is_chart_loading || should_show_active_symbols_loading} />
                        <SwipeableWrapper
                            onChange={onChangeSwipeableIndex}
                            is_disabled={
                                !show_digits_stats ||
                                !is_trade_enabled ||
                                form_components.length === 0 ||
                                is_chart_loading ||
                                should_show_active_symbols_loading
                            }
                            is_swipe_disabled={swipe_index === 1}
                            className={classNames({ 'vanilla-trade-chart': is_vanilla })}
                        >
                            {show_digits_stats && <DigitsWidget digits={digits} tick={tick} />}
                            <ChartTrade
                                topWidgets={topWidgets}
                                charts_ref={charts_ref}
                                bottomWidgets={show_digits_stats ? bottomWidgets : undefined}
                                is_accumulator={is_accumulator}
                                has_barrier={has_barrier}
                            />
                        </SwipeableWrapper>
                    </MobileWrapper>
                </React.Suspense>

                {/* Remove Test component for debugging below for production release */}
                <Test />
            </Div100vhContainer>
            <div className={form_wrapper_class}>
                {is_market_closed && !is_market_unavailable_visible && (
                    <MarketIsClosedOverlay
                        is_eu={is_eu}
                        is_synthetics_trading_market_available={is_synthetics_trading_market_available}
                        {...(is_eu && category)}
                        onClick={onTryOtherMarkets}
                        onMarketOpen={prepareTradeStore}
                        symbol={symbol}
                    />
                )}
                <FormLayout
                    is_market_closed={is_market_closed}
                    is_trade_enabled={
                        is_trade_enabled && form_components.length > 0 && network_status.class === 'online'
                    }
                />
            </div>
        </div>
    );
});

export default Trade;

// CHART (ChartTrade)--------------------------------------------------------

/* eslint-disable */
import SmartChartSwitcher from './smart-chart-switcher.jsx';

const SmartChartWithRef = React.forwardRef((props, ref) => <SmartChartSwitcher innerRef={ref} {...props} />);

// ChartMarkers --------------------------
const ChartMarkers = observer(config => {
    const { ui, client, contract_trade } = useStore();
    const { markers_array, granularity } = contract_trade;
    const { is_dark_mode_on: is_dark_theme } = ui;
    const { currency } = client;
    return markers_array.map(marker => {
        const Marker = AllMarkers[marker.type];
        return (
            <Marker
                key={marker.key}
                is_dark_theme={is_dark_theme}
                granularity={granularity}
                currency={currency}
                config={config}
                {...marker}
            />
        );
    });
});

const ChartTrade = observer(props => {
    const { is_accumulator, has_barrier, end_epoch, topWidgets, charts_ref } = props;
    const { client, ui, common, contract_trade, portfolio } = useStore();
    const {
        accumulator_barriers_data,
        accumulator_contract_barriers_data,
        chart_type,
        granularity,
        markers_array,
        has_crossed_accu_barriers,
        updateGranularity,
        updateChartType,
    } = contract_trade;
    const { all_positions } = portfolio;
    const { is_chart_layout_default, is_chart_countdown_visible, is_dark_mode_on, is_positions_drawer_on, is_mobile } =
        ui;
    const { is_socket_opened, current_language } = common;
    const { currency, is_beta_chart, should_show_eu_content } = client;
    const {
        chartStateChange,
        is_trade_enabled,
        main_barrier_flattened: main_barrier,
        barriers_flattened: extra_barriers,
        show_digits_stats,
        symbol,
        exportLayout,
        setChartStatus,
        chart_layout,
        wsForget,
        wsForgetStream,
        wsSendRequest,
        wsSubscribe,
        active_symbols,
        has_alternative_source,
    } = useTraderStore();

    const settings = {
        assetInformation: false, // ui.is_chart_asset_info_visible,
        countdown: is_chart_countdown_visible,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: current_language.toLowerCase(),
        position: is_chart_layout_default ? 'bottom' : 'left',
        theme: is_dark_mode_on ? 'dark' : 'light',
        ...(is_accumulator ? { whitespace: 190, minimumLeftBars: is_mobile ? 3 : undefined } : {}),
        ...(has_barrier ? { whitespace: 110 } : {}),
    };

    const { current_spot, current_spot_time } = accumulator_barriers_data || {};

    const bottomWidgets = React.useCallback(
        ({ digits, tick }) => (
            <ChartBottomWidgets digits={digits} tick={tick} show_accumulators_stats={is_accumulator} is_trade_page />
        ),
        [is_accumulator]
    );

    const getMarketsOrder = active_symbols => {
        const synthetic_index = 'synthetic_index';

        const has_synthetic_index = !!active_symbols.find(s => s.market === synthetic_index);
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

    if (!symbol || active_symbols.length === 0) return null;

    return (
        <SmartChartWithRef
            ref={charts_ref}
            barriers={barriers}
            contracts_array={markers_array}
            bottomWidgets={(is_accumulator || show_digits_stats) && isDesktop() ? bottomWidgets : props.bottomWidgets}
            crosshair={is_mobile ? 0 : undefined}
            crosshairTooltipLeftAllow={560}
            showLastDigitStats={isDesktop() ? show_digits_stats : false}
            chartControlsWidgets={null}
            chartStatusListener={v => setChartStatus(!v)}
            chartType={chart_type}
            initialData={{
                activeSymbols: JSON.parse(JSON.stringify(active_symbols)),
            }}
            chartData={{
                activeSymbols: JSON.parse(JSON.stringify(active_symbols)),
            }}
            feedCall={{
                activeSymbols: false,
            }}
            enabledNavigationWidget={isDesktop()}
            enabledChartFooter={false}
            id='trade'
            isMobile={is_mobile}
            maxTick={is_mobile ? max_ticks : undefined}
            granularity={show_digits_stats || is_accumulator ? 0 : granularity}
            requestAPI={wsSendRequest}
            requestForget={wsForget}
            requestForgetStream={wsForgetStream}
            requestSubscribe={wsSubscribe}
            settings={settings}
            should_show_eu_content={should_show_eu_content}
            allowTickChartTypeOnly={show_digits_stats || is_accumulator}
            stateChangeListener={chartStateChange}
            symbol={symbol}
            topWidgets={is_trade_enabled ? topWidgets : null}
            isConnectionOpened={is_socket_opened}
            clearChart={false}
            toolbarWidget={() => {
                if (is_beta_chart) {
                    return (
                        <ToolbarWidgetsBeta updateChartType={updateChartType} updateGranularity={updateGranularity} />
                    );
                } else
                    return (
                        <ToolbarWidgets
                            is_mobile={is_mobile}
                            updateChartType={updateChartType}
                            updateGranularity={updateGranularity}
                        />
                    );
            }}
            importedLayout={chart_layout}
            onExportLayout={exportLayout}
            shouldFetchTradingTimes={!end_epoch}
            hasAlternativeSource={has_alternative_source}
            getMarketsOrder={getMarketsOrder}
            should_zoom_out_on_yaxis={is_accumulator}
            yAxisMargin={{
                top: is_mobile ? 76 : 106,
            }}
            isLive={true}
            leftMargin={isDesktop() && is_positions_drawer_on ? 328 : 80}
            is_beta={is_beta_chart}
        >
            {!is_beta_chart && <ChartMarkers />}
            {is_accumulator && (
                <AccumulatorsChartElements
                    all_positions={all_positions}
                    current_spot={current_spot}
                    current_spot_time={current_spot_time}
                    has_crossed_accu_barriers={has_crossed_accu_barriers}
                    should_show_profit_text={!!accumulator_contract_barriers_data.accumulators_high_barrier}
                    symbol={symbol}
                    is_beta_chart={is_beta_chart}
                />
            )}
        </SmartChartWithRef>
    );
});
