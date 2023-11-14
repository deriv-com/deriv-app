import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Localize, localize } from '@deriv/translations';
import { Money, Numpad, Tabs } from '@deriv/components';
import { getDecimalPlaces, isEmptyObject } from '@deriv/shared';
import MinMaxStakeInfo from './min-max-stake-info';

type TAmountMobile = Pick<
    React.ComponentProps<typeof Basis>,
    'toggleModal' | 'duration_value' | 'duration_unit' | 'has_duration_error' | 'setAmountError' | 'setSelectedAmount'
> & {
    amount_tab_idx?: number;
    setAmountTabIdx?: React.ComponentProps<typeof Tabs>['onTabItemClick'];
    stake_value: string | number;
    payout_value?: string | number;
};

type TBasis = {
    basis: string;
    duration_unit?: string;
    duration_value?: number;
    toggleModal: () => void;
    has_duration_error?: boolean;
    selected_basis?: string | number;
    setSelectedAmount: (basis: string, num: string | number) => void;
    setAmountError?: (has_error: boolean) => void;
};

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
    }: TBasis) => {
        const { ui, client } = useStore();
        const { addToast } = ui;
        const { currency } = client;
        const {
            contract_type,
            is_turbos,
            is_vanilla,
            onChangeMultiple,
            amount: trade_amount,
            basis: trade_basis,
            duration_unit: trade_duration_unit,
            duration: trade_duration,
            stake_boundary,
        } = useTraderStore();
        const { min_stake, max_stake } = stake_boundary[contract_type.toUpperCase()] || {};
        const user_currency_decimal_places = getDecimalPlaces(currency);
        const onNumberChange = (num: number | string) => {
            setSelectedAmount(basis, num);
            validateAmount(num);
        };
        const formatAmount = (value: number | string) =>
            !isNaN(+value) && value !== '' ? Number(value).toFixed(user_currency_decimal_places) : value;
        const setBasisAndAmount = (amount: number | string) => {
            const on_change_obj: Partial<ReturnType<typeof useTraderStore>> = {};

            // Check for any duration changes in Duration trade params Tab before sending onChange object
            if (duration_unit !== trade_duration_unit && !has_duration_error)
                on_change_obj.duration_unit = duration_unit;
            if (duration_value !== trade_duration && !has_duration_error) on_change_obj.duration = duration_value;

            if (amount !== trade_amount || basis !== trade_basis) {
                on_change_obj.basis = basis;
                on_change_obj.amount = +amount;
            }

            if (!isEmptyObject(on_change_obj)) onChangeMultiple(on_change_obj);
            toggleModal();
        };
        const zero_decimals = Number('0').toFixed(getDecimalPlaces(currency));
        const min_amount = parseFloat(zero_decimals.toString().replace(/.$/, '1'));

        const validateAmount = (value: number | string) => {
            const localized_message = <Localize i18n_default_text='Should not be 0 or empty' />;
            const min_max_stake_message = (
                <Localize
                    i18n_default_text='Stake must be between {{min_stake}} {{currency}} and {{max_stake}} {{currency}}'
                    values={{ min_stake, currency, max_stake }}
                />
            );
            const selected_value = parseFloat(value.toString());

            if (value.toString() === '0.' || selected_value === 0) {
                addToast({ key: 'amount_error', content: localized_message, type: 'error', timeout: 2000 });
                setAmountError?.(true);
                return 'error';
            } else if (isNaN(selected_value) || selected_value < min_amount || value.toString().length < 1) {
                addToast({ key: 'amount_error', content: localized_message, type: 'error', timeout: 2000 });
                setAmountError?.(true);
                return false;
            } else if (selected_value < Number(min_stake)) {
                addToast({ key: 'amount_error', content: min_max_stake_message, type: 'error', timeout: 2000 });
                setAmountError?.(true);
                return 'error';
            }
            setAmountError?.(false);
            return true;
        };

        return (
            <React.Fragment>
                <div className='trade-params__stake-container'>
                    {(is_turbos || is_vanilla) && (
                        <MinMaxStakeInfo currency={currency} max_stake={max_stake} min_stake={min_stake} />
                    )}
                    <div
                        className={classNames('trade-params__amount-keypad', {
                            strike__pos: is_vanilla,
                        })}
                    >
                        <Numpad
                            value={selected_basis || ''}
                            format={formatAmount}
                            onSubmit={setBasisAndAmount}
                            currency={currency}
                            min={min_amount}
                            max={max_stake}
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
    }: TAmountMobile) => {
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
