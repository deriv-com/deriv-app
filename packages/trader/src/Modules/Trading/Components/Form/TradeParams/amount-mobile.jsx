import React from 'react';
import { Tabs, Numpad } from '@deriv/components';
import ObjectUtils from '@deriv/shared/utils/object';
import { localize } from '@deriv/translations';
import CurrencyUtils from '@deriv/shared/utils/currency';
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
    trade_basis,
    trade_duration,
    trade_duration_unit,
}) => {
    const user_currency_decimal_places = CurrencyUtils.getDecimalPlaces(currency);
    const onNumberChange = num => setSelectedAmount(basis, num);

    const setBasisAndAmount = value => {
        const amount = !isNaN(value) ? Number(value).toFixed(user_currency_decimal_places) : value;
        const on_change_obj = {};

        // Check for any duration changes in Duration trade params Tab before sending onChange object
        if (duration_unit !== trade_duration_unit) on_change_obj.duration_unit = duration_unit;
        if (duration_value !== trade_duration) on_change_obj.duration = duration_value;

        if (selected_basis !== amount || basis !== trade_basis) {
            on_change_obj.basis = basis;
            on_change_obj.amount = amount;
        }

        if (!ObjectUtils.isEmptyObject(on_change_obj)) onChangeMultiple(on_change_obj);
        toggleModal();
    };

    return (
        <div className='trade-params__amount-keypad'>
            <Numpad
                value={selected_basis}
                onSubmit={setBasisAndAmount}
                is_currency
                render={({ value: v, className }) => {
                    return <div className={className}>{v}</div>;
                }}
                pip_size={user_currency_decimal_places}
                min={0}
                max={1000}
                submit_label={localize('OK')}
                onValueChange={onNumberChange}
            />
        </div>
    );
};

const AmountWrapper = connect(({ modules, client }) => ({
    onChangeMultiple: modules.trade.onChangeMultiple,
    trade_basis: modules.trade.basis,
    trade_duration_unit: modules.trade.duration_unit,
    trade_duration: modules.trade.duration,
    currency: client.currency,
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
