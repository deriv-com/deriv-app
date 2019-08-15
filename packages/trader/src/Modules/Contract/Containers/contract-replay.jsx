import PropTypes         from 'prop-types';
import React             from 'react';
import { withRouter }    from 'react-router';
import { isEmptyObject } from '_common/utility';
import ChartLoader       from 'App/Components/Elements/chart-loader.jsx';
import ContractDrawer    from 'App/Components/Elements/ContractDrawer';
import Lazy              from 'App/Containers/Lazy';
import { localize }      from 'App/i18n';
import Icon              from 'Assets/icon.jsx';
import AppRoutes         from 'Constants/routes';
import { connect }       from 'Stores/connect';

const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));

class ContractReplay extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    componentDidMount() {
        this.props.hidePositions();
        this.props.setChartLoader(true);
        this.props.enableRouteMode();
        const url_contract_id = +/[^/]*$/.exec(location.pathname)[0];
        this.props.onMount(this.props.contract_id || url_contract_id);
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        this.props.disableRouteMode();
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
            config,
            contract_info,
            digits_info,
            display_status,
            error_message,
            is_chart_loading,
            is_dark_theme,
            is_digit_contract,
            is_ended,
            is_sell_requested,
            is_static_chart,
            location,
            onClickSell,
            removeError,
            status,
        } = this.props;

        const is_from_table_row = !isEmptyObject(location.state) ? location.state.from_table_row : false;

        return (
            <div id='dt_contract_replay_container' className='trade-container__replay' ref={this.setWrapperRef}>
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
                                id='dt_contract_replay_close_icon'
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
                        {(!!(contract_info.underlying) && !isEmptyObject(config)) &&
                        <SmartChart
                            chartControlsWidgets={null}
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
                            is_static_chart={is_static_chart}
                            should_show_last_digit_stats={false}
                            symbol={contract_info.underlying}
                            {...config}
                        />
                        }
                    </div>
                </React.Suspense>
            </div>
        );
    }
}

ContractReplay.propTypes = {
    config           : PropTypes.object,
    contract_id      : PropTypes.number,
    contract_info    : PropTypes.object,
    digits_info      : PropTypes.object,
    disableRouteMode : PropTypes.func,
    display_status   : PropTypes.string,
    enableRouteMode  : PropTypes.func,
    error_message    : PropTypes.string,
    hidePositions    : PropTypes.func,
    history          : PropTypes.object,
    is_chart_loading : PropTypes.bool,
    is_dark_theme    : PropTypes.bool,
    is_digit_contract: PropTypes.bool,
    is_ended         : PropTypes.bool,
    is_static_chart  : PropTypes.bool,
    location         : PropTypes.object,
    onMount          : PropTypes.func,
    onUnmount        : PropTypes.func,
    removeError      : PropTypes.func,
    routes           : PropTypes.arrayOf(PropTypes.object),
    server_time      : PropTypes.object,
    setChartLoader   : PropTypes.func,
    status           : PropTypes.string,
};

export default withRouter(connect(
    ({ modules, ui }) => ({
        config           : modules.contract_replay.contract_config,
        contract_info    : modules.contract_replay.contract_info,
        digits_info      : modules.contract_replay.digits_info,
        display_status   : modules.contract_replay.display_status,
        error_message    : modules.contract_replay.error_message,
        is_digit_contract: modules.contract_replay.is_digit_contract,
        is_ended         : modules.contract_replay.is_ended,
        is_sell_requested: modules.contract_replay.is_sell_requested,
        is_static_chart  : modules.contract_replay.is_static_chart,
        onClickSell      : modules.contract_replay.onClickSell,
        onMount          : modules.contract_replay.onMount,
        onUnmount        : modules.contract_replay.onUnmount,
        removeError      : modules.contract_replay.removeErrorMessage,
        status           : modules.contract_replay.indicative_status,
        is_chart_loading : modules.smart_chart.is_chart_loading,
        setChartLoader   : modules.smart_chart.setIsChartLoading,
        hidePositions    : ui.hidePositionsFooterToggle,
        disableRouteMode : ui.disableRouteModal,
        enableRouteMode  : ui.setRouteModal,
        is_dark_theme    : ui.is_dark_mode_on,

    })
)(ContractReplay));
