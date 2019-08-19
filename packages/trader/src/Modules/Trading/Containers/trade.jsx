
import React                 from 'react';
import ChartLoader           from 'App/Components/Elements/chart-loader.jsx';
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
        this.props.onUnmount();
    }

    render() {
        const form_wrapper_class = this.props.is_mobile ? 'mobile-wrapper' : 'sidebar__container desktop-only';
        return (
            <div id='trade_container' className='trade-container'>
                <PositionsDrawer />
                <div className='chart-container'>
                    <Lazy
                        ctor={() => import(/* webpackChunkName: "notification-messages" */'App/Containers/notification-messages.jsx')}
                        has_progress={false}
                        should_load={true}
                    />

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
                        is_trade_enabled={this.props.is_trade_enabled}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    ({ modules, ui }) => ({
        is_chart_loading: modules.trade.is_chart_loading,
        is_market_closed: modules.trade.is_market_closed,
        is_trade_enabled: modules.trade.is_trade_enabled,
        onMount         : modules.trade.onMount,
        onUnmount       : modules.trade.onUnmount,
        purchase_info   : modules.trade.purchase_info,
        is_dark_theme   : ui.is_dark_mode_on,
        is_mobile       : ui.is_mobile,
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
        is_digit_contract: modules.contract_trade.last_contract.is_digit_contract,
        contract_info    : modules.contract_trade.last_contract.contract_info || { },
        digits_info      : modules.contract_trade.last_contract.digits_info || { },
        display_status   : modules.contract_trade.last_contract.display_status,
        is_ended         : modules.contract_trade.last_contract.is_ended,
    })
)(LazyBottomDigits);

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
    is_digit_contract,
}) => (
    markers_array.map(marker => (
        <ChartMarker
            key={marker.react_key}
            marker_config={marker.marker_config}
            marker_content_props={marker.content_config}
            is_bottom_widget_visible={is_digit_contract}
        />
    ))
);
const ChartMarkers = connect(
    ({ modules }) => ({
        markers_array    : modules.contract_trade.markers_array,
        is_digit_contract: modules.contract_trade.is_digit_contract,
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
        const { last_contract, show_digits_stats } = this.props;
        const bottomWidgets = (last_contract.is_digit_contract && !last_contract.is_ended) ? ChartBottomWidgets : null;
        return (
            <SmartChart
                barriers={this.props.barriers_array}
                bottomWidgets={bottomWidgets}
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
                topWidgets={this.topWidgets}
                isConnectionOpened={this.props.is_socket_opened}
                clearChart={false}
                importedLayout={this.props.chart_layout}
                onExportLayout={this.props.exportLayout}
                shouldFetchTradingTimes={!this.props.end_epoch}
            >
                <ChartMarkers />
            </SmartChart>
        );
    }
}

const ChartTrade = connect(
    ({ modules, ui, common }) => ({
        is_mobile       : ui.is_mobile,
        is_socket_opened: common.is_socket_opened,

        updateChartType  : modules.contract_trade.updateChartType,
        updateGranularity: modules.contract_trade.updateGranularity,
        granularity      : modules.contract_trade.granularity,
        chart_type       : modules.contract_trade.chart_type,
        barriers_array   : modules.contract_trade.barriers_array,
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
    })
)(ChartTradeClass);
