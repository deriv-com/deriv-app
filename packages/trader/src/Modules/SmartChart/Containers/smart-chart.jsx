import {
    SmartChart,
    setSmartChartsPublicPath } from 'smartcharts-beta';
import PropTypes               from 'prop-types';
import React                   from 'react';
import { getUrlBase }          from '_common/url';
import { connect }             from 'Stores/connect';
import BottomWidgets           from '../Components/bottom-widgets.jsx';
import ControlWidgets          from '../Components/control-widgets.jsx';
import ChartMarker             from '../Components/Markers/marker.jsx';
import TopWidgets              from '../Components/top-widgets.jsx';
import { symbolChange }        from '../Helpers/symbol';

setSmartChartsPublicPath(getUrlBase('/js/smartcharts/'));

class Chart extends React.Component {
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
                granularity={this.props.granularity}
                requestAPI={this.props.wsSendRequest}
                requestForget={this.props.wsForget}
                requestForgetStream={this.props.wsForgetStream}
                requestSubscribe={this.props.wsSubscribe}
                settings={this.props.settings}
                showLastDigitStats={this.props.should_show_last_digit_stats}
                startEpoch={this.props.start_epoch}
                scrollToEpoch={this.props.scroll_to_epoch}
                scrollToEpochOffset={this.props.scroll_to_offset}
                symbol={this.props.symbol}
                topWidgets={this.topWidgets}
                isConnectionOpened={this.props.is_socket_opened}
                clearChart={this.props.should_clear_chart}
                importedLayout={this.props.should_import_layout ? this.props.trade_chart_layout : null}
                onExportLayout={this.props.should_export_layout ? this.props.exportLayout : null}
                isStaticChart={this.props.is_static_chart}
                shouldFetchTradingTimes={!this.props.end_epoch}
                refreshActiveSymbols={this.props.should_refresh_active_symbols}
            >
                { this.props.markers_array.map((marker, idx) => (
                    <ChartMarker
                        key={idx}
                        marker_config={marker.marker_config}
                        marker_content_props={marker.content_config}
                        is_bottom_widget_visible={this.props.should_show_bottom_widgets}
                    />
                ))}
            </SmartChart>
        );
    }
}

Chart.propTypes = {
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
    scroll_to_epoch_offset       : PropTypes.number,
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

export default connect(
    ({ modules, ui, common }) => ({
        is_socket_opened             : common.is_socket_opened,
        barriers_array               : modules.smart_chart.barriers_array,
        exportLayout                 : modules.smart_chart.exportLayout,
        getChartStatus               : modules.smart_chart.getChartStatus,
        is_contract_mode             : modules.smart_chart.is_contract_mode,
        is_title_enabled             : modules.smart_chart.is_title_enabled,
        margin                       : modules.smart_chart.margin,
        markers_array                : modules.smart_chart.markers_array,
        onMount                      : modules.smart_chart.onMount,
        onUnmount                    : modules.smart_chart.onUnmount,
        settings                     : modules.smart_chart.settings,
        should_clear_chart           : modules.smart_chart.should_clear_chart,
        should_export_layout         : modules.smart_chart.should_export_layout,
        should_import_layout         : modules.smart_chart.should_import_layout,
        should_refresh_active_symbols: modules.smart_chart.should_refresh_active_symbols,
        trade_chart_layout           : modules.smart_chart.trade_chart_layout,
        updateChartType              : modules.smart_chart.updateChartType,
        updateGranularity            : modules.smart_chart.updateGranularity,
        wsForget                     : modules.smart_chart.wsForget,
        wsForgetStream               : modules.smart_chart.wsForgetStream,
        wsSendRequest                : modules.smart_chart.wsSendRequest,
        wsSubscribe                  : modules.smart_chart.wsSubscribe,
        is_mobile                    : ui.is_mobile,
    })
)(Chart);
