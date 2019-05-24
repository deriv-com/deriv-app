import PropTypes       from 'prop-types';
import React           from 'react';
import { withRouter }  from 'react-router';
import { FadeWrapper } from 'App/Components/Animations';
import ChartLoader     from 'App/Components/Elements/chart-loader.jsx';
import ContractDrawer  from 'App/Components/Elements/ContractDrawer';
import { connect }     from 'Stores/connect';
import { Icon }        from 'Assets/Common';
import { IconClose }   from 'Assets/Settings';
import AppRoutes       from 'Constants/routes';
import { localize }    from '_common/localize';
import InfoBox         from './info-box.jsx';
import Digits          from './digits.jsx';

const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));

class ContractReplay extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    componentDidMount() {
        this.props.hidePositions();
        this.props.setChartLoader(true);
        this.props.showBlur();
        const url_contract_id = /[^/]*$/.exec(location.pathname)[0];
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
            this.props.history.push(AppRoutes.trade);
        }
    };

    render() {
        const action_bar_items = [
            {
                onClick: () => this.props.history.push(AppRoutes.trade),
                icon   : IconClose,
                title  : localize('Close'),
            },
        ];

        const {
            config,
            contract_info,
            chart_id,
            is_chart_loading,
            server_time,
            status,
        } = this.props;

        return (
            <div className='trade-container__replay' ref={this.setWrapperRef}>
                <FadeWrapper
                    className='contract-drawer-wrapper'
                    is_visible={!!(contract_info.status)}
                    keyname='contract-drawer-wrapper'
                >
                    <ContractDrawer
                        contract_info={contract_info}
                        heading='Reports'
                        status={status}
                        server_time={server_time}
                    />
                </FadeWrapper>
                <React.Suspense fallback={<div />}>
                    <div className='replay-chart__container'>
                        <div className='vertical-tab__action-bar'>
                            {
                                action_bar_items.map(({ icon, onClick, title }) => (
                                    <Icon
                                        className='vertical-tab__action-bar--icon'
                                        key={title}
                                        icon={icon}
                                        onClick={onClick}
                                    />
                                ))
                            }
                        </div>
                        <ChartLoader is_visible={is_chart_loading && !contract_info.underlying} />
                        {!!(contract_info.underlying) &&
                        <SmartChart
                            chart_id={chart_id}
                            chartControlsWidgets={null}
                            Digits={<Digits />}
                            InfoBox={<InfoBox />}
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
    chart_id        : PropTypes.string,
    config          : PropTypes.object,
    contract_id     : PropTypes.string,
    contract_info   : PropTypes.object,
    hideBlur        : PropTypes.func,
    hidePositions   : PropTypes.func,
    history         : PropTypes.object,
    is_chart_loading: PropTypes.bool,
    location        : PropTypes.object,
    onMount         : PropTypes.func,
    onUnmount       : PropTypes.func,
    routes          : PropTypes.arrayOf(PropTypes.object),
    server_time     : PropTypes.object,
    setChartLoader  : PropTypes.func,
    showBlur        : PropTypes.func,
    status          : PropTypes.string,
};

export default withRouter(connect(
    ({ common, modules, ui }) => ({
        server_time     : common.server_time,
        chart_id        : modules.smart_chart.replay_id,
        config          : modules.contract.replay_config,
        onMount         : modules.contract.onMountReplay,
        onUnmount       : modules.contract.onUnmountReplay,
        contract_info   : modules.contract.replay_info,
        status          : modules.contract.replay_indicative_status,
        setChartLoader  : modules.smart_chart.setIsChartLoading,
        is_chart_loading: modules.smart_chart.is_chart_loading,
        hidePositions   : ui.hidePositionsFooterToggle,
        hideBlur        : ui.hideRouteBlur,
        showBlur        : ui.showRouteBlur,

    })
)(ContractReplay));
