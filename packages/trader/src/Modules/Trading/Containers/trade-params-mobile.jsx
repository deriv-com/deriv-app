import 'Sass/app/modules/trading-mobile.scss';

import { Div100vhContainer, Modal, Money, Tabs, ThemedScrollbars, usePreventIOSZoom, Popover } from '@deriv/components';

import AmountMobile from 'Modules/Trading/Components/Form/TradeParams/amount-mobile.jsx';
import Barrier from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
import DurationMobile from 'Modules/Trading/Components/Form/TradeParams/Duration/duration-mobile.jsx';
import LastDigit from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { connect } from 'Stores/connect';
import { localize, Localize } from '@deriv/translations';

const DEFAULT_DURATION = Object.freeze({
    t: 5,
    s: 15,
    m: 3,
    h: 1,
    d: 1,
});

const reducer = (state, payload) => {
    return {
        ...state,
        ...payload,
    };
};

const makeGetDefaultDuration = (trade_duration, trade_duration_unit) => duration_unit =>
    trade_duration_unit === duration_unit ? trade_duration : DEFAULT_DURATION[duration_unit];

const TradeParamsModal = ({
    amount,
    duration,
    duration_unit,
    form_components,
    is_open,
    enableApp,
    disableApp,
    toggleModal,
    currency,
    duration_units_list,
    is_vanilla,
}) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getDefaultDuration = React.useCallback(makeGetDefaultDuration(duration, duration_unit), []);

    const [state, dispatch] = React.useReducer(reducer, {
        trade_param_tab_idx: 0,
        duration_tab_idx: undefined,
        amount_tab_idx: undefined,
        has_amount_error: false,
        has_duration_error: false,
        // duration unit values
        curr_duration_unit: duration_unit,
        curr_duration_value: duration,
        t_duration: getDefaultDuration('t'),
        s_duration: getDefaultDuration('s'),
        m_duration: getDefaultDuration('m'),
        h_duration: getDefaultDuration('h'),
        d_duration: getDefaultDuration('d'),
        // amount values
        stake_value: amount,
        payout_value: amount,
    });

    usePreventIOSZoom();

    React.useEffect(() => {
        setSelectedDuration(duration_unit, duration);
        setDurationTabIdx(undefined);
        // duration and duration_unit can be changed in trade-store when contract type is changed
    }, [duration, duration_unit]);

    const setTradeParamTabIdx = trade_param_tab_idx => dispatch({ trade_param_tab_idx });

    const setDurationTabIdx = duration_tab_idx => dispatch({ duration_tab_idx });

    const setAmountTabIdx = amount_tab_idx => dispatch({ amount_tab_idx });

    const setSelectedAmount = (basis, selected_basis_value) => dispatch({ [`${basis}_value`]: selected_basis_value });

    const setSelectedDuration = (selected_duration_unit, selected_duration) => {
        dispatch({
            [`${selected_duration_unit}_duration`]: selected_duration,
            curr_duration_unit: selected_duration_unit,
            curr_duration_value: selected_duration,
        });
    };

    const setAmountError = has_error => {
        dispatch({ has_amount_error: has_error });
    };
    const setDurationError = has_error => {
        dispatch({ has_duration_error: has_error });
    };

    const isVisible = component_key => form_components.includes(component_key);

    const setTooltipContent = () => {
        if (is_vanilla && state.trade_param_tab_idx === 1)
            return (
                <div className='trade-params__vanilla-ic-info-wrapper'>
                    <Popover
                        alignment='bottom'
                        icon='info'
                        id='dt_vanilla-stake__tooltip'
                        zIndex={9999}
                        is_bubble_hover_enabled
                        arrow_styles={{ top: '-9px' }}
                        message={
                            <Localize i18n_default_text='Your stake is a non-refundable one-time premium to purchase this contract. Your total profit/loss equals the contract value minus your stake.' />
                        }
                        classNameWrapper='trade-params--modal-wrapper'
                        classNameBubble='trade-params--modal-wrapper__content--vanilla'
                    />
                </div>
            );
        return null;
    };

    return (
        <React.Fragment>
            <Modal
                id='dt_trade_parameters_mobile'
                className='trade-params'
                enableApp={enableApp}
                is_open={is_open}
                header={<div />}
                disableApp={disableApp}
                toggleModal={toggleModal}
                height='auto'
                width='calc(100vw - 32px)'
                renderTitle={setTooltipContent}
            >
                <ThemedScrollbars>
                    <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='120px'>
                        <TradeParamsMobileWrapper
                            currency={currency}
                            toggleModal={toggleModal}
                            isVisible={isVisible}
                            setTradeParamTabIdx={setTradeParamTabIdx}
                            trade_param_tab_idx={state.trade_param_tab_idx}
                            setDurationTabIdx={setDurationTabIdx}
                            duration_tab_idx={state.duration_tab_idx}
                            setAmountTabIdx={setAmountTabIdx}
                            amount_tab_idx={state.amount_tab_idx}
                            // amount
                            setSelectedAmount={setSelectedAmount}
                            stake_value={state.stake_value}
                            payout_value={state.payout_value}
                            duration_unit={state.curr_duration_unit}
                            duration_value={state.curr_duration_value}
                            duration_units_list={duration_units_list}
                            has_amount_error={state.has_amount_error}
                            setAmountError={setAmountError}
                            // duration
                            setSelectedDuration={setSelectedDuration}
                            has_duration_error={state.has_duration_error}
                            setDurationError={setDurationError}
                            t_duration={state.t_duration}
                            s_duration={state.s_duration}
                            m_duration={state.m_duration}
                            h_duration={state.h_duration}
                            d_duration={state.d_duration}
                        />
                    </Div100vhContainer>
                </ThemedScrollbars>
            </Modal>
        </React.Fragment>
    );
};

TradeParamsModal.propTypes = {
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration_unit: PropTypes.string,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    form_components: MobxPropTypes.arrayOrObservableArray,
    is_open: PropTypes.bool,
    is_vanilla: PropTypes.bool,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    toggleModal: PropTypes.func,
    currency: PropTypes.string,
};

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
    is_vanilla: modules.trade.is_vanilla,
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
    has_amount_error,
    has_duration_error,
    is_vanilla,
    // amount
    setAmountError,
    setSelectedAmount,
    stake_value,
    payout_value,
    // duration
    setDurationError,
    setSelectedDuration,
    t_duration,
    s_duration,
    m_duration,
    h_duration,
    d_duration,
    // basis
    basis_list,
    basis,
}) => {
    const getDurationText = () => {
        const duration = duration_units_list.find(d => d.value === duration_unit);
        return `${duration_value} ${
            duration && (duration_value > 1 ? localize(duration.text) : localize(duration.text.slice(0, -1)))
        }`;
    };

    const getAmountText = () => {
        const has_selected_tab_idx = typeof amount_tab_idx !== 'undefined';
        const active_index = has_selected_tab_idx ? amount_tab_idx : basis_list.findIndex(b => b.value === basis);

        return <Money currency={currency} show_currency amount={active_index === 1 ? payout_value : stake_value} />;
    };

    const getHeaderContent = tab_key => {
        switch (tab_key) {
            case 'duration':
                return (
                    <div className='trade-params__header'>
                        <div className='trade-params__header-label'>{localize('Duration')}</div>
                        <div
                            className={classNames('trade-params__header-value', {
                                'trade-params__header-value--has-error': has_duration_error,
                            })}
                        >
                            {has_duration_error ? localize('Error') : getDurationText()}
                        </div>
                    </div>
                );
            case 'amount':
                return (
                    <div className='trade-params__header'>
                        <div className='trade-params__header-label'>
                            {is_vanilla ? localize('Stake') : localize('Amount')}
                        </div>
                        <div
                            className={classNames('trade-params__header-value', {
                                'trade-params__header-value--has-error': has_amount_error,
                            })}
                        >
                            {has_amount_error ? localize('Error') : getAmountText()}
                        </div>
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
                        setDurationError={setDurationError}
                        has_amount_error={has_amount_error}
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
                        has_duration_error={has_duration_error}
                        setSelectedAmount={setSelectedAmount}
                        setAmountError={setAmountError}
                        stake_value={stake_value}
                        payout_value={payout_value}
                    />
                </div>
            )}
        </Tabs>
    );
};

const TradeParamsMobileWrapper = connect(({ modules }) => ({
    basis_list: modules.trade.basis_list,
    basis: modules.trade.basis,
    is_vanilla: modules.trade.is_vanilla,
}))(TradeParamsMobile);

export const LastDigitMobile = connect(({ modules }) => ({
    form_components: modules.trade.form_components,
}))(({ form_components }) => form_components.includes('last_digit') && <LastDigit />);

export const BarrierMobile = connect(({ modules }) => ({
    form_components: modules.trade.form_components,
}))(({ form_components }) => form_components.includes('barrier') && <Barrier />);
