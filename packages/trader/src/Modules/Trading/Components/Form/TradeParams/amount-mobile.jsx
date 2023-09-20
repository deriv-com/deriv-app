import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Localize, localize } from '@deriv/translations';
import { Money, Numpad, Tabs } from '@deriv/components';
import { getDecimalPlaces, isEmptyObject } from '@deriv/shared';
import MinMaxStakeInfo from './min-max-stake-info';

const Basis = observer(
    ({
        basis,
        duration_unit,
        duration_value,
        toggleModal,
        has_duration_error,
        selected_basis,
        setSelectedAmount,
        setAmountError,
    }) => {
        const { ui, client } = useStore();
        const { addToast } = ui;
        const { currency } = client;
        const {
            is_turbos,
            is_vanilla,
            onChangeMultiple,
            trade_amount,
            trade_basis,
            trade_duration_unit,
            trade_duration,
            contract_type,
        } = useTraderStore();
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
            if (duration_unit !== trade_duration_unit && !has_duration_error)
                on_change_obj.duration_unit = duration_unit;
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
                <div className='trade-params__stake-container'>
                    {(is_turbos || is_vanilla) && <MinMaxStakeInfo />}
                    <div
                        className={classNames('trade-params__amount-keypad', {
                            strike__pos: contract_type === 'vanilla',
                        })}
                    >
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
                </div>
            </React.Fragment>
        );
    }
);

const Amount = observer(
    ({
        toggleModal,
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
        const { basis, basis_list } = useTraderStore();
        const has_selected_tab_idx = typeof amount_tab_idx !== 'undefined';
        const active_index = has_selected_tab_idx ? amount_tab_idx : basis_list.findIndex(b => b.value === basis);

        if (basis_list.length === 1) {
            return (
                <Basis
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
                                        <Basis
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
                                        <Basis
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
    }
);

export default Amount;
