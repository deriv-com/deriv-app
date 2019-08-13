import PropTypes             from 'prop-types';
import React                 from 'react';
import ChartLoader           from 'App/Components/Elements/chart-loader.jsx';
import UILoader              from 'App/Components/Elements/ui-loader.jsx';
import { connect }           from 'Stores/connect';
import PositionsDrawer       from 'App/Components/Elements/PositionsDrawer';
import MarketIsClosedOverlay from 'App/Components/Elements/market-is-closed-overlay.jsx';
import Lazy                  from 'App/Containers/Lazy';
import Test                  from './test.jsx';
import FormLayout            from '../Components/Form/form-layout.jsx';
import { isDigitTradeType }  from '../Helpers/digits';

// const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));

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
        const should_show_bottom_widgets   = this.props.is_digit_contract && this.props.is_contract_mode;
        const should_show_last_digit_stats = isDigitTradeType(this.props.contract_type) && !this.props.is_contract_mode;
        const is_chart_visible             = (this.props.is_chart_loading || !this.props.is_chart_ready);

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
                            <ChartLoader is_visible={is_chart_visible} />
                            <ChartTrade
                                chart_id={this.props.chart_id}
                                chart_type={this.props.chart_type}
                                Digits={
                                    <Lazy
                                        ctor={() => import(/* webpackChunkName: "digits", webpackPrefetch: true */'Modules/Contract/Components/Digits')}
                                        should_load={this.props.is_digit_contract}
                                        is_trade_page
                                        contract_info={this.props.contract_info}
                                        digits_info={this.props.digits_info}
                                        display_status={this.props.display_status}
                                        is_digit_contract={this.props.is_digit_contract}
                                        is_ended={this.props.is_ended}
                                    />
                                }
                                InfoBox={
                                    <Lazy
                                        ctor={() => import(/* webpackChunkName: "info-box", webpackPrefetch: true */'Modules/Contract/Components/InfoBox')}
                                        should_load={true}
                                        has_progress={false}
                                        is_trade_page
                                        contract_info={this.props.contract_info}
                                        error_message={this.props.error_message}
                                        is_contract_mode={this.props.is_contract_mode}
                                        removeError={this.props.removeError}
                                        onClose={this.props.onCloseContract}
                                    />
                                }
                                end_epoch={this.props.end_epoch}
                                granularity={this.props.granularity}
                                is_trade_page
                                is_static_chart={this.props.is_static_chart}
                                onSymbolChange={this.props.onSymbolChange}
                                scroll_to_epoch={this.props.scroll_to_epoch}
                                start_epoch={this.props.start_epoch}
                                should_show_bottom_widgets={should_show_bottom_widgets}
                                should_show_last_digit_stats={should_show_last_digit_stats}
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

Trade.propTypes = {
    chart_id         : PropTypes.string,
    chart_type       : PropTypes.string,
    contract_info    : PropTypes.object,
    contract_type    : PropTypes.string,
    digits_info      : PropTypes.object,
    display_status   : PropTypes.string,
    end_epoch        : PropTypes.number,
    granularity      : PropTypes.number,
    is_chart_loading : PropTypes.bool,
    is_chart_ready   : PropTypes.bool,
    is_contract_mode : PropTypes.bool,
    is_digit_contract: PropTypes.bool,
    is_ended         : PropTypes.bool,
    is_market_closed : PropTypes.bool,
    is_mobile        : PropTypes.bool,
    is_static_chart  : PropTypes.bool,
    is_trade_enabled : PropTypes.bool,
    onCloseContract  : PropTypes.func,
    onMount          : PropTypes.func,
    onSymbolChange   : PropTypes.func,
    onUnmount        : PropTypes.func,
    purchase_info    : PropTypes.object,
    scroll_to_epoch  : PropTypes.number,
    showPositions    : PropTypes.func,
    start_epoch      : PropTypes.number,
    symbol           : PropTypes.string,
};

export default connect(
    ({ modules, ui }) => ({
        contract_info    : modules.contract_trade.contract_info,
        digits_info      : modules.contract_trade.digits_info,
        display_status   : modules.contract_trade.display_status,
        error_message    : modules.contract_trade.error_message,
        is_ended         : modules.contract_trade.is_ended,
        is_digit_contract: modules.contract_trade.is_digit_contract,
        onCloseContract  : modules.contract_trade.onCloseContract,
        removeError      : modules.contract_trade.removeErrorMessage,

        chart_id        : modules.smart_chart.chart_id,
        chart_type      : modules.smart_chart.chart_type,
        scroll_to_epoch : modules.smart_chart.scroll_to_left_epoch,
        granularity     : modules.smart_chart.granularity,
        end_epoch       : modules.smart_chart.end_epoch,
        start_epoch     : modules.smart_chart.start_epoch,
        is_chart_loading: modules.smart_chart.is_chart_loading,
        is_chart_ready  : modules.smart_chart.is_chart_ready,
        is_contract_mode: modules.smart_chart.is_contract_mode,
        is_static_chart : modules.smart_chart.is_static_chart,

        contract_type   : modules.trade.contract_type,
        is_market_closed: modules.trade.is_market_closed,
        is_trade_enabled: modules.trade.is_trade_enabled,
        onMount         : modules.trade.onMount,
        onSymbolChange  : modules.trade.onChange,
        onUnmount       : modules.trade.onUnmount,
        purchase_info   : modules.trade.purchase_info,
        symbol          : modules.trade.symbol,

        has_only_forward_starting_contracts: ui.has_only_forward_starting_contracts,
        is_mobile                          : ui.is_mobile,
        setHasOnlyForwardingContracts      : ui.setHasOnlyForwardingContracts,
    })
)(Trade);

/* eslint-disable */
// ChartTrade
import {
    SmartChart,
    setSmartChartsPublicPath } from 'smartcharts-beta';
import { getUrlBase }          from '_common/url';
import ControlWidgets          from '../../SmartChart/Components/control-widgets.jsx';
import BottomWidgets           from '../../SmartChart/Components/bottom-widgets.jsx';
import ChartMarker             from '../../SmartChart/Components/Markers/marker.jsx';
import TopWidgets              from '../../SmartChart/Components/top-widgets.jsx';
import { symbolChange }        from '../../SmartChart/Helpers/symbol';
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

    topWidgets = () => (
        <TopWidgets
            InfoBox={this.props.InfoBox}
            is_title_enabled={this.props.is_title_enabled}
            onSymbolChange={symbolChange(this.props.onSymbolChange)}
        />
    );

    bottomWidgets = () => (
        <BottomWidgets Digits={this.props.Digits} />
    );

    render() {
        return (
            <SmartChart
                barriers={this.props.barriers_array}
                bottomWidgets={this.props.should_show_bottom_widgets ?
                    this.bottomWidgets : null}
                chartControlsWidgets={this.props.is_contract_mode ? null : this.chartControlsWidgets}
                chartStatusListener={this.props.getChartStatus}
                chartType={this.props.chart_type}
                endEpoch={this.props.end_epoch}
                margin={this.props.margin || null}
                id={this.props.chart_id}
                isMobile={this.props.is_mobile}
                enabledNavigationWidget={this.props.is_contract_mode}
                granularity={this.props.granularity}
                requestAPI={this.props.wsSendRequest}
                requestForget={this.props.wsForget}
                requestForgetStream={this.props.wsForgetStream}
                requestSubscribe={this.props.wsSubscribe}
                settings={this.props.settings}
                showLastDigitStats={this.props.should_show_last_digit_stats}
                startEpoch={this.props.start_epoch}
                scrollToEpoch={this.props.scroll_to_epoch}
                symbol={this.props.symbol}
                topWidgets={this.topWidgets}
                isConnectionOpened={this.props.is_socket_opened}
                clearChart={this.props.should_clear_chart}
                importedLayout={this.props.should_import_layout ? this.props.trade_chart_layout : null}
                onExportLayout={this.props.should_export_layout ? this.props.exportLayout : null}
                isStaticChart={this.props.is_static_chart}
                shouldFetchTradingTimes={!this.props.end_epoch}
            >
                { this.props.markers_array.map(marker => (
                    <ChartMarker
                        key={marker.react_key}
                        marker_config={marker.marker_config}
                        marker_content_props={marker.content_config}
                        is_bottom_widget_visible={this.props.should_show_bottom_widgets}
                    />
                ))}
            </SmartChart>
        );
    }
}

ChartTradeClass.propTypes = {
    barriers_array               : PropTypes.array,
    BottomWidgets                : PropTypes.node,
    chart_id                     : PropTypes.string,
    chart_type                   : PropTypes.string,
    end_epoch                    : PropTypes.number,
    exportLayout                 : PropTypes.func,
    getChartStatus               : PropTypes.func,
    granularity                  : PropTypes.number,
    InfoBox                      : PropTypes.node,
    is_contract_mode             : PropTypes.bool,
    is_mobile                    : PropTypes.bool,
    is_socket_opened             : PropTypes.bool,
    is_static_chart              : PropTypes.bool,
    is_title_enabled             : PropTypes.bool,
    margin                       : PropTypes.number,
    markers_array                : PropTypes.array,
    onMount                      : PropTypes.func,
    onSymbolChange               : PropTypes.func,
    onUnmount                    : PropTypes.func,
    replay_controls              : PropTypes.object,
    scroll_to_epoch              : PropTypes.number,
    settings                     : PropTypes.object,
    should_clear_chart           : PropTypes.bool,
    should_export_layout         : PropTypes.bool,
    should_import_layout         : PropTypes.bool,
    should_refresh_active_symbols: PropTypes.bool,
    should_show_last_digit_stats : PropTypes.bool,
    start_epoch                  : PropTypes.number,
    symbol                       : PropTypes.string,
    trade_chart_layout           : PropTypes.object,
    updateChartType              : PropTypes.func,
    updateGranularity            : PropTypes.func,
    wsForget                     : PropTypes.func,
    wsForgetStream               : PropTypes.func,
    wsSendRequest                : PropTypes.func,
    wsSubscribe                  : PropTypes.func,
};

const ChartTrade = connect(
    ({ modules, ui, common }) => ({
        is_socket_opened: common.is_socket_opened,

        markers_array : modules.contract_trade.markers_array,
        barriers_array: modules.contract_trade.barriers_array,

        settings: {
            assetInformation            : false, // ui.is_chart_asset_info_visible,
            countdown                   : ui.is_chart_countdown_visible,
            isHighestLowestMarkerEnabled: false, // !this.is_contract_mode,
            lang                        : common.current_language,
            position                    : ui.is_chart_layout_default ? 'bottom' : 'left',
            theme                       : ui.is_dark_mode_on ? 'dark' : 'light',
        },

        exportLayout        : modules.smart_chart.exportLayout,
        getChartStatus      : modules.smart_chart.getChartStatus,
        is_contract_mode    : modules.smart_chart.is_contract_mode,
        is_title_enabled    : modules.smart_chart.is_title_enabled,
        margin              : modules.smart_chart.margin,
        onMount             : modules.smart_chart.onMount,
        onUnmount           : modules.smart_chart.onUnmount,
        should_clear_chart  : modules.smart_chart.should_clear_chart,
        should_export_layout: modules.smart_chart.should_export_layout,
        should_import_layout: modules.smart_chart.should_import_layout,
        trade_chart_layout  : modules.smart_chart.trade_chart_layout,
        updateChartType     : modules.smart_chart.updateChartType,
        updateGranularity   : modules.smart_chart.updateGranularity,
        is_mobile           : ui.is_mobile,

        wsForget      : modules.trade.wsForget,
        wsForgetStream: modules.trade.wsForgetStream,
        wsSendRequest : modules.trade.wsSendRequest,
        wsSubscribe   : modules.trade.wsSubscribe,
    })
)(ChartTradeClass);
