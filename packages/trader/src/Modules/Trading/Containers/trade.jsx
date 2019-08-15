import React                 from 'react';
import ChartLoader           from 'App/Components/Elements/chart-loader.jsx';
import UILoader              from 'App/Components/Elements/ui-loader.jsx';
import { connect }           from 'Stores/connect';
import PositionsDrawer       from 'App/Components/Elements/PositionsDrawer';
import MarketIsClosedOverlay from 'App/Components/Elements/market-is-closed-overlay.jsx';
import Lazy                  from 'App/Containers/Lazy';
import Test                  from './test.jsx';
import TopWidgets            from '../../SmartChart/Components/top-widgets.jsx';
import FormLayout            from '../Components/Form/form-layout.jsx';
import { symbolChange }      from '../../SmartChart/Helpers/symbol';
import { isDigitTradeType }  from '../Helpers/digits';

// const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));

// function log_diff(path, a, b, n) {
//     if (n <= 0) return;
//     if (!a || !b) {
//         if(a != b) console.log(path + " -> ", a, b);
//         return;
//     }
//     Object.keys(a).forEach(key => {
//         if (a[key] !== b[key]) {
//             console.warn(path + "." + key + ' -> ', a[key], b[key]);
//         } else if (typeof a[key] === 'object') {
//             log_diff(path + "." + key, a[key], b[key], n - 1);
//         }
//     });
// }

class Trade extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        if (this.props.is_contract_mode) {
            this.props.onCloseContract();
        }
        this.props.onUnmount();
    }

    render() {
        const form_wrapper_class           = this.props.is_mobile ? 'mobile-wrapper' : 'sidebar__container desktop-only';
        return (
            <div id='trade_container' className='trade-container'>
                <PositionsDrawer />
                <div className='chart-container'>
                    <Lazy
                        ctor={() => import(/* webpackChunkName: "notification-messages" */'App/Containers/notification-messages.jsx')}
                        has_progress={false}
                        should_load={true}
                    />
                    { this.props.symbol &&
                        <React.Suspense fallback={<UILoader />} >
                            <ChartLoader is_visible={this.props.is_chart_loading} />
                            <ChartTrade
                                chart_id={this.props.chart_id}
                                end_epoch={this.props.end_epoch}
                                is_trade_page
                                is_static_chart={this.props.is_static_chart}
                                scroll_to_epoch={this.props.scroll_to_epoch}
                                start_epoch={this.props.start_epoch}
                                symbol={this.props.symbol}
                            />
                        </React.Suspense>
                    }
                    {/* Remove Test component for debugging below for production release */}
                    <Test />
                </div>
                <div
                    className={form_wrapper_class}
                    onClick={this.props.is_contract_mode ? () => {
                        this.props.onCloseContract();
                    } : null}
                    style={{ cursor: this.props.is_contract_mode ? 'pointer' : 'initial' }}
                >
                    { this.props.is_market_closed && <MarketIsClosedOverlay />}
                    <FormLayout
                        is_contract_visible={this.props.is_contract_mode}
                        is_market_closed={this.props.is_market_closed}
                        is_mobile={this.props.is_mobile}
                        is_trade_enabled={this.props.is_trade_enabled}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    ({ modules, ui }) => ({
        onCloseContract: modules.contract_trade.onCloseContract,

        chart_id        : modules.smart_chart.chart_id,
        scroll_to_epoch : modules.smart_chart.scroll_to_left_epoch,
        end_epoch       : modules.smart_chart.end_epoch,
        start_epoch     : modules.smart_chart.start_epoch,
        is_contract_mode: modules.smart_chart.is_contract_mode,
        is_static_chart : modules.smart_chart.is_static_chart,

        is_chart_loading: modules.trade.is_chart_loading,
        is_market_closed: modules.trade.is_market_closed,
        is_trade_enabled: modules.trade.is_trade_enabled,
        onMount         : modules.trade.onMount,
        onUnmount       : modules.trade.onUnmount,
        purchase_info   : modules.trade.purchase_info,
        symbol          : modules.trade.symbol,

        is_mobile: ui.is_mobile,
    })
)(Trade);

// CHART -----------------------------------------------------------------

// --- BottomWidgets for chart
// TODO: fix bottom widgets jumps
const LazyBottomDigits = ({
    is_digit_contract,
    contract_info,
    digits_info,
    display_status,
    is_ended,
}) => (
    <div className='bottom-widgets'>
        <Lazy
            ctor={() => import(/* webpackChunkName: "digits", webpackPrefetch: true */'Modules/Contract/Components/Digits')}
            should_load={is_digit_contract}
            is_trade_page
            contract_info={contract_info}
            digits_info={digits_info}
            display_status={display_status}
            is_digit_contract={is_digit_contract}
            is_ended={is_ended}
        />
    </div>
);

const ChartBottomWidgets = connect(
    ({ modules }) => ({
        is_digit_contract: modules.contract_trade.is_digit_contract,
        contract_info    : modules.contract_trade.contract_info,
        digits_info      : modules.contract_trade.digits_info,
        display_status   : modules.contract_trade.display_status,
        is_ended         : modules.contract_trade.is_ended,
    })
)(LazyBottomDigits);

// ---- InfoBox for chart
const LazyTopWidgets = ({
    contract_info,
    error_message,
    is_contract_mode,
    removeError,
    onCloseContract,
    is_title_enabled,
    onSymbolChange,
}) => (
    <TopWidgets
        InfoBox={
            <Lazy
                ctor={() => import(/* webpackChunkName: "info-box", webpackPrefetch: true */'Modules/Contract/Components/InfoBox')}
                should_load={true}
                has_progress={false}
                is_trade_page
                contract_info={contract_info}
                error_message={error_message}
                is_contract_mode={is_contract_mode}
                removeError={removeError}
                onClose={onCloseContract}
            />

        }
        is_title_enabled={is_title_enabled}
        onSymbolChange={symbolChange(onSymbolChange)}
    />
);

const ChartTopWidgets = connect(
    ({ modules }) => ({
        contract_info   : modules.contract_trade.contract_info,
        error_message   : modules.contract_trade.error_message,
        is_contract_mode: modules.smart_chart.is_contract_mode,
        removeError     : modules.contract_trade.removeErrorMessage,
        onCloseContract : modules.contract_trade.onCloseContract,
        is_title_enabled: modules.smart_chart.is_title_enabled,
        onSymbolChange  : modules.trade.onChange,
    })
)(LazyTopWidgets);

// ChartMarkers --------------------------
const Markers = ({
    markers_array,
    is_contract_mode,
    is_digit_contract,
}) => (
    markers_array.map(marker => (
        <ChartMarker
            key={marker.react_key}
            marker_config={marker.marker_config}
            marker_content_props={marker.content_config}
            is_bottom_widget_visible={is_contract_mode && is_digit_contract}
        />
    ))
);
const ChartMarkers = connect(
    ({ modules }) => ({
        markers_array    : modules.contract_trade.markers_array,
        is_digit_contract: modules.contract_trade.is_digit_contract,
        is_contract_mode : modules.smart_chart.is_contract_mode,
    })
)(Markers);

/* eslint-disable */
// ChartTrade
import {
    SmartChart,
    setSmartChartsPublicPath } from 'smartcharts-beta';
import { getUrlBase }          from '_common/url';
import ControlWidgets          from '../../SmartChart/Components/control-widgets.jsx';
import ChartMarker             from '../../SmartChart/Components/Markers/marker.jsx';
/* eslint-enable */

setSmartChartsPublicPath(getUrlBase('/js/smartcharts/'));

class ChartTradeClass extends React.Component {
    componentDidMount() { this.props.onMount(); }

    componentWillUnmount() { this.props.onUnmount(); }

    chartControlsWidgets = () => (
        <ControlWidgets
            updateChartType={this.props.updateChartType}
            updateGranularity={this.props.updateGranularity}
        />
    );

    // componentDidUpdate(prevProps) {
    //     log_diff('', this.props, prevProps, 5);
    //     console.warn('---------------------------------------');
    // }

    topWidgets = () => (<ChartTopWidgets />);
    bottomWidgets = () => (<ChartBottomWidgets />);

    render() {
        const should_show_last_digit_stats =
            isDigitTradeType(this.props.contract_type) && !this.props.is_contract_mode;
        const bottomWidgets = should_show_last_digit_stats ? null : ChartBottomWidgets;
        return (
            <SmartChart
                barriers={this.props.barriers_array}
                bottomWidgets={bottomWidgets}
                chartControlsWidgets={this.props.is_contract_mode ? null : this.chartControlsWidgets}
                chartStatusListener={(v) => this.props.setChartStatus(!v)}
                chartType={this.props.chart_type}
                endEpoch={this.props.end_epoch}
                id={this.props.chart_id}
                isMobile={this.props.is_mobile}
                enabledNavigationWidget={this.props.is_contract_mode}
                granularity={this.props.granularity}
                requestAPI={this.props.wsSendRequest}
                requestForget={this.props.wsForget}
                requestForgetStream={this.props.wsForgetStream}
                requestSubscribe={this.props.wsSubscribe}
                settings={this.props.settings}
                showLastDigitStats={should_show_last_digit_stats}
                startEpoch={this.props.start_epoch}
                scrollToEpoch={this.props.scroll_to_epoch}
                symbol={this.props.symbol}
                topWidgets={this.topWidgets}
                isConnectionOpened={this.props.is_socket_opened}
                clearChart={this.props.should_clear_chart}
                importedLayout={this.props.chart_layout}
                onExportLayout={this.props.exportLayout}
                isStaticChart={this.props.is_static_chart}
                shouldFetchTradingTimes={!this.props.end_epoch}
            >
                <ChartMarkers />
            </SmartChart>
        );
    }
}

const ChartTrade = connect(
    ({ modules, ui, common }) => ({
        is_socket_opened: common.is_socket_opened,

        contract_type : modules.trade.contract_type,
        chart_type    : modules.contract_trade.chart_type,
        barriers_array: modules.contract_trade.barriers_array,

        settings: {
            assetInformation            : false, // ui.is_chart_asset_info_visible,
            countdown                   : ui.is_chart_countdown_visible,
            isHighestLowestMarkerEnabled: false, // !this.is_contract_mode,
            lang                        : common.current_language,
            position                    : ui.is_chart_layout_default ? 'bottom' : 'left',
            theme                       : ui.is_dark_mode_on ? 'dark' : 'light',
        },

        exportLayout      : modules.trade.exportLayout,
        setChartStatus    : modules.trade.setChartStatus,
        is_contract_mode  : modules.smart_chart.is_contract_mode,
        is_title_enabled  : modules.smart_chart.is_title_enabled,
        onMount           : modules.smart_chart.onMount,
        onUnmount         : modules.smart_chart.onUnmount,
        should_clear_chart: modules.smart_chart.should_clear_chart,
        chart_layout      : modules.trade.chart_layout,
        updateChartType  : modules.contract_trade.updateChartType,
        updateGranularity: modules.contract_trade.updateGranularity,
        granularity      : modules.contract_trade.granularity,
        is_mobile        : ui.is_mobile,

        wsForget      : modules.trade.wsForget,
        wsForgetStream: modules.trade.wsForgetStream,
        wsSendRequest : modules.trade.wsSendRequest,
        wsSubscribe   : modules.trade.wsSubscribe,
    })
)(ChartTradeClass);
