import React                 from 'react';
import ChartLoader           from 'App/Components/Elements/chart-loader.jsx';
import { connect }           from 'Stores/connect';
import PositionsDrawer       from 'App/Components/Elements/PositionsDrawer';
import MarketIsClosedOverlay from 'App/Components/Elements/market-is-closed-overlay.jsx';
import Digits                from 'Modules/Contract/Components/Digits';
import Test                  from './test.jsx';
import TopWidgets            from '../../SmartChart/Components/top-widgets.jsx';
import FormLayout            from '../Components/Form/form-layout.jsx';
import { symbolChange }      from '../../SmartChart/Helpers/symbol';
import AllMarkers            from '../../SmartChart/Components/all-markers.jsx';

class Trade extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const { NotificationMessages } = this.props;
        const form_wrapper_class = this.props.is_mobile ? 'mobile-wrapper' : 'sidebar__container desktop-only';
        const is_trade_enabled = (this.props.form_components.length > 0) && this.props.is_trade_enabled;
        return (
            <div id='trade_container' className='trade-container'>
                <PositionsDrawer />
                <div className='chart-container'>
                    <NotificationMessages />
                    <React.Suspense
                        fallback={
                            <ChartLoader
                                is_dark={this.props.is_dark_theme}
                                is_visible={!this.props.symbol}
                            />
                        }
                    >
                        <ChartLoader is_visible={this.props.is_chart_loading} />
                        <ChartTrade />
                    </React.Suspense>

                    {/* Remove Test component for debugging below for production release */}
                    <Test />
                </div>
                <div className={form_wrapper_class}>
                    { this.props.is_market_closed && <MarketIsClosedOverlay />}
                    <FormLayout
                        is_dark_theme={this.props.is_dark_theme}
                        is_market_closed={this.props.is_market_closed}
                        is_mobile={this.props.is_mobile}
                        is_trade_enabled={is_trade_enabled}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    ({ modules, ui }) => ({
        form_components     : modules.trade.form_components,
        is_chart_loading    : modules.trade.is_chart_loading,
        is_market_closed    : modules.trade.is_market_closed,
        is_trade_enabled    : modules.trade.is_trade_enabled,
        onMount             : modules.trade.onMount,
        onUnmount           : modules.trade.onUnmount,
        purchase_info       : modules.trade.purchase_info,
        is_dark_theme       : ui.is_dark_mode_on,
        is_mobile           : ui.is_mobile,
        NotificationMessages: ui.notification_messages_ui,
    })
)(Trade);

// CHART (ChartTrade)--------------------------------------------------------

/* eslint-disable */
import ControlWidgets          from '../../SmartChart/Components/control-widgets.jsx';
import { SmartChart } from 'Modules/SmartChart';

// --- BottomWidgets for chart
// TODO: fix bottom widgets jumps
const BottomDigits = ({
    is_digit_contract,
    contract_info,
    digits,
    digits_info,
    display_status,
    is_ended,
    tick,
    underlying,
}) => (
    <div className='bottom-widgets'>
        <Digits
            tick={tick}
            digits_array={digits}
            is_trade_page
            contract_info={contract_info}
            digits_info={digits_info}
            display_status={display_status}
            is_digit_contract={is_digit_contract}
            is_ended={is_ended}
            underlying={underlying}
        />
    </div>
);

const ChartBottomWidgets = connect(
    ({ modules }) => ({
        contract_info    : modules.contract_trade.last_contract.contract_info || { },
        digits_info      : modules.contract_trade.last_contract.digits_info || { },
        display_status   : modules.contract_trade.last_contract.display_status,
        is_digit_contract: modules.contract_trade.last_contract.is_digit_contract,
        is_ended         : modules.contract_trade.last_contract.is_ended,
        underlying       : modules.trade.symbol,
    })
)(BottomDigits);

// ---- InfoBox for chart
const LazyTopWidgets = ({ onSymbolChange }) => (
    <TopWidgets
        InfoBox={null}
        is_title_enabled={true}
        onSymbolChange={symbolChange(onSymbolChange)}
    />
);

const ChartTopWidgets = connect(
    ({ modules }) => ({
        onSymbolChange: modules.trade.onChange,
    })
)(LazyTopWidgets);

// ChartMarkers --------------------------
const Markers = ({
    markers_array,
    is_dark_theme,
    granularity,
    currency,
}) => (
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
    })
);
const ChartMarkers = connect(
    ({ modules, ui, client }) => ({
        markers_array    : modules.contract_trade.markers_array,
        is_digit_contract: modules.contract_trade.is_digit_contract,
        granularity      : modules.contract_trade.granularity,
        is_dark_theme    : ui.is_dark_mode_on,
        currency         : client.currency,
    })
)(Markers);

class ChartTradeClass extends React.Component {

    chartControlsWidgets = () => (
        <ControlWidgets
            updateChartType={this.props.updateChartType}
            updateGranularity={this.props.updateGranularity}
        />
    );

    bottomWidgets = ({ digits, tick }) => (
        <ChartBottomWidgets digits={digits} tick={tick} />
    );

    componentDidUpdate(prevProps) {
        if (prevProps.should_refresh) this.props.resetRefresh();
    }

    render() {
        const {
            show_digits_stats,
            main_barrier,
            should_refresh,
        } = this.props;

        const barriers = main_barrier ? [main_barrier] : [];
        // smartcharts only way to refresh active-symbols is to reset the connection.
        // const is_socket_opened = this.props.is_socket_opened && !should_refresh;

        return (
            <SmartChart
                barriers={barriers}
                bottomWidgets={ show_digits_stats ? this.bottomWidgets : null}
                showLastDigitStats={show_digits_stats}
                chartControlsWidgets={this.chartControlsWidgets}
                chartStatusListener={(v) => this.props.setChartStatus(!v)}
                chartType={this.props.chart_type}
                id='trade'
                isMobile={this.props.is_mobile}
                granularity={this.props.granularity}
                requestAPI={this.props.wsSendRequest}
                requestForget={this.props.wsForget}
                requestForgetStream={this.props.wsForgetStream}
                requestSubscribe={this.props.wsSubscribe}
                settings={this.props.settings}
                symbol={this.props.symbol}
                topWidgets={ChartTopWidgets}
                isConnectionOpened={this.props.is_socket_opened}
                clearChart={false}
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

const ChartTrade = connect(
    ({ modules, ui, common }) => ({
        is_mobile        : ui.is_mobile,
        is_socket_opened : common.is_socket_opened,
        updateChartType  : modules.contract_trade.updateChartType,
        updateGranularity: modules.contract_trade.updateGranularity,
        granularity      : modules.contract_trade.granularity,
        chart_type       : modules.contract_trade.chart_type,
        settings         : {
            assetInformation            : false, // ui.is_chart_asset_info_visible,
            countdown                   : ui.is_chart_countdown_visible,
            isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
            lang                        : common.current_language,
            position                    : ui.is_chart_layout_default ? 'bottom' : 'left',
            theme                       : ui.is_dark_mode_on ? 'dark' : 'light',
        },
        last_contract: {
            is_digit_contract: modules.contract_trade.last_contract.is_digit_contract,
            is_ended         : modules.contract_trade.last_contract.is_ended,
        },
        main_barrier     : modules.trade.main_barrier_flattened,
        show_digits_stats: modules.trade.show_digits_stats,
        contract_type    : modules.trade.contract_type,
        symbol           : modules.trade.symbol,
        exportLayout     : modules.trade.exportLayout,
        setChartStatus   : modules.trade.setChartStatus,
        chart_layout     : modules.trade.chart_layout,
        wsForget         : modules.trade.wsForget,
        wsForgetStream   : modules.trade.wsForgetStream,
        wsSendRequest    : modules.trade.wsSendRequest,
        wsSubscribe      : modules.trade.wsSubscribe,
        should_refresh   : modules.trade.should_refresh_active_symbols,
        resetRefresh     : modules.trade.resetRefresh,
    })
)(ChartTradeClass);
