import React from 'react';
import { DesktopWrapper, Div100vhContainer, MobileWrapper, SwipeableWrapper } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
import ChartLoader from 'App/Components/Elements/chart-loader.jsx';
import { connect } from 'Stores/connect';
import PositionsDrawer from 'App/Components/Elements/PositionsDrawer';
import MarketIsClosedOverlay from 'App/Components/Elements/market-is-closed-overlay.jsx';
import Test from './test.jsx';
import {
    ChartBottomWidgets,
    ChartControlWidgets,
    ChartToolbarWidgets,
    ChartTopWidgets,
    DigitsWidget,
} from './chart-widgets.jsx';
import FormLayout from '../Components/Form/form-layout.jsx';
import AllMarkers from '../../SmartChart/Components/all-markers.jsx';

class Trade extends React.Component {
    state = {
        digits: [],
        tick: {},
    };

    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    bottomWidgets = ({ digits, tick }) => {
        this.setState({
            digits,
            tick,
        });

        return null; // render nothing for bottom widgets on chart in mobile
    };

    onChangeSwipeableIndex = index => {
        this.setState({
            is_digits_widget_active: index === 0,
        });
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
                    height_offset='249px'
                >
                    <NotificationMessages />
                    <React.Suspense
                        fallback={<ChartLoader is_dark={this.props.is_dark_theme} is_visible={!this.props.symbol} />}
                    >
                        <DesktopWrapper>
                            <ChartLoader is_visible={this.props.is_chart_loading} />
                            <ChartTrade />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <ChartLoader is_visible={this.props.is_chart_loading || !is_trade_enabled} />
                            {this.props.show_digits_stats && is_trade_enabled ? (
                                <SwipeableWrapper onChange={this.onChangeSwipeableIndex}>
                                    <DigitsWidget digits={this.state.digits} tick={this.state.tick} />
                                    <ChartTrade
                                        bottomWidgets={this.bottomWidgets}
                                        is_digits_widget_active={this.state.is_digits_widget_active}
                                    />
                                </SwipeableWrapper>
                            ) : (
                                <ChartTrade />
                            )}
                        </MobileWrapper>
                    </React.Suspense>

                    {/* Remove Test component for debugging below for production release */}
                    <Test />
                </Div100vhContainer>
                <div className={form_wrapper_class}>
                    {this.props.is_market_closed && <MarketIsClosedOverlay />}
                    <FormLayout is_market_closed={this.props.is_market_closed} is_trade_enabled={is_trade_enabled} />
                </div>
            </div>
        );
    }
}

export default connect(({ modules, ui }) => ({
    form_components: modules.trade.form_components,
    is_chart_loading: modules.trade.is_chart_loading,
    is_market_closed: modules.trade.is_market_closed,
    show_digits_stats: modules.trade.show_digits_stats,
    is_trade_enabled: modules.trade.is_trade_enabled,
    onMount: modules.trade.onMount,
    onUnmount: modules.trade.onUnmount,
    purchase_info: modules.trade.purchase_info,
    NotificationMessages: ui.notification_messages_ui,
}))(Trade);

// CHART (ChartTrade)--------------------------------------------------------

/* eslint-disable */
import { SmartChart } from 'Modules/SmartChart';

// ChartMarkers --------------------------
const Markers = ({ markers_array, is_dark_theme, granularity, currency }) =>
    markers_array.map(marker => {
        const Marker = AllMarkers[marker.type];
        return (
            <Marker
                key={marker.key}
                is_dark_theme={is_dark_theme}
                granularity={granularity}
                currency={currency}
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
    bottomWidgets = ({ digits, tick }) => <ChartBottomWidgets digits={digits} tick={tick} />;
    topWidgets = ({ ...props }) => {
        const { is_digits_widget_active } = this.props;
        return (
            <ChartTopWidgets
                charts_ref={this.charts_ref}
                is_digits_widget_active={is_digits_widget_active}
                {...props}
            />
        );
    };

    componentDidMount() {
        performance.mark('smart-charts-mounted');
    }

    componentDidUpdate(prevProps) {
        if (prevProps.should_refresh) this.props.resetRefresh();
    }

    render() {
        const { show_digits_stats, main_barrier, should_refresh } = this.props;

        const barriers = main_barrier ? [main_barrier] : [];
        // smartcharts only way to refresh active-symbols is to reset the connection.
        // const is_socket_opened = this.props.is_socket_opened && !should_refresh;

        // max ticks to display for mobile view for tick chart
        const max_ticks = this.props.granularity === 0 ? 8 : 24;

        return (
            <SmartChart
                ref={ref => (this.charts_ref = ref)}
                barriers={barriers}
                bottomWidgets={show_digits_stats && isDesktop() ? this.bottomWidgets : this.props.bottomWidgets}
                crosshairState={isMobile() ? 0 : undefined}
                showLastDigitStats={isDesktop() ? show_digits_stats : false}
                chartControlsWidgets={isDesktop() ? ChartControlWidgets : null}
                chartStatusListener={v => this.props.setChartStatus(!v)}
                chartType={this.props.chart_type}
                enabledNavigationWidget={isDesktop()}
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
                toolbarWidget={isMobile() ? ChartToolbarWidgets : null}
                importedLayout={this.props.chart_layout}
                onExportLayout={this.props.exportLayout}
                shouldFetchTradingTimes={!this.props.end_epoch}
                refreshActiveSymbols={should_refresh}
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
        lang: common.current_language,
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    },
    last_contract: {
        is_digit_contract: modules.contract_trade.last_contract.is_digit_contract,
        is_ended: modules.contract_trade.last_contract.is_ended,
    },
    is_trade_enabled: modules.trade.is_trade_enabled,
    main_barrier: modules.trade.main_barrier_flattened,
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
    should_refresh: modules.trade.should_refresh_active_symbols,
    resetRefresh: modules.trade.resetRefresh,
}))(ChartTradeClass);
