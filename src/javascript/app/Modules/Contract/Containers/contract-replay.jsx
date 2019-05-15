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
import InfoBox        from './info-box.jsx';
import Digits         from './digits.jsx';

class ContractReplay extends React.Component {
    componentDidMount() {
        this.props.showBlur();
        this.props.onMount(this.props.contract_id, true);
    }

    componentWillUnmount() {
        this.props.hideBlur();
        this.props.onUnmount();
    }

    render() {
        const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));
        const { status } = this.props.contract_info;

        const action_bar_items = [
            {
                onClick: () => { this.props.history.push(AppRoutes.trade); },
                icon   : IconClose,
                title  : localize('Close'),
            },
        ];

        if (status) {
            const is_digit_contract = ['DIGITMATCH', 'DIGITDIFF', 'DIGITEVEN', 'DIGITODD', 'DIGITOVER', 'DIGITUNDER'].includes(this.props.contract_info.contract_type);
            return (
                <React.Fragment>
                    <ContractDrawer
                        contract_info={this.props.contract_info}
                        heading='Reports'
                    />
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
                                Digits={<Digits />}
                                is_digit_contract={is_digit_contract}
                                InfoBox={<InfoBox />}
                                should_show_last_digit_stats={false}
                                symbol={this.props.contract_info.underlying}
                            />
                        </div>
                    </React.Suspense>
                </React.Fragment>
            );
        }
        return <UILoader />;
    }
}

ContractReplay.propTypes = {
    chart_id     : PropTypes.string,
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
        contract_info: modules.contract.contract_info,
        onMount      : modules.contract.onMount,
        onUnmount    : modules.contract.onCloseContract,
        hideBlur     : ui.hideRouteBlur,
        showBlur     : ui.showRouteBlur,

    })
)(ContractReplay));
