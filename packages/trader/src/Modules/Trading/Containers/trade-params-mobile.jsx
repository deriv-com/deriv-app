import 'Sass/app/modules/trading-mobile.scss';

import { Div100vhContainer, Modal, Money, Tabs, ThemedScrollbars, usePreventIOSZoom } from '@deriv/components';

import AmountMobile from 'Modules/Trading/Components/Form/TradeParams/amount-mobile.jsx';
import Barrier from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
import DurationMobile from 'Modules/Trading/Components/Form/TradeParams/Duration/duration-mobile.jsx';
import LastDigit from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';

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

const TradeParamsModal = observer(({ is_open, toggleModal }) => {
    const { client, ui } = useStore();
    const { currency } = client;
    const { enableApp, disableApp } = ui;
    const { amount, form_components, duration, duration_unit, duration_units_list } = useTraderStore();

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
            >
                <ThemedScrollbars>
                    <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='120px'>
                        <TradeParamsMobile
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
});

export default TradeParamsModal;

const TradeParamsMobile = observer(
    ({
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
    }) => {
        const { basis_list, basis, is_vanilla, expiry_epoch } = useTraderStore();
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
                    <div data-header-content={getHeaderContent('duration')}>
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
                            is_vanilla={is_vanilla}
                            expiry_epoch={expiry_epoch}
                        />
                    </div>
                )}
                {isVisible('amount') && (
                    <div data-header-content={getHeaderContent('amount')}>
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
    }
);

export const LastDigitMobile = observer(() => {
    const { form_components } = useTraderStore();
    return form_components.includes('last_digit') && <LastDigit />;
});

export const BarrierMobile = observer(() => {
    const { form_components } = useTraderStore();
    return form_components.includes('barrier') && <Barrier />;
});
