import PropTypes         from 'prop-types';
import React             from 'react';
import { withRouter }    from 'react-router';
import { SmartChart } from 'smartcharts-beta';
import { isEmptyObject } from '_common/utility';
import ChartLoader       from 'App/Components/Elements/chart-loader.jsx';
import ContractDrawer    from 'App/Components/Elements/ContractDrawer';
import Lazy              from 'App/Containers/Lazy';
import { localize }      from 'App/i18n';
import Icon              from 'Assets/icon.jsx';
import AppRoutes         from 'Constants/routes';
import { connect }       from 'Stores/connect';
// --------------------------
import BottomWidgets           from '../../SmartChart/Components/bottom-widgets.jsx';
import ChartMarker             from '../../SmartChart/Components/Markers/marker.jsx';
import TopWidgets              from '../../SmartChart/Components/top-widgets.jsx';
import { symbolChange }        from '../../SmartChart/Helpers/symbol';

// const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));

class ContractReplay extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    componentDidMount() {
        this.props.showBlur();
        const url_contract_id = +/[^/]*$/.exec(location.pathname)[0];
        this.props.onMount(this.props.contract_id || url_contract_id);
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        this.props.hideBlur();
        this.props.onUnmount();
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            const classname_string = event.target.classList[0];
            if (/^.*(modal|btn|notification)/.test(classname_string)) {
                return;
            }
            this.props.history.push(AppRoutes.trade);
        }
    };

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
            onClickSell,
            removeError,
            status,
        } = this.props;

        const is_from_table_row = !isEmptyObject(location.state) ? location.state.from_table_row : false;

        return (
            <div className='trade-container__replay' ref={this.setWrapperRef}>
                <ContractDrawer
                    contract_info={contract_info}
                    is_dark_theme={is_dark_theme}
                    is_from_reports={is_from_table_row}
                    is_sell_requested={is_sell_requested}
                    onClickSell={onClickSell}
                    status={status}
                />
                <React.Suspense fallback={<div />}>
                    <div className='replay-chart__container'>
                        <div className='vertical-tab__action-bar'>
                            <div
                                className='vertical-tab__action-bar-wrapper'
                                key={localize('Close')}
                                onClick={() => this.props.history.push(AppRoutes.trade)}
                            >
                                <Icon
                                    className='vertical-tab__action-bar--icon'
                                    icon='ModalIconClose'
                                />
                            </div>
                        </div>
                        <Lazy
                            ctor={() => import(/* webpackChunkName: "notification-messages" */'App/Containers/notification-messages.jsx')}
                            has_progress={false}
                            should_load={true}
                        />
                        <ChartLoader is_visible={is_chart_loading} />
                        { contract_info.underlying  &&
                        <ReplayChart
                            Digits={
                                <Lazy
                                    ctor={() => import(/* webpackChunkName: "digits" */'Modules/Contract/Components/Digits')}
                                    should_load={is_digit_contract}
                                    is_digit_contract={is_digit_contract}
                                    has_progress={true}
                                    is_ended={is_ended}
                                    contract_info={contract_info}
                                    digits_info={digits_info}
                                    display_status={display_status}
                                />
                            }
                            InfoBox={
                                <Lazy
                                    ctor={() => import(/* webpackChunkName: "info-box" */'Modules/Contract/Components/InfoBox')}
                                    should_load={true}
                                    has_progress={false}
                                    contract_info={contract_info}
                                    error_message={error_message}
                                    is_contract_mode={true}
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
    hideBlur         : PropTypes.func,
    history          : PropTypes.object,
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
    showBlur         : PropTypes.func,
    status           : PropTypes.string,
};

export default withRouter(connect(
    ({ modules, ui }) => ({
        contract_info    : modules.contract_replay.contract_info,
        digits_info      : modules.contract_replay.digits_info,
        display_status   : modules.contract_replay.display_status,
        error_message    : modules.contract_replay.error_message,
        is_digit_contract: modules.contract_replay.is_digit_contract,
        is_ended         : modules.contract_replay.is_ended,
        is_sell_requested: modules.contract_replay.is_sell_requested,
        onClickSell      : modules.contract_replay.onClickSell,
        onMount          : modules.contract_replay.onMount,
        onUnmount        : modules.contract_replay.onUnmount,
        removeError      : modules.contract_replay.removeErrorMessage,
        status           : modules.contract_replay.indicative_status,
        is_chart_loading : modules.contract_replay.is_chart_loading,
        hideBlur         : ui.hideRouteBlur,
        is_dark_theme    : ui.is_dark_mode_on,
        showBlur         : ui.showRouteBlur,

    })
)(ContractReplay));

// -----------------------------------------

class Chart extends React.Component {
    topWidgets = () => (
        <TopWidgets
            InfoBox={this.props.InfoBox}
            is_title_enabled={false}
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
                bottomWidgets={this.props.is_digit_contract ?  this.bottomWidgets : null}
                chartControlsWidgets={null}
                chartType={this.props.chart_type}
                endEpoch={this.props.end_epoch}
                margin={this.props.margin || null}
                isMobile={this.props.is_mobile}
                granularity={this.props.granularity}
                requestAPI={this.props.wsSendRequest}
                requestForget={this.props.wsForget}
                requestForgetStream={this.props.wsForgetStream}
                requestSubscribe={this.props.wsSubscribe}
                settings={this.props.settings}
                startEpoch={this.props.start_epoch}
                scrollToEpoch={this.props.scroll_to_epoch}
                scrollToEpochOffset={this.props.scroll_to_offset}
                symbol={this.props.symbol}
                topWidgets={this.topWidgets}
                isConnectionOpened={this.props.is_socket_opened}
                isStaticChart={this.props.is_static_chart}
                shouldFetchTradingTimes={!this.props.end_epoch}
            >
                { this.props.markers_array.map((marker, idx) => (
                    <ChartMarker
                        key={idx}
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
    onSymbolChange  : PropTypes.func,
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
        const contract_replay = modules.contract_replay;
        const contract_config = modules.contract_replay.contract_config;
        const settings = {
            lang                        : common.current_language,
            theme                       : ui.is_dark_mode_on ? 'dark' : 'light',
            position                    : ui.is_chart_layout_default ? 'bottom' : 'left',
            countdown                   : ui.is_chart_countdown_visible,
            assetInformation            : false, // ui.is_chart_asset_info_visible,
            isHighestLowestMarkerEnabled: false, // !this.is_contract_mode, // TODO: Pending UI
        };
        return ({
            end_epoch      : contract_config.end_epoch,
            chart_type     : contract_config.chart_type,
            start_epoch    : contract_config.start_epoch,
            granularity    : contract_config.granularity,
            scroll_to_epoch: contract_config.scroll_to_epoch,

            settings,
            is_mobile        : ui.is_mobile,
            is_socket_opened : common.is_socket_opened,
            is_digit_contract: modules.contract_replay.is_digit_contract,

            margin         : contract_replay.margin,
            wsForget       : contract_replay.wsForget,
            wsSubscribe    : contract_replay.wsSubscribe,
            wsSendRequest  : contract_replay.wsSendRequest,
            wsForgetStream : contract_replay.wsForgetStream,
            is_static_chart: contract_replay.is_static_chart,
            barriers_array : contract_replay.barriers_array,
            markers_array  : contract_replay.markers_array,
        });
    }
)(Chart);
