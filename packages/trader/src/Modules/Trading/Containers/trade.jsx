import PropTypes             from 'prop-types';
import React                 from 'react';
import ChartLoader           from 'App/Components/Elements/chart-loader.jsx';
import { connect }           from 'Stores/connect';
import PositionsDrawer       from 'App/Components/Elements/PositionsDrawer';
import MarketIsClosedOverlay from 'App/Components/Elements/market-is-closed-overlay.jsx';
import Lazy                  from 'App/Containers/Lazy';
import Test                  from './test.jsx';
import FormLayout            from '../Components/Form/form-layout.jsx';
import { isDigitTradeType }  from '../Helpers/digits';

const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart", webpackPreload: true */'../../SmartChart'));
const loadNotificationMessages = () => import(/* webpackChunkName: "notification-messages", webpackPrefetch: 99 */'App/Containers/notification-messages.jsx');
const Digits                   = React.lazy(() => import(/* webpackChunkName: "digits" */'Modules/Contract/Components/Digits'));
const InfoBox                  = React.lazy(() => import(/* webpackChunkName: "info-box", webpackPrefetch: 98 */'Modules/Contract/Components/InfoBox'));

class Trade extends React.Component {
    componentDidMount() {
        this.props.showPositions();
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.hidePositions();
        if (this.props.is_contract_mode) {
            this.props.onCloseContract();
        }
        this.props.onUnmount();
    }

    render() {
        const form_wrapper_class           = this.props.is_mobile ? 'mobile-wrapper' : 'sidebar__container desktop-only';
        const should_show_bottom_widgets   = this.props.is_digit_contract && this.props.is_contract_mode;
        const should_show_last_digit_stats = isDigitTradeType(this.props.contract_type) && !this.props.is_contract_mode;
        const is_chart_visible             = (this.props.is_chart_loading || !this.props.is_chart_ready);

        return (
            <div id='trade_container' className='trade-container'>
                <PositionsDrawer />
                <div className='chart-container'>
                    <Lazy
                        ctor={loadNotificationMessages}
                        has_progress={false}
                        should_load={true}
                    />
                    {
                        <React.Suspense
                            fallback={
                                <ChartLoader
                                    is_dark={this.props.is_dark_theme}
                                    is_visible={!this.props.symbol}
                                />
                            }
                        >
                            <ChartLoader is_dark={this.props.is_dark_theme} is_visible={is_chart_visible} />
                            {!this.props.is_modals_on &&
                            <SmartChart
                                chart_id={this.props.chart_id}
                                chart_type={this.props.chart_type}
                                Digits={
                                    <Digits
                                        is_trade_page
                                        contract_info={this.props.contract_info}
                                        digits_info={this.props.digits_info}
                                        display_status={this.props.display_status}
                                        is_digit_contract={this.props.is_digit_contract}
                                        is_ended={this.props.is_ended}
                                    />
                                }
                                InfoBox={
                                    <InfoBox
                                        is_trade_page
                                        contract_info={this.props.contract_info}
                                        error_message={this.props.error_message}
                                        is_contract_mode={this.props.is_contract_mode}
                                        removeError={this.props.removeError}
                                        onClose={this.props.onCloseContract}
                                    />
                                }
                                end_epoch={this.props.end_epoch}
                                granularity={this.props.granularity}
                                is_trade_page
                                is_static_chart={this.props.is_static_chart}
                                onSymbolChange={this.props.onSymbolChange}
                                scroll_to_epoch={this.props.scroll_to_epoch}
                                start_epoch={this.props.start_epoch}
                                should_show_bottom_widgets={should_show_bottom_widgets}
                                should_show_last_digit_stats={should_show_last_digit_stats}
                                symbol={this.props.symbol}
                            />
                            }
                        </React.Suspense>
                    }
                    {/* Remove Test component for debugging below for production release */}
                    <Test />
                </div>
                <div
                    className={form_wrapper_class}
                    onClick={this.props.is_contract_mode ? () => {
                        this.props.onCloseContract();
                    } : null}
                    style={{ cursor: this.props.is_contract_mode ? 'pointer' : 'initial' }}
                >
                    { this.props.is_market_closed && <MarketIsClosedOverlay />}
                    <FormLayout

                        is_dark_theme={this.props.is_dark_theme}
                        is_contract_visible={this.props.is_contract_mode}
                        is_market_closed={this.props.is_market_closed}
                        is_mobile={this.props.is_mobile}
                        is_trade_enabled={this.props.is_trade_enabled}
                    />
                </div>
            </div>
        );
    }
}

Trade.propTypes = {
    chart_id         : PropTypes.string,
    chart_type       : PropTypes.string,
    contract_info    : PropTypes.object,
    contract_type    : PropTypes.string,
    digits_info      : PropTypes.object,
    display_status   : PropTypes.string,
    end_epoch        : PropTypes.number,
    granularity      : PropTypes.number,
    hidePositions    : PropTypes.func,
    is_chart_loading : PropTypes.bool,
    is_chart_ready   : PropTypes.bool,
    is_contract_mode : PropTypes.bool,
    is_dark_theme    : PropTypes.bool,
    is_digit_contract: PropTypes.bool,
    is_ended         : PropTypes.bool,
    is_market_closed : PropTypes.bool,
    is_mobile        : PropTypes.bool,
    is_static_chart  : PropTypes.bool,
    is_trade_enabled : PropTypes.bool,
    onCloseContract  : PropTypes.func,
    onMount          : PropTypes.func,
    onSymbolChange   : PropTypes.func,
    onUnmount        : PropTypes.func,
    purchase_info    : PropTypes.object,
    scroll_to_epoch  : PropTypes.number,
    showPositions    : PropTypes.func,
    start_epoch      : PropTypes.number,
    symbol           : PropTypes.string,
};

export default connect(
    ({ modules, ui }) => ({
        contract_info                      : modules.contract_trade.contract_info,
        digits_info                        : modules.contract_trade.digits_info,
        display_status                     : modules.contract_trade.display_status,
        error_message                      : modules.contract_trade.error_message,
        is_ended                           : modules.contract_trade.is_ended,
        is_digit_contract                  : modules.contract_trade.is_digit_contract,
        onCloseContract                    : modules.contract_trade.onCloseContract,
        removeError                        : modules.contract_trade.clearError,
        chart_id                           : modules.smart_chart.chart_id,
        chart_type                         : modules.smart_chart.chart_type,
        scroll_to_epoch                    : modules.smart_chart.scroll_to_left_epoch,
        granularity                        : modules.smart_chart.granularity,
        end_epoch                          : modules.smart_chart.end_epoch,
        start_epoch                        : modules.smart_chart.start_epoch,
        is_chart_loading                   : modules.smart_chart.is_chart_loading,
        is_chart_ready                     : modules.smart_chart.is_chart_ready,
        is_contract_mode                   : modules.smart_chart.is_contract_mode,
        is_static_chart                    : modules.smart_chart.is_static_chart,
        contract_type                      : modules.trade.contract_type,
        is_market_closed                   : modules.trade.is_market_closed,
        is_trade_enabled                   : modules.trade.is_trade_enabled,
        onMount                            : modules.trade.onMount,
        onSymbolChange                     : modules.trade.onChange,
        onUnmount                          : modules.trade.onUnmount,
        purchase_info                      : modules.trade.purchase_info,
        symbol                             : modules.trade.symbol,
        hidePositions                      : ui.hidePositionsFooterToggle,
        showPositions                      : ui.showPositionsFooterToggle,
        has_only_forward_starting_contracts: ui.has_only_forward_starting_contracts,
        is_dark_theme                      : ui.is_dark_mode_on,
        is_modals_on                       : ui.is_account_management_modal_on || ui.is_cashier_modal_on,
        is_mobile                          : ui.is_mobile,
        setHasOnlyForwardingContracts      : ui.setHasOnlyForwardingContracts,
    })
)(Trade);
