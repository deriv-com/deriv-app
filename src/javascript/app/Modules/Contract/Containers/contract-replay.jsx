import PropType       from 'prop-types';
import React          from 'react';
import ContractDrawer from 'App/Components/Elements/ContractDrawer';
import UILoader       from 'App/Components/Elements/ui-loader.jsx';
import { connect }    from 'Stores/connect';
import Digits         from './digits.jsx';
import InfoBox        from './info-box.jsx';

class ContractReplay extends React.Component {
    componentDidMount() {
        this.props.onMount(this.props.contract_id);
    }

    componentWillUnmount() {
        this.props.onUnmount(true);
    }

    render() {
        const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));
        const { status } = this.props.contract_info;

        if (status) {
            return (
                <React.Fragment>
                    <ContractDrawer
                        contract_info={this.props.contract_info}
                        heading='Reports'
                    />
                    <React.Suspense fallback={<UILoader />}>
                        <div className='replay-chart__container'>
                            <SmartChart
                                chart_id={this.props.chart_id}
                                Digits={<Digits />}
                                InfoBox={<InfoBox />}
                                end_epoch={this.props.contract_info.date_start}
                                start_epoch={this.props.contract_info.date_expiry}
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
    chart_id     : PropType.string,
    contract_id  : PropType.string,
    contract_info: PropType.object,
    onMount      : PropType.func,
    onUnmount    : PropType.func,
    symbol       : PropType.string,
};

export default connect(({ modules }) => ({
    contract_info: modules.contract.contract_info,
    chart_id     : modules.smart_chart.replay_id,
    onMount      : modules.contract.onMount,
    onUnmount    : modules.contract.onUnmount,
}))(ContractReplay);
