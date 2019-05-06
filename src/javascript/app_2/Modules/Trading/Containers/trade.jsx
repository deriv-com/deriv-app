import PropTypes            from 'prop-types';
import React                from 'react';
import { getPropertyValue } from '_common/utility';
import UILoader             from 'App/Components/Elements/ui-loader.jsx';
import { connect }          from 'Stores/connect';
import PositionsDrawer      from 'App/Components/Elements/PositionsDrawer';
import Test                 from './test.jsx';
import FormLayout           from '../Components/Form/form-layout.jsx';
import Digits               from '../../Contract/Containers/digits.jsx';
import InfoBox              from '../../Contract/Containers/info-box.jsx';

const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));

class Trade extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const contract_id = getPropertyValue(this.props.purchase_info, ['buy', 'contract_id']);
        const form_wrapper_class = this.props.is_mobile ? 'mobile-wrapper' : 'sidebar__container desktop-only';
        const is_digit_contract = ['match_diff', 'even_odd', 'over_under'].includes(this.props.contract_type);
        return (
            <div id='trade_container' className='trade-container'>
                <PositionsDrawer />
                <div className='chart-container'>
                    { this.props.symbol &&
                        <React.Suspense fallback={<UILoader />} >
                            <SmartChart
                                chart_id={this.props.chart_id}
                                Digits={<Digits is_trade_page />}
                                InfoBox={<InfoBox is_trade_page />}
                                is_digit_contract={is_digit_contract}
                                onSymbolChange={this.props.onSymbolChange}
                                scroll_to_epoch={this.props.scroll_to_epoch}
                                scroll_to_offset={this.props.scroll_to_offset}
                                should_show_last_digit_stats={(is_digit_contract && !this.props.is_contract_mode)}
                                symbol={this.props.symbol}
                            />
                        </React.Suspense>
                    }
                    {/* Remove Test component for debugging below for production release */}
                    <Test />
                </div>
                <div
                    className={form_wrapper_class}
                    onClick={this.props.is_contract_mode ? (e) => {
                        this.props.onCloseContract();
                        this.props.onClickNewTrade(e);
                    } : null}
                    style={{ cursor: this.props.is_contract_mode ? 'pointer' : 'initial' }}
                >
                    <FormLayout
                        is_mobile={this.props.is_mobile}
                        is_contract_visible={!!contract_id || this.props.is_contract_mode}
                        is_trade_enabled={this.props.is_trade_enabled}
                    />
                </div>
            </div>
        );
    }
}

Trade.propTypes = {
    chart_id        : PropTypes.string,
    chart_zoom      : PropTypes.number,
    contract_type   : PropTypes.string,
    is_contract_mode: PropTypes.bool,
    is_mobile       : PropTypes.bool,
    is_trade_enabled: PropTypes.bool,
    onClickNewTrade : PropTypes.func,
    onCloseContract : PropTypes.func,
    onMount         : PropTypes.func,
    onSymbolChange  : PropTypes.func,
    onUnmount       : PropTypes.func,
    purchase_info   : PropTypes.object,
    scroll_to_epoch : PropTypes.number,
    scroll_to_offset: PropTypes.number,
    symbol          : PropTypes.string,
};

export default connect(
    ({ modules, ui }) => ({
        onCloseContract                    : modules.contract.onCloseContract,
        chart_id                           : modules.smart_chart.chart_id,
        scroll_to_epoch                    : modules.smart_chart.scroll_to_left_epoch,
        scroll_to_offset                   : modules.smart_chart.scroll_to_left_epoch_offset,
        is_contract_mode                   : modules.smart_chart.is_contract_mode,
        contract_type                      : modules.trade.contract_type,
        is_trade_enabled                   : modules.trade.is_trade_enabled,
        onClickNewTrade                    : modules.trade.onClickNewTrade,
        onMount                            : modules.trade.onMount,
        onSymbolChange                     : modules.trade.onChange,
        onUnmount                          : modules.trade.onUnmount,
        purchase_info                      : modules.trade.purchase_info,
        symbol                             : modules.trade.symbol,
        has_only_forward_starting_contracts: ui.has_only_forward_starting_contracts,
        is_mobile                          : ui.is_mobile,
        setHasOnlyForwardingContracts      : ui.setHasOnlyForwardingContracts,
    })
)(Trade);
