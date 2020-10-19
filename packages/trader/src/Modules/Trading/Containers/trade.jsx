import React from 'react';
import { DesktopWrapper, Div100vhContainer, MobileWrapper, SwipeableWrapper } from '@deriv/components';
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

class Trade extends React.Component {
    state = {
        digits: [],
        tick: {},
        try_synthetic_indices: false,
    };

    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    componentDidUpdate(prevProps) {
        if (isMobile() && prevProps.symbol !== this.props.symbol) {
            this.setState({ digits: [] });
        }
        if (prevProps.symbol !== this.props.symbol) {
            this.setState({ try_synthetic_indices: false });
        }
    }

    bottomWidgets = ({ digits, tick }) => {
        return (
            <BottomWidgetsMobile
                digits={digits}
                tick={tick}
                setTick={t => this.setState({ tick: t })}
                setDigits={d => this.setState({ digits: d })}
            />
        );
    };

    onChangeSwipeableIndex = index => {
        if (index === 0) {
            this.props.setMobileDigitView(true);
        } else {
            this.props.setMobileDigitView(false);
        }
        this.setState({
            is_digits_widget_active: index === 0,
        });
    };

    onTrySyntheticIndicesClick = () => {
        this.setState(
            {
                try_synthetic_indices: true,
            },
            () => {
                this.setState({
                    try_synthetic_indices: false,
                });
            }
        );
    };

    render() {
        const { NotificationMessages } = this.props;
        const form_wrapper_class = isMobile() ? 'mobile-wrapper' : 'sidebar__container desktop-only';
        const is_trade_enabled = this.props.form_components.length > 0 && this.props.is_trade_enabled;
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
                                is_dark={this.props.is_dark_theme}
                                is_visible={!this.props.symbol || this.props.is_chart_loading}
                            />
                        }
                    >
                        <DesktopWrapper>
                            <div className='chart-container__wrapper'>
                                <ChartLoader is_visible={this.props.is_chart_loading} />
                                <ChartTrade try_synthetic_indices={this.state.try_synthetic_indices} />
                            </div>
                        </DesktopWrapper>
                        <MobileWrapper>
                            <ChartLoader
                                is_visible={
                                    this.props.is_chart_loading ||
                                    (isDigitTradeType(this.props.contract_type) && !this.state.digits[0])
                                }
                            />
                            <SwipeableWrapper
                                onChange={this.onChangeSwipeableIndex}
                                is_disabled={
                                    !this.props.show_digits_stats || !is_trade_enabled || this.props.is_chart_loading
                                }
                            >
                                {this.props.show_digits_stats && (
                                    <DigitsWidget digits={this.state.digits} tick={this.state.tick} />
                                )}
                                <ChartTrade
                                    bottomWidgets={this.props.show_digits_stats ? this.bottomWidgets : undefined}
                                    is_digits_widget_active={
                                        this.props.show_digits_stats ? this.state.is_digits_widget_active : undefined
                                    }
                                    try_synthetic_indices={this.state.try_synthetic_indices}
                                />
                            </SwipeableWrapper>
                        </MobileWrapper>
                    </React.Suspense>

                    {/* Remove Test component for debugging below for production release */}
                    <Test />
                </Div100vhContainer>
                <div className={form_wrapper_class}>
                    {this.props.is_market_closed && <MarketIsClosedOverlay onClick={this.onTrySyntheticIndicesClick} />}
                    <FormLayout
                        is_market_closed={this.props.is_market_closed}
                        is_trade_enabled={is_trade_enabled && this.props.network_status.class === 'online'}
                    />
                </div>
            </div>
        );
    }
}

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

class ChartTradeClass extends React.Component {
    state = {
        active_markets: [],
        active_category: null,
    };
    bottomWidgets = ({ digits, tick }) => <ChartBottomWidgets digits={digits} tick={tick} />;
    topWidgets = ({ ...props }) => {
        const { is_digits_widget_active, try_synthetic_indices } = this.props;
        return (
            <ChartTopWidgets
                active_category={try_synthetic_indices ? 'synthetic_index' : null}
                open={!!try_synthetic_indices}
                charts_ref={this.charts_ref}
                is_digits_widget_active={is_digits_widget_active}
                {...props}
            />
        );
    };

    componentDidMount() {
        this.setActiveMarkets();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.should_refresh) this.props.resetRefresh();
        if (this.props.active_symbols !== prevProps.active_symbols) this.setActiveMarkets();
    }

    setActiveMarkets() {
        const { active_symbols } = this.props;
        const synthetic_index = 'synthetic_index';

        const has_synthetic_index = !!active_symbols.find(s => s.market === synthetic_index);
        const active_markets = active_symbols
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
        this.setState({ active_markets });
    }

    render() {
        const { show_digits_stats, main_barrier, should_refresh, extra_barriers = [], symbol } = this.props;
        const { active_markets } = this.state;

        const barriers = main_barrier ? [main_barrier, ...extra_barriers] : extra_barriers;

        // max ticks to display for mobile view for tick chart
        const max_ticks = this.props.granularity === 0 ? 8 : 24;

        if (!symbol || active_markets.length === 0) return null;
        return (
            <SmartChart
                ref={ref => (this.charts_ref = ref)}
                barriers={barriers}
                bottomWidgets={show_digits_stats && isDesktop() ? this.bottomWidgets : this.props.bottomWidgets}
                crosshair={isMobile() ? 0 : undefined}
                crosshairTooltipLeftAllow={560}
                showLastDigitStats={isDesktop() ? show_digits_stats : false}
                chartControlsWidgets={null}
                chartStatusListener={v => this.props.setChartStatus(!v)}
                chartType={this.props.chart_type}
                enabledNavigationWidget={isDesktop()}
                enabledChartFooter={false}
                id='trade'
                isMobile={isMobile()}
                maxTick={isMobile() ? max_ticks : undefined}
                granularity={this.props.granularity}
                requestAPI={this.props.wsSendRequest}
                requestForget={this.props.wsForget}
                requestForgetStream={this.props.wsForgetStream}
                requestSubscribe={this.props.wsSubscribe}
                settings={this.props.settings}
                symbol={this.props.symbol}
                topWidgets={this.props.is_trade_enabled ? this.topWidgets : null}
                isConnectionOpened={this.props.is_socket_opened}
                clearChart={false}
                toolbarWidget={ChartToolbarWidgets}
                importedLayout={this.props.chart_layout}
                onExportLayout={this.props.exportLayout}
                shouldFetchTradingTimes={!this.props.end_epoch}
                refreshActiveSymbols={should_refresh}
                hasAlternativeSource={this.props.has_alternative_source}
                refToAddTick={this.props.refToAddTick}
                activeSymbols={active_markets}
                yAxisMargin={{
                    top: isMobile() ? 76 : 106,
                }}
            >
                <ChartMarkers />
            </SmartChart>
        );
    }
}

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
