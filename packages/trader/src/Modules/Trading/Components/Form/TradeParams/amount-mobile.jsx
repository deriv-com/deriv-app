import React from 'react';
import { Tabs, Numpad } from '@deriv/components';
import CurrencyUtils from '@deriv/shared/utils/currency';
import { connect } from 'Stores/connect';

const Basis = ({ toggleModal, basis, selected_basis, setSelectedAmount, onChangeMultiple, currency }) => {
    const user_currency_decimal_places = CurrencyUtils.getDecimalPlaces(currency);
    const onNumberChange = num => setSelectedAmount(basis, num);

    const setBasisAndAmount = amount => {
        onChangeMultiple({ basis, amount });
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
                onValueChange={onNumberChange}
            />
        </div>
    );
};

const AmountWrapper = connect(({ modules, client }) => ({
    onChangeMultiple: modules.trade.onChangeMultiple,
    currency: client.currency,
}))(Basis);

const Amount = ({
    toggleModal,
    basis_list,
    basis,
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
