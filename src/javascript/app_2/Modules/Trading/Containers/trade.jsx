import PropTypes            from 'prop-types';
import React                from 'react';
import ChartLoader          from 'App/Components/Elements/chart-loader.jsx';
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
        const {
            chart_id,
            contract_type,
            is_chart_loading,
            is_chart_ready,
            is_contract_mode,
            is_mobile,
            is_trade_enabled,
            onClickNewTrade,
            onCloseContract,
            onSymbolChange,
            purchase_info,
            scroll_to_epoch,
            scroll_to_offset,
            symbol }             = this.props;
        const contract_id        = getPropertyValue(purchase_info, ['buy', 'contract_id']);
        const form_wrapper_class = is_mobile ? 'mobile-wrapper' : 'sidebar__container desktop-only';
        const is_digit_contract  = ['match_diff', 'even_odd', 'over_under'].includes(contract_type);
        const is_chart_visible   = (is_chart_loading || !is_chart_ready);
        return (
            <div id='trade_container' className='trade-container'>
                <PositionsDrawer />
                <div className='chart-container'>
                    {symbol &&
                        <React.Suspense fallback={<UILoader />} >
                            {is_chart_visible && <ChartLoader />}
                            <SmartChart
                                chart_id={chart_id}
                                Digits={<Digits is_trade_page />}
                                InfoBox={<InfoBox is_trade_page />}
                                is_digit_contract={is_digit_contract}
                                onSymbolChange={onSymbolChange}
                                scroll_to_epoch={scroll_to_epoch}
                                scroll_to_offset={scroll_to_offset}
                                should_show_last_digit_stats={(is_digit_contract && !is_contract_mode)}
                                symbol={symbol}
                            />
                        </React.Suspense>
                    }
                    {/* Remove Test component for debugging below for production release */}
                    <Test />
                </div>
                <div
                    className={form_wrapper_class}
                    onClick={is_contract_mode ? (e) => {
                        onCloseContract();
                        onClickNewTrade(e);
                    } : null}
                    style={{ cursor: is_contract_mode ? 'pointer' : 'initial' }}
                >
                    <FormLayout
                        is_contract_visible={!!contract_id || is_contract_mode}
                        is_mobile={is_mobile}
                        is_trade_enabled={is_trade_enabled}
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
    is_chart_loading: PropTypes.bool,
    is_chart_ready  : PropTypes.bool,
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
        is_chart_loading                   : modules.smart_chart.is_chart_loading,
        is_chart_ready                     : modules.smart_chart.is_chart_ready,
        is_contract_mode                   : modules.smart_chart.is_contract_mode,
        scroll_to_epoch                    : modules.smart_chart.scroll_to_left_epoch,
        scroll_to_offset                   : modules.smart_chart.scroll_to_left_epoch_offset,
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
