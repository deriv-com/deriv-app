import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import ContractDrawer from 'App/Components/Elements/ContractDrawer';
import UILoader       from 'App/Components/Elements/ui-loader.jsx';
import { connect }    from 'Stores/connect';
import { Icon }       from 'Assets/Common';
import { IconClose }  from 'Assets/Settings';
import AppRoutes      from 'Constants/routes';
import { localize }   from '_common/localize';
import { WS }         from 'Services';
import InfoBox        from './info-box.jsx';
import Digits         from './digits.jsx';

class ContractReplay extends React.Component {
    componentDidMount() {
        this.props.showBlur();
        const url_contract_id = /[^/]*$/.exec(location.pathname)[0];
        this.props.onMount(this.props.contract_id || url_contract_id);
    }

    componentWillUnmount() {
        this.props.hideBlur();
        this.props.onUnmount();
        // TODO: Remove below once smartcharts version that properly forgets ticks history is released.
        // This is to prevent console log spamming when switching between contract-replay and statement routes.
        WS.forgetAll('ticks_history');
    }

    render() {
        const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));

        const action_bar_items = [
            {
                onClick: () => { this.props.history.push(AppRoutes.trade); },
                icon   : IconClose,
                title  : localize('Close'),
            },
        ];

        return (
            <React.Fragment>
                { !!(this.props.contract_info.status) &&
                <ContractDrawer
                    contract_info={this.props.contract_info}
                    heading='Reports'
                />
                }
                <React.Suspense fallback={<UILoader />}>
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
                        <SmartChart
                            chart_id={this.props.chart_id}
                            chartControlsWidgets={this.props.chartControlsWidgets}
                            Digits={<Digits />}
                            InfoBox={<InfoBox />}
                            should_show_last_digit_stats={false}
                            {...this.props.config}
                        />
                    </div>
                </React.Suspense>
            </React.Fragment>
        );
    }
}

ContractReplay.propTypes = {
    chart_id     : PropTypes.string,
    config       : PropTypes.object,
    contract_id  : PropTypes.string,
    contract_info: PropTypes.object,
    hideBlur     : PropTypes.func,
    history      : PropTypes.object,
    location     : PropTypes.object,
    onMount      : PropTypes.func,
    onUnmount    : PropTypes.func,
    routes       : PropTypes.arrayOf(PropTypes.object),
    showBlur     : PropTypes.func,
};

export default withRouter(connect(
    ({ modules, ui }) => ({
        chart_id     : modules.smart_chart.replay_id,
        config       : modules.contract.replay_config,
        onMount      : modules.contract.onMountReplay,
        onUnmount    : modules.contract.onUnmountReplay,
        contract_info: modules.contract.replay_info,
        hideBlur     : ui.hideRouteBlur,
        showBlur     : ui.showRouteBlur,

    })
)(ContractReplay));
