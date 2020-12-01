import React from 'react';
import {
    DesktopWrapper,
    Div100vhContainer,
    MobileWrapper,
    SwipeableWrapper,
    usePreviousState,
} from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import ChartLoader from 'App/Components/Elements/chart-loader.jsx';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import { connect } from 'Stores/connect';
import PositionsDrawer from 'App/Components/Elements/PositionsDrawer';
import MarketIsClosedOverlay from 'App/Components/Elements/market-is-closed-overlay.jsx';
import Test from './test.jsx';
import { ChartBottomWidgets, ChartToolbarWidgets, ChartTopWidgets, DigitsWidget } from './chart-widgets.jsx';
import FormLayout from '../Components/Form/form-layout.jsx';
import AllMarkers from '../../SmartChart/Components/all-markers.jsx';

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

const Trade = props => {
    const [digits, setDigits] = React.useState([]);
    const [tick, setTick] = React.useState({});
    const [try_synthetic_indices, setTrySyntheticIndices] = React.useState(false);
    const [is_digits_widget_active, setIsDigitsWidgetActive] = React.useState(false);

    React.useEffect(() => {
        props.onMount();
        return () => props.onUnmount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (isMobile()) {
            setDigits([]);
        }
        setTrySyntheticIndices(false);
    }, [props.symbol, setDigits, setTrySyntheticIndices]);

    const bottomWidgets = ({ digits: d, tick: t }) => {
        return <BottomWidgetsMobile digits={d} tick={t} setTick={setTick} setDigits={setDigits} />;
    };

    const onChangeSwipeableIndex = index => {
        if (index === 0) {
            props.setMobileDigitView(true);
        } else {
            props.setMobileDigitView(false);
        }
        setIsDigitsWidgetActive(index === 0);
    };

    const onTrySyntheticIndicesClick = () => {
        setTrySyntheticIndices(true);
        setTimeout(() => setTrySyntheticIndices(false));
    };

    const { NotificationMessages } = props;
    const form_wrapper_class = isMobile() ? 'mobile-wrapper' : 'sidebar__container desktop-only';
    const is_trade_enabled = props.form_components.length > 0 && props.is_trade_enabled;

    return (
        <div id='trade_container' className='trade-container'>
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
                height_offset='259px'
            >
                <NotificationMessages />
                <React.Suspense
                    fallback={
                        <ChartLoader
                            is_dark={props.is_dark_theme}
                            is_visible={!props.symbol || props.is_chart_loading}
                        />
                    }
                >
                    <DesktopWrapper>
                        <div className='chart-container__wrapper'>
                            <ChartLoader is_visible={props.is_chart_loading} />
                            <ChartTrade try_synthetic_indices={try_synthetic_indices} />
                        </div>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <ChartLoader
                            is_visible={props.is_chart_loading || (isDigitTradeType(props.contract_type) && !digits[0])}
                        />
                        <SwipeableWrapper
                            onChange={onChangeSwipeableIndex}
                            is_disabled={!props.show_digits_stats || !is_trade_enabled || props.is_chart_loading}
                        >
                            {props.show_digits_stats && <DigitsWidget digits={digits} tick={tick} />}
                            <ChartTrade
                                bottomWidgets={props.show_digits_stats ? bottomWidgets : undefined}
                                is_digits_widget_active={props.show_digits_stats ? is_digits_widget_active : undefined}
                                try_synthetic_indices={try_synthetic_indices}
                            />
                        </SwipeableWrapper>
                    </MobileWrapper>
                </React.Suspense>

                {/* Remove Test component for debugging below for production release */}
                <Test />
            </Div100vhContainer>
            <div className={form_wrapper_class}>
                {props.is_market_closed && <MarketIsClosedOverlay onClick={onTrySyntheticIndicesClick} />}
                <FormLayout
                    is_market_closed={props.is_market_closed}
                    is_trade_enabled={is_trade_enabled && props.network_status.class === 'online'}
                />
            </div>
        </div>
    );
};

export default connect(({ common, modules, ui }) => ({
    network_status: common.network_status,
    contract_type: modules.trade.contract_type,
    form_components: modules.trade.form_components,
    is_chart_loading: modules.trade.is_chart_loading,
    is_market_closed: modules.trade.is_market_closed,
    show_digits_stats: modules.trade.show_digits_stats,
    is_trade_enabled: modules.trade.is_trade_enabled,
    setMobileDigitView: modules.trade.setMobileDigitView,
    symbol: modules.trade.symbol,
    onMount: modules.trade.onMount,
    onUnmount: modules.trade.onUnmount,
    purchase_info: modules.trade.purchase_info,
    NotificationMessages: ui.notification_messages_ui,
}))(Trade);

// CHART (ChartTrade)--------------------------------------------------------

/* eslint-disable */
import { SmartChart } from 'Modules/SmartChart';

// ChartMarkers --------------------------
const Markers = ({ markers_array, is_dark_theme, granularity, currency, config }) =>
    markers_array.map(marker => {
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

const ChartMarkers = connect(({ modules, ui, client }) => ({
    markers_array: modules.contract_trade.markers_array,
    is_digit_contract: modules.contract_trade.is_digit_contract,
    granularity: modules.contract_trade.granularity,
    is_dark_theme: ui.is_dark_mode_on,
    currency: client.currency,
}))(Markers);

const ChartTradeClass = props => {
    const charts_ref = React.useRef();
    const prev_should_refresh = usePreviousState(props.should_refresh);
    if (prev_should_refresh) props.resetRefresh();

    const { is_digits_widget_active, try_synthetic_indices } = props;

    const bottomWidgets = React.useCallback(
        ({ digits, tick }) => <ChartBottomWidgets digits={digits} tick={tick} />,
        []
    );
    const topWidgets = React.useCallback(
        ({ ...params }) => {
            return (
                <ChartTopWidgets
                    active_category={try_synthetic_indices ? 'synthetic_index' : null}
                    open={!!try_synthetic_indices}
                    charts_ref={charts_ref}
                    is_digits_widget_active={is_digits_widget_active}
                    {...params}
                />
            );
        },
        [is_digits_widget_active, try_synthetic_indices]
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

    const { show_digits_stats, main_barrier, should_refresh, extra_barriers = [], symbol, active_symbols } = props;

    const barriers = main_barrier ? [main_barrier, ...extra_barriers] : extra_barriers;

    // max ticks to display for mobile view for tick chart
    const max_ticks = props.granularity === 0 ? 8 : 24;

    if (!symbol || active_symbols.length === 0) return null;

    return (
        <SmartChart
            ref={charts_ref}
            barriers={barriers}
            bottomWidgets={show_digits_stats && isDesktop() ? bottomWidgets : props.bottomWidgets}
            crosshair={isMobile() ? 0 : undefined}
            crosshairTooltipLeftAllow={560}
            showLastDigitStats={isDesktop() ? show_digits_stats : false}
            chartControlsWidgets={null}
            chartStatusListener={v => props.setChartStatus(!v)}
            chartType={props.chart_type}
            enabledNavigationWidget={isDesktop()}
            enabledChartFooter={false}
            id='trade'
            isMobile={isMobile()}
            maxTick={isMobile() ? max_ticks : undefined}
            granularity={props.granularity}
            requestAPI={props.wsSendRequest}
            requestForget={props.wsForget}
            requestForgetStream={props.wsForgetStream}
            requestSubscribe={props.wsSubscribe}
            settings={props.settings}
            symbol={props.symbol}
            topWidgets={props.is_trade_enabled ? topWidgets : null}
            isConnectionOpened={props.is_socket_opened}
            clearChart={false}
            toolbarWidget={ChartToolbarWidgets}
            importedLayout={props.chart_layout}
            onExportLayout={props.exportLayout}
            shouldFetchTradingTimes={!props.end_epoch}
            refreshActiveSymbols={should_refresh}
            hasAlternativeSource={props.has_alternative_source}
            refToAddTick={props.refToAddTick}
            getMarketsOrder={getMarketsOrder}
            yAxisMargin={{
                top: isMobile() ? 76 : 106,
            }}
        >
            <ChartMarkers />
        </SmartChart>
    );
};

const ChartTrade = connect(({ modules, ui, common }) => ({
    is_socket_opened: common.is_socket_opened,
    granularity: modules.contract_trade.granularity,
    chart_type: modules.contract_trade.chart_type,
    settings: {
        assetInformation: false, // ui.is_chart_asset_info_visible,
        countdown: ui.is_chart_countdown_visible,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    },
    last_contract: {
        is_digit_contract: modules.contract_trade.last_contract.is_digit_contract,
        is_ended: modules.contract_trade.last_contract.is_ended,
    },
    is_trade_enabled: modules.trade.is_trade_enabled,
    main_barrier: modules.trade.main_barrier_flattened,
    extra_barriers: modules.trade.barriers_flattened,
    show_digits_stats: modules.trade.show_digits_stats,
    contract_type: modules.trade.contract_type,
    symbol: modules.trade.symbol,
    exportLayout: modules.trade.exportLayout,
    setChartStatus: modules.trade.setChartStatus,
    chart_layout: modules.trade.chart_layout,
    wsForget: modules.trade.wsForget,
    wsForgetStream: modules.trade.wsForgetStream,
    wsSendRequest: modules.trade.wsSendRequest,
    wsSubscribe: modules.trade.wsSubscribe,
    active_symbols: modules.trade.active_symbols,
    should_refresh: modules.trade.should_refresh_active_symbols,
    resetRefresh: modules.trade.resetRefresh,
    has_alternative_source: modules.trade.has_alternative_source,
    refToAddTick: modules.trade.refToAddTick,
}))(ChartTradeClass);
