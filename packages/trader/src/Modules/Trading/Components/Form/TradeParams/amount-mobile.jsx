import React from 'react';
import { Tabs, Numpad } from '@deriv/components';
import ObjectUtils from '@deriv/shared/utils/object';
import { Localize, localize } from '@deriv/translations';
import CurrencyUtils, { addComma } from '@deriv/shared/utils/currency';
import { connect } from 'Stores/connect';

const Basis = ({
    duration_unit,
    duration_value,
    toggleModal,
    basis,
    selected_basis,
    setSelectedAmount,
    onChangeMultiple,
    currency,
    trade_amount,
    trade_basis,
    trade_duration,
    trade_duration_unit,
    setToastErrorMessage,
    setToastErrorVisibility,
}) => {
    const user_currency_decimal_places = CurrencyUtils.getDecimalPlaces(currency);
    const onNumberChange = num => setSelectedAmount(basis, num);
    const formatAmount = value => (!isNaN(value) ? Number(value).toFixed(user_currency_decimal_places) : value);
    const setBasisAndAmount = amount => {
        const on_change_obj = {};

        // Check for any duration changes in Duration trade params Tab before sending onChange object
        if (duration_unit !== trade_duration_unit) on_change_obj.duration_unit = duration_unit;
        if (duration_value !== trade_duration) on_change_obj.duration = duration_value;

        if (amount !== trade_amount || basis !== trade_basis) {
            on_change_obj.basis = basis;
            on_change_obj.amount = amount;
        }

        if (!ObjectUtils.isEmptyObject(on_change_obj)) onChangeMultiple(on_change_obj);
        toggleModal();
    };
    const min = basis === 'payout' ? CurrencyUtils.getMinPayout(currency) : CurrencyUtils.getMinWithdrawal(currency);
    const max = Math.pow(10, CurrencyUtils.AMOUNT_MAX_LENGTH) - 1;
    const validateDuration = value => {
        const selected_value = parseFloat(value.toString());
        if (isNaN(selected_value) || selected_value < min || selected_value > max) {
            setToastErrorMessage(
                <Localize
                    i18n_default_text='Should be between {{min}} and {{max}}'
                    values={{
                        min,
                        max: addComma(
                            max,
                            CurrencyUtils.getDecimalPlaces(currency),
                            CurrencyUtils.isCryptocurrency(currency)
                        ),
                    }}
                />
            );
            setToastErrorVisibility(true);
            return false;
        }

        setToastErrorVisibility(false);
        return true;
    };

    return (
        <div className='trade-params__amount-keypad'>
            <Numpad
                value={selected_basis}
                format={formatAmount}
                onSubmit={setBasisAndAmount}
                currency={currency}
                is_currency
                render={({ value: v, className }) => {
                    return <div className={className}>{v}</div>;
                }}
                pip_size={user_currency_decimal_places}
                min={min}
                max={max}
                onValidate={validateDuration}
                submit_label={localize('OK')}
                onValueChange={onNumberChange}
            />
        </div>
    );
};

const AmountWrapper = connect(({ modules, client, ui }) => ({
    onChangeMultiple: modules.trade.onChangeMultiple,
    trade_amount: modules.trade.amount,
    trade_basis: modules.trade.basis,
    trade_duration_unit: modules.trade.duration_unit,
    trade_duration: modules.trade.duration,
    currency: client.currency,
    setToastErrorMessage: ui.setToastErrorMessage,
    setToastErrorVisibility: ui.setToastErrorVisibility,
}))(Basis);

const Amount = ({
    toggleModal,
    basis_list,
    basis,
    duration_value,
    duration_unit,
    amount_tab_idx,
    setAmountTabIdx,
    setSelectedAmount,
    stake_value,
    payout_value,
}) => {
    const has_selected_tab_idx = typeof amount_tab_idx !== 'undefined';
    const active_index = has_selected_tab_idx ? amount_tab_idx : basis_list.findIndex(b => b.value === basis);

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
                                        basis={basis_option.value}
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
                                        basis={basis_option.value}
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
