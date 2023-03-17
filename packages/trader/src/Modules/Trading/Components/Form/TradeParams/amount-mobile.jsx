import React from 'react';
import { Tabs, Money, Numpad } from '@deriv/components';
import { isEmptyObject, getDecimalPlaces } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import TurbosInfo from './Turbos/turbos-info';

import { connect } from 'Stores/connect';

const Basis = ({
    addToast,
    basis,
    currency,
    duration_unit,
    duration_value,
    has_duration_error,
    is_turbos,
    onChangeMultiple,
    selected_basis,
    setSelectedAmount,
    setAmountError,
    trade_amount,
    trade_basis,
    trade_duration,
    trade_duration_unit,
    toggleModal,
}) => {
    const user_currency_decimal_places = getDecimalPlaces(currency);
    const onNumberChange = num => {
        setSelectedAmount(basis, num);
        validateAmount(num);
    };
    const formatAmount = value =>
        !isNaN(value) && value !== '' ? Number(value).toFixed(user_currency_decimal_places) : value;
    const setBasisAndAmount = amount => {
        const on_change_obj = {};

        // Check for any duration changes in Duration trade params Tab before sending onChange object
        if (duration_unit !== trade_duration_unit && !has_duration_error) on_change_obj.duration_unit = duration_unit;
        if (duration_value !== trade_duration && !has_duration_error) on_change_obj.duration = duration_value;

        if (amount !== trade_amount || basis !== trade_basis) {
            on_change_obj.basis = basis;
            on_change_obj.amount = amount;
        }

        if (!isEmptyObject(on_change_obj)) onChangeMultiple(on_change_obj);
        toggleModal();
    };
    const zero_decimals = Number('0').toFixed(getDecimalPlaces(currency));
    const min_amount = parseFloat(zero_decimals.toString().replace(/.$/, '1'));

    const validateAmount = value => {
        const localized_message = <Localize i18n_default_text='Should not be 0 or empty' />;
        const selected_value = parseFloat(value.toString());

        if (value.toString() === '0.' || selected_value === 0) {
            addToast({ key: 'amount_error', content: localized_message, type: 'error', timeout: 2000 });
            setAmountError(true);
            return 'error';
        } else if (isNaN(selected_value) || selected_value < min_amount || value.toString().length < 1) {
            addToast({ key: 'amount_error', content: localized_message, type: 'error', timeout: 2000 });
            setAmountError(true);
            return false;
        }
        setAmountError(false);
        return true;
    };

    return (
        <React.Fragment>
            {is_turbos && (
                <div className='trade-params__stake-container'>
                    <TurbosInfo className='trade-container__turbos-trade-info' />
                </div>
            )}
            <div className='trade-params__amount-keypad'>
                <Numpad
                    value={selected_basis}
                    format={formatAmount}
                    onSubmit={setBasisAndAmount}
                    currency={currency}
                    min={min_amount}
                    is_currency
                    render={({ value, className }) => {
                        return (
                            <div className={className}>
                                {parseFloat(value) > 0 ? (
                                    <Money currency={currency} amount={value} should_format={false} />
                                ) : (
                                    value
                                )}
                            </div>
                        );
                    }}
                    reset_press_interval={450}
                    reset_value=''
                    pip_size={user_currency_decimal_places}
                    onValidate={validateAmount}
                    submit_label={localize('OK')}
                    onValueChange={onNumberChange}
                />
            </div>
        </React.Fragment>
    );
};

const AmountWrapper = connect(({ modules, client, ui }) => ({
    addToast: ui.addToast,
    currency: client.currency,
    is_turbos: modules.trade.is_turbos,
    onChangeMultiple: modules.trade.onChangeMultiple,
    trade_amount: modules.trade.amount,
    trade_basis: modules.trade.basis,
    trade_duration_unit: modules.trade.duration_unit,
    trade_duration: modules.trade.duration,
}))(Basis);

const Amount = ({
    toggleModal,
    basis_list,
    basis,
    duration_value,
    duration_unit,
    has_duration_error,
    amount_tab_idx,
    setAmountError,
    setAmountTabIdx,
    setSelectedAmount,
    stake_value,
    payout_value,
}) => {
    const has_selected_tab_idx = typeof amount_tab_idx !== 'undefined';
    const active_index = has_selected_tab_idx ? amount_tab_idx : basis_list.findIndex(b => b.value === basis);

    if (basis_list.length === 1) {
        return (
            <AmountWrapper
                toggleModal={toggleModal}
                duration_value={duration_value}
                duration_unit={duration_unit}
                has_duration_error={has_duration_error}
                basis={basis_list[0].value}
                setAmountError={setAmountError}
                selected_basis={basis_list[0].value === 'stake' ? stake_value : payout_value}
                setSelectedAmount={setSelectedAmount}
            />
        );
    }

    return (
        <div>
            <Tabs active_index={active_index} onTabItemClick={setAmountTabIdx} top>
                {basis_list.map(basis_option => {
                    switch (basis_option.value) {
                        case 'stake':
                            return (
                                <div label={basis_option.text} key={basis_option.value}>
                                    <AmountWrapper
                                        toggleModal={toggleModal}
                                        duration_value={duration_value}
                                        duration_unit={duration_unit}
                                        has_duration_error={has_duration_error}
                                        basis={basis_option.value}
                                        setAmountError={setAmountError}
                                        selected_basis={stake_value}
                                        setSelectedAmount={setSelectedAmount}
                                    />
                                </div>
                            );
                        case 'payout':
                            return (
                                <div label={basis_option.text} key={basis_option.value}>
                                    <AmountWrapper
                                        toggleModal={toggleModal}
                                        duration_value={duration_value}
                                        duration_unit={duration_unit}
                                        has_duration_error={has_duration_error}
                                        basis={basis_option.value}
                                        setAmountError={setAmountError}
                                        selected_basis={payout_value}
                                        setSelectedAmount={setSelectedAmount}
                                    />
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </Tabs>
        </div>
    );
};

export default connect(({ modules }) => ({
    basis: modules.trade.basis,
    basis_list: modules.trade.basis_list,
    onChangeMultiple: modules.trade.onChangeMultiple,
}))(Amount);
