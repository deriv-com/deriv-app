import React from 'react';
import { Tabs, Modal, Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';
import AmountMobile from 'Modules/Trading/Components/Form/TradeParams/amount-mobile.jsx';
import DurationMobile from 'Modules/Trading/Components/Form/TradeParams/Duration/duration-mobile.jsx';
// import Barrier                        from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
import LastDigit from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';
import 'Sass/app/modules/trading-mobile.scss';
import Div100vhContainer from '@deriv/components/src/components/div100vh-container';

const DEFAULT_DURATION = Object.freeze({
    t: 5,
    s: 15,
    m: 3,
    h: 1,
    d: 1,
});

const makeGetDefaultDuration = (trade_duration, trade_duration_unit) => duration_unit =>
    trade_duration_unit === duration_unit ? trade_duration : DEFAULT_DURATION[duration_unit];

class TradeParamsModal extends React.Component {
    constructor(props) {
        super(props);
        const { amount, duration, duration_unit } = this.props;
        const getDefaultDuration = makeGetDefaultDuration(duration, duration_unit);

        this.state = {
            trade_param_tab_idx: 0,
            duration_tab_idx: undefined,
            amount_tab_idx: undefined,
            // duration unit values
            curr_duration_unit: undefined,
            curr_duration_value: undefined,
            t_duration: getDefaultDuration('t'),
            s_duration: getDefaultDuration('s'),
            m_duration: getDefaultDuration('m'),
            h_duration: getDefaultDuration('h'),
            d_duration: getDefaultDuration('d'),
            // amount values
            stake_value: amount,
            payout_value: amount,
        };
    }

    setTradeParamTabIdx = trade_param_tab_idx => this.setState({ trade_param_tab_idx });

    setDurationTabIdx = duration_tab_idx => this.setState({ duration_tab_idx });

    setAmountTabIdx = amount_tab_idx => this.setState({ amount_tab_idx });

    setSelectedAmount = (basis, selected_basis_value) => this.setState({ [`${basis}_value`]: selected_basis_value });

    setSelectedDuration = (duration_unit, selected_duration) => {
        this.setState({
            [`${duration_unit}_duration`]: selected_duration,
            curr_duration_unit: duration_unit,
            curr_duration_value: selected_duration,
        });
    };

    isVisible = component_key => this.props.form_components.includes(component_key);

    render() {
        const { currency, duration_units_list } = this.props;
        return (
            <Modal
                id='dt_trade_parameters_mobile'
                className='trade-params'
                enableApp={this.props.enableApp}
                is_open={this.props.is_open}
                is_vertical_top
                header={<div />}
                disableApp={this.props.disableApp}
                toggleModal={this.props.toggleModal}
                height='auto'
                width='calc(100vw - 32px)'
            >
                <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='48px'>
                    <TradeParamsMobile
                        currency={currency}
                        toggleModal={this.props.toggleModal}
                        isVisible={this.isVisible}
                        setTradeParamTabIdx={this.setTradeParamTabIdx}
                        trade_param_tab_idx={this.state.trade_param_tab_idx}
                        setDurationTabIdx={this.setDurationTabIdx}
                        duration_tab_idx={this.state.duration_tab_idx}
                        setAmountTabIdx={this.setAmountTabIdx}
                        amount_tab_idx={this.state.amount_tab_idx}
                        // amount
                        setSelectedAmount={this.setSelectedAmount}
                        stake_value={this.state.stake_value}
                        payout_value={this.state.payout_value}
                        duration_unit={this.props.duration_unit}
                        duration_value={this.props.duration}
                        duration_units_list={duration_units_list}
                        // duration
                        setSelectedDuration={this.setSelectedDuration}
                        t_duration={this.state.t_duration}
                        s_duration={this.state.s_duration}
                        m_duration={this.state.m_duration}
                        h_duration={this.state.h_duration}
                        d_duration={this.state.d_duration}
                    />
                </Div100vhContainer>
            </Modal>
        );
    }
}

export default connect(({ client, modules, ui }) => ({
    amount: modules.trade.amount,
    form_components: modules.trade.form_components,
    currency: client.currency,
    duration: modules.trade.duration,
    duration_unit: modules.trade.duration_unit,
    duration_units_list: modules.trade.duration_units_list,
    expiry_type: modules.trade.expiry_type,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
}))(TradeParamsModal);

const TradeParamsMobile = ({
    currency,
    toggleModal,
    isVisible,
    setAmountTabIdx,
    amount_tab_idx,
    setTradeParamTabIdx,
    trade_param_tab_idx,
    setDurationTabIdx,
    duration_unit,
    duration_units_list,
    duration_value,
    duration_tab_idx,
    // amount
    setSelectedAmount,
    stake_value,
    payout_value,
    // duration
    setSelectedDuration,
    t_duration,
    s_duration,
    m_duration,
    h_duration,
    d_duration,
}) => {
    const getDurationText = () => {
        const duration = duration_units_list.find(d => d.value === duration_unit);
        return `${duration_value} ${duration && duration.text}`;
    };

    const getAmountText = () => {
        return <Money currency={currency} amount={amount_tab_idx === 1 ? payout_value : stake_value} />;
    };

    const getHeaderContent = tab_key => {
        switch (tab_key) {
            case 'duration':
                return (
                    <div className='trade-params__header'>
                        <div className='trade-params__header-label'>{localize('Duration')}</div>
                        <div className='trade-params__header-value'>{getDurationText()}</div>
                    </div>
                );
            case 'amount':
                return (
                    <div className='trade-params__header'>
                        <div className='trade-params__header-label'>{localize('Amount')}</div>
                        <div className='trade-params__header-value'>{getAmountText()}</div>
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <Tabs
            active_index={trade_param_tab_idx}
            className='trade-params-duration-amount'
            onTabItemClick={setTradeParamTabIdx}
            top
        >
            {isVisible('duration') && (
                <div header_content={getHeaderContent('duration')}>
                    <DurationMobile
                        toggleModal={toggleModal}
                        amount_tab_idx={amount_tab_idx}
                        duration_tab_idx={duration_tab_idx}
                        setDurationTabIdx={setDurationTabIdx}
                        setSelectedDuration={setSelectedDuration}
                        t_duration={t_duration}
                        s_duration={s_duration}
                        m_duration={m_duration}
                        h_duration={h_duration}
                        d_duration={d_duration}
                        stake_value={stake_value}
                        payout_value={payout_value}
                    />
                </div>
            )}
            {isVisible('amount') && (
                <div header_content={getHeaderContent('amount')}>
                    <AmountMobile
                        duration_unit={duration_unit}
                        duration_value={duration_value}
                        toggleModal={toggleModal}
                        amount_tab_idx={amount_tab_idx}
                        setAmountTabIdx={setAmountTabIdx}
                        setSelectedAmount={setSelectedAmount}
                        stake_value={stake_value}
                        payout_value={payout_value}
                    />
                </div>
            )}
        </Tabs>
    );
};

export const LastDigitMobile = connect(({ modules }) => ({
    form_components: modules.trade.form_components,
}))(({ form_components }) => form_components.includes('last_digit') && <LastDigit />);
