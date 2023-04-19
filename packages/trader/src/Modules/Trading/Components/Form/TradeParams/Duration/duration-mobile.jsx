import React from 'react';
import { Tabs, TickPicker, Numpad, RelativeDatepicker } from '@deriv/components';
import { isEmptyObject, addComma, getDurationMinMaxValues } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const submit_label = localize('OK');

const updateAmountChanges = (obj, stake_value, payout_value, basis, trade_basis, trade_amount) => {
    // TODO: Move onChangeMultiple outside of duration and amount
    //  and unify all trade parameter components to use same onMultipleChange func onSubmit
    // Checks if Amount tab was changed to stake and stake value was updated
    if (basis === 'stake' && stake_value !== trade_amount) {
        obj.basis = 'stake';
        obj.amount = stake_value;
        // Checks if Amount tab was changed to payout and payout value was updated
    } else if (basis === 'payout' && payout_value !== trade_amount) {
        obj.basis = 'payout';
        obj.amount = payout_value;
        // Checks if Amount tab was changed but payout or stake value was not updated
    } else if (trade_basis !== basis) {
        obj.basis = basis;
        obj.amount = trade_amount;
    }
};

const Ticks = observer(
    ({
        setDurationError,
        basis_option,
        toggleModal,
        has_amount_error,
        payout_value,
        stake_value,
        selected_duration,
        setSelectedDuration,
    }) => {
        const {
            duration_min_max,
            duration: trade_duration,
            duration_unit: trade_duration_unit,
            basis: trade_basis,
            amount: trade_amount,
            onChangeMultiple,
        } = useTraderStore();
        React.useEffect(() => {
            setDurationError(false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const [min_tick, max_tick] = getDurationMinMaxValues(duration_min_max, 'tick', 't');

        const setTickDuration = value => {
            const { value: duration } = value.target;
            const on_change_obj = {};

            // check for any amount changes from Amount trade params tab before submitting onChange object
            if (!has_amount_error)
                updateAmountChanges(on_change_obj, stake_value, payout_value, basis_option, trade_basis, trade_amount);

            if (trade_duration !== duration || trade_duration_unit !== 't') {
                on_change_obj.duration_unit = 't';
                on_change_obj.duration = duration;
            }

            if (!isEmptyObject(on_change_obj)) onChangeMultiple(on_change_obj);
            toggleModal();
        };

        const onTickChange = tick => setSelectedDuration('t', tick);
        const tick_duration = trade_duration < min_tick && selected_duration < min_tick ? min_tick : selected_duration;
        return (
            <div className='trade-params__duration-tickpicker'>
                <TickPicker
                    default_value={tick_duration}
                    submit_label={submit_label}
                    max_value={max_tick}
                    min_value={min_tick}
                    onSubmit={setTickDuration}
                    onValueChange={onTickChange}
                    singular_label={localize('Tick')}
                    plural_label={localize('Ticks')}
                />
            </div>
        );
    }
);

const Numbers = observer(
    ({
        setDurationError,
        basis_option,
        toggleModal,
        duration_unit_option,
        has_amount_error,
        contract_expiry = 'intraday',
        payout_value,
        stake_value,
        selected_duration,
        setSelectedDuration,
    }) => {
        const { ui } = useStore();
        const { addToast } = ui;
        const {
            duration_min_max,
            duration: trade_duration,
            duration_unit: trade_duration_unit,
            basis: trade_basis,
            amount: trade_amount,
            onChangeMultiple,
        } = useTraderStore();
        const { value: duration_unit } = duration_unit_option;
        const [min, max] = getDurationMinMaxValues(duration_min_max, contract_expiry, duration_unit);

        const validateDuration = value => {
            const localized_message = (
                <Localize
                    i18n_default_text='Should be between {{min}} and {{max}}'
                    values={{
                        min,
                        max: addComma(max, 0, false),
                    }}
                />
            );
            if (parseInt(value) < min || parseInt(selected_duration) > max) {
                addToast({ key: 'duration_error', content: localized_message, type: 'error', timeout: 2000 });
                setDurationError(true);
                return 'error';
            } else if (parseInt(value) > max) {
                addToast({ key: 'duration_error', content: localized_message, type: 'error', timeout: 2000 });
                return 'error';
            } else if (value.toString().length < 1) {
                addToast({ key: 'duration_error', content: localized_message, type: 'error', timeout: 2000 });
                setDurationError(true);
                return false;
            }

            setDurationError(false);
            return true;
        };

        const setDuration = duration => {
            const on_change_obj = {};

            // check for any amount changes from Amount trade params tab before submitting onChange object
            if (!has_amount_error)
                updateAmountChanges(on_change_obj, stake_value, payout_value, basis_option, trade_basis, trade_amount);

            if (trade_duration !== duration || trade_duration_unit !== duration_unit) {
                on_change_obj.duration_unit = duration_unit;
                on_change_obj.duration = duration;
                on_change_obj.expiry_type = 'duration';
            }

            if (!isEmptyObject(on_change_obj)) onChangeMultiple(on_change_obj);
            toggleModal();
        };

        const onNumberChange = num => {
            setSelectedDuration(duration_unit, num);
            validateDuration(num);
        };

        return (
            <div className='trade-params__amount-keypad'>
                <Numpad
                    value={selected_duration}
                    onSubmit={setDuration}
                    render={({ value: v, className }) => {
                        return <div className={className}>{v}</div>;
                    }}
                    pip_size={0}
                    submit_label={submit_label}
                    min={min}
                    max={max}
                    reset_press_interval={350}
                    reset_value=''
                    onValidate={validateDuration}
                    onValueChange={onNumberChange}
                />
            </div>
        );
    }
);

const Duration = observer(
    ({
        amount_tab_idx,
        toggleModal,
        duration_tab_idx,
        has_amount_error,
        setDurationTabIdx,
        setDurationError,
        t_duration,
        s_duration,
        m_duration,
        h_duration,
        d_duration,
        setSelectedDuration,
        stake_value,
        payout_value,
    }) => {
        const { duration_units_list, duration_min_max, duration_unit, basis: trade_basis } = useTraderStore();
        const duration_values = {
            t_duration,
            s_duration,
            m_duration,
            h_duration,
            d_duration,
        };
        const has_selected_tab_idx = typeof duration_tab_idx !== 'undefined';
        const active_index = has_selected_tab_idx
            ? duration_tab_idx
            : duration_units_list.findIndex(d => d.value === duration_unit);
        const [min, max] = getDurationMinMaxValues(duration_min_max, 'daily', 'd');
        const handleRelativeChange = date => {
            setSelectedDuration('d', date);
        };
        const selected_basis_option = () => {
            if (amount_tab_idx === 0) {
                return 'stake';
            } else if (amount_tab_idx === 1) {
                return 'payout';
            }
            return trade_basis;
        };

        const onTabChange = index => {
            setDurationTabIdx(index);
            const { value: unit } = duration_units_list[index];
            setSelectedDuration(unit, duration_values[`${unit}_duration`]);
        };

        return (
            <div>
                <Tabs active_index={active_index} onTabItemClick={num => onTabChange(num)} single_tab_has_no_label top>
                    {duration_units_list.map(duration_unit_option => {
                        switch (duration_unit_option.value) {
                            case 't':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <Ticks
                                            basis_option={selected_basis_option()}
                                            has_amount_error={has_amount_error}
                                            toggleModal={toggleModal}
                                            selected_duration={t_duration}
                                            setDurationError={setDurationError}
                                            setSelectedDuration={setSelectedDuration}
                                            stake_value={stake_value}
                                            payout_value={payout_value}
                                        />
                                    </div>
                                );
                            case 's':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <Numbers
                                            basis_option={selected_basis_option()}
                                            has_amount_error={has_amount_error}
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            selected_duration={s_duration}
                                            setDurationError={setDurationError}
                                            setSelectedDuration={setSelectedDuration}
                                            stake_value={stake_value}
                                            payout_value={payout_value}
                                        />
                                    </div>
                                );
                            case 'm':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <Numbers
                                            basis_option={selected_basis_option()}
                                            has_amount_error={has_amount_error}
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            selected_duration={m_duration}
                                            setDurationError={setDurationError}
                                            setSelectedDuration={setSelectedDuration}
                                            stake_value={stake_value}
                                            payout_value={payout_value}
                                        />
                                    </div>
                                );
                            case 'h':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <Numbers
                                            basis_option={selected_basis_option()}
                                            has_amount_error={has_amount_error}
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            selected_duration={h_duration}
                                            setDurationError={setDurationError}
                                            setSelectedDuration={setSelectedDuration}
                                            stake_value={stake_value}
                                            payout_value={payout_value}
                                        />
                                    </div>
                                );
                            case 'd':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <Numbers
                                            basis_option={selected_basis_option()}
                                            has_amount_error={has_amount_error}
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            contract_expiry='daily'
                                            selected_duration={d_duration}
                                            setDurationError={setDurationError}
                                            setSelectedDuration={setSelectedDuration}
                                            stake_value={stake_value}
                                            payout_value={payout_value}
                                        />
                                        <RelativeDatepicker
                                            onChange={handleRelativeChange}
                                            min_date={min}
                                            max_date={max}
                                            title={localize('Pick an end date')}
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

export default Duration;
