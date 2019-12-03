import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import ObjectUtils    from 'deriv-shared/utils/object';
import ChartLoader    from 'App/Components/Elements/chart-loader.jsx';
import ContractDrawer from 'App/Components/Elements/ContractDrawer';
import Digits         from 'Modules/Contract/Components/Digits';
import InfoBox        from 'Modules/Contract/Components/InfoBox';
import { localize }   from 'deriv-translations';
import Icon           from 'Assets/icon.jsx';
import AppRoutes      from 'Constants/routes';
import { SmartChart } from 'Modules/SmartChart';
import { connect }    from 'Stores/connect';

import BottomWidgets           from '../../SmartChart/Components/bottom-widgets.jsx';
import ChartMarker             from '../../SmartChart/Components/Markers/marker.jsx';
import TopWidgets              from '../../SmartChart/Components/top-widgets.jsx';

class ContractReplay extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    componentDidMount() {
        const url_contract_id = +/[^/]*$/.exec(location.pathname)[0];
        this.props.onMount(this.props.contract_id || url_contract_id);
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        this.props.onUnmount();
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.props.has_service_error) return;
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            const classname_string = event.target.classList[0];
            if (/^.*(modal|btn|notification)/.test(classname_string)) {
                return;
            }
            this.props.history.push(AppRoutes.trade);
        }
    };

    goBackToTrade = () => this.props.history.push(AppRoutes.trade);

    render() {
        const {
            contract_info,
            digits_info,
            display_status,
            error_message,
            is_chart_loading,
            is_dark_theme,
            is_digit_contract,
            is_ended,
            is_sell_requested,
            location,
            NotificationMessages,
            onClickSell,
            removeError,
            indicative_status,
        } = this.props;

        const is_from_table_row = !ObjectUtils.isEmptyObject(location.state) ? location.state.from_table_row : false;
        return (
            <div id='dt_contract_replay_container' className='trade-container__replay' ref={this.setWrapperRef}>
                <ContractDrawer
                    contract_info={contract_info}
                    is_dark_theme={is_dark_theme}
                    is_from_reports={is_from_table_row}
                    is_sell_requested={is_sell_requested}
                    onClickSell={onClickSell}
                    status={indicative_status}
                />
                <React.Suspense fallback={<div />}>
                    <div className='replay-chart__container'>
                        <div className='vertical-tab__action-bar'>
                            <div
                                id='dt_contract_replay_close_icon'
                                className='vertical-tab__action-bar-wrapper'
                                key={localize('Close')}
                                onClick={this.goBackToTrade}
                            >
                                <Icon
                                    className='vertical-tab__action-bar--icon'
                                    icon='ModalIconClose'
                                />
                            </div>
                        </div>
                        <NotificationMessages />
                        <ChartLoader is_dark={is_dark_theme} is_visible={is_chart_loading} />
                        { contract_info.underlying  &&
                        <ReplayChart
                            Digits={
                                <Digits
                                    is_digit_contract={is_digit_contract}
                                    is_ended={is_ended}
                                    contract_info={contract_info}
                                    digits_info={digits_info}
                                    display_status={display_status}
                                />
                            }
                            InfoBox={
                                <InfoBox
                                    contract_info={contract_info}
                                    error_message={error_message}
                                    removeError={removeError}
                                />
                            }
                            symbol={contract_info.underlying}
                        />
                        }
                    </div>
                </React.Suspense>
            </div>
        );
    }
}

ContractReplay.propTypes = {
    contract_id      : PropTypes.number,
    contract_info    : PropTypes.object,
    digits_info      : PropTypes.object,
    display_status   : PropTypes.string,
    error_message    : PropTypes.string,
    history          : PropTypes.object,
    indicative_status: PropTypes.string,
    is_chart_loading : PropTypes.bool,
    is_dark_theme    : PropTypes.bool,
    is_digit_contract: PropTypes.bool,
    is_ended         : PropTypes.bool,
    location         : PropTypes.object,
    onMount          : PropTypes.func,
    onUnmount        : PropTypes.func,
    removeError      : PropTypes.func,
    routes           : PropTypes.arrayOf(PropTypes.object),
    server_time      : PropTypes.object,
};

export default withRouter(connect(
    ({ modules, ui }) => {
        const contract_replay = modules.contract_replay;
        const contract_store = contract_replay.contract_store;
        return ({
            contract_info       : contract_store.contract_info,
            digits_info         : contract_store.digits_info,
            display_status      : contract_store.display_status,
            error_message       : contract_replay.error_message,
            is_digit_contract   : contract_store.is_digit_contract,
            is_ended            : contract_store.is_ended,
            is_sell_requested   : contract_replay.is_sell_requested,
            onClickSell         : contract_replay.onClickSell,
            onMount             : contract_replay.onMount,
            onUnmount           : contract_replay.onUnmount,
            removeError         : contract_replay.removeErrorMessage,
            indicative_status   : contract_replay.indicative_status,
            is_chart_loading    : contract_replay.is_chart_loading,
            is_dark_theme       : ui.is_dark_mode_on,
            has_service_error   : ui.is_services_error_visible,
            NotificationMessages: ui.notification_messages_ui,
        });
    }
)(ContractReplay));

// CHART -----------------------------------------

class Chart extends React.Component {
    topWidgets = () => (
        <TopWidgets
            InfoBox={this.props.InfoBox}
            is_title_enabled={false}
        />
    );

    bottomWidgets = () => (
        <BottomWidgets Digits={this.props.Digits} />
    );

    render() {
        return (
            <SmartChart
                barriers={this.props.barriers_array}
                bottomWidgets={this.props.is_digit_contract ?  this.bottomWidgets : null}
                chartControlsWidgets={null}
                chartType={this.props.chart_type}
                endEpoch={this.props.end_epoch}
                margin={this.props.margin || null}
                isMobile={this.props.is_mobile}
                enabledNavigationWidget={true}
                granularity={this.props.granularity}
                requestAPI={this.props.wsSendRequest}
                requestForget={this.props.wsForget}
                requestForgetStream={this.props.wsForgetStream}
                requestSubscribe={this.props.wsSubscribe}
                settings={this.props.settings}
                startEpoch={this.props.start_epoch}
                scrollToEpoch={this.props.scroll_to_epoch}
                chartStatusListener={this.props.setIsChartReady}
                symbol={this.props.symbol}
                topWidgets={this.topWidgets}
                isConnectionOpened={this.props.is_socket_opened}
                isStaticChart={false}
                shouldFetchTradingTimes={!this.props.end_epoch}
            >
                { this.props.markers_array.map(marker => (
                    <ChartMarker
                        key={marker.react_key}
                        marker_config={marker.marker_config}
                        marker_content_props={marker.content_config}
                        is_bottom_widget_visible={this.props.is_digit_contract}
                    />
                ))}
            </SmartChart>
        );
    }
}

Chart.propTypes = {
    barriers_array  : PropTypes.array,
    BottomWidgets   : PropTypes.node,
    chart_type      : PropTypes.string,
    end_epoch       : PropTypes.number,
    granularity     : PropTypes.number,
    InfoBox         : PropTypes.node,
    is_mobile       : PropTypes.bool,
    is_socket_opened: PropTypes.bool,
    is_static_chart : PropTypes.bool,
    margin          : PropTypes.number,
    markers_array   : PropTypes.array,
    replay_controls : PropTypes.object,
    scroll_to_epoch : PropTypes.number,
    settings        : PropTypes.object,
    start_epoch     : PropTypes.number,
    symbol          : PropTypes.string,
    wsForget        : PropTypes.func,
    wsForgetStream  : PropTypes.func,
    wsSendRequest   : PropTypes.func,
    wsSubscribe     : PropTypes.func,
};

const ReplayChart = connect(
    ({ modules, ui, common }) => {
        const trade = modules.trade;
        const contract_replay = modules.contract_replay;
        const contract_store = contract_replay.contract_store;
        const contract_config = contract_store.contract_config;
        const is_chart_ready = contract_replay.is_chart_ready;
        const settings = {
            lang                        : common.current_language,
            theme                       : ui.is_dark_mode_on ? 'dark' : 'light',
            position                    : ui.is_chart_layout_default ? 'bottom' : 'left',
            countdown                   : ui.is_chart_countdown_visible,
            assetInformation            : false, // ui.is_chart_asset_info_visible,
            isHighestLowestMarkerEnabled: false, // TODO: Pending UI
        };
        return ({
            end_epoch        : contract_config.end_epoch,
            chart_type       : contract_config.chart_type,
            start_epoch      : contract_config.start_epoch,
            granularity      : contract_config.granularity,
            scroll_to_epoch  : is_chart_ready ? contract_config.scroll_to_epoch : undefined,
            settings,
            is_mobile        : ui.is_mobile,
            is_socket_opened : common.is_socket_opened,
            is_digit_contract: contract_store.is_digit_contract,
            setIsChartReady  : contract_replay.setIsChartReady,
            margin           : contract_replay.margin,
            is_static_chart  : contract_replay.is_static_chart,
            barriers_array   : contract_store.barriers_array,
            markers_array    : contract_store.markers_array,
            wsForget         : trade.wsForget,
            wsSubscribe      : trade.wsSubscribe,
            wsSendRequest    : trade.wsSendRequest,
            wsForgetStream   : trade.wsForgetStream,
        });
    }
)(Chart);
