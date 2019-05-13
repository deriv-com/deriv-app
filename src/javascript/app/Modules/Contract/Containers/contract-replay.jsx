import PropType       from 'prop-types';
import React          from 'react';
import ContractDrawer from 'App/Components/Elements/ContractDrawer';
import UILoader       from 'App/Components/Elements/ui-loader.jsx';
import { connect }    from 'Stores/connect';
import { isEnded }    from 'Stores/Modules/Contract/Helpers/logic';
import Digits         from './digits.jsx';
import InfoBox        from './info-box.jsx';

class ContractReplay extends React.Component {
    componentDidMount() {
        this.props.onMount(this.props.contract_id);
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));
        const { status } = this.props.contract_info;

        if (status) {
            return (
                <React.Fragment>
                    <ContractDrawer contract_info={this.props.contract_info} heading='Reports' />
                    <React.Suspense fallback={<UILoader />}>
                        <SmartChart
                            chart_id={this.props.chart_id}
                            is_contract_mode={true}
                            Digits={<Digits />}
                            InfoBox={<InfoBox />}
                            is_ended={isEnded(this.props.contract_info)}
                            end_epoch={this.props.contract_info.date_start}
                            start_epoch={this.props.contract_info.date_expiry}
                        />
                    </React.Suspense>
                </React.Fragment>
            );
        }
        return <UILoader />;
    }
}

ContractReplay.propTypes = {
    chart_id     : PropType.number,
    contract_id  : PropType.string,
    contract_info: PropType.object,
    onMount      : PropType.func,
    onUnmount    : PropType.func,
    symbol       : PropType.string,
};

export default connect(({ modules }) => ({
    contract_info: modules.contract.contract_info,
    chart_id     : modules.trade.chart_id,
    onMount      : modules.contract.onMount,
    onUnmount    : modules.contract.onUnmount,
}))(ContractReplay);
