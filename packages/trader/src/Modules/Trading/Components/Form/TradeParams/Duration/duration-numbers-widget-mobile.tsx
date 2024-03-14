import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { TDurationMobile } from './duration-mobile';
import { Localize, localize } from '@deriv/translations';
import { Numpad } from '@deriv/components';
import DurationRangeText from './duration-range-text';
import ExpiryText from './expiry-text';
import { addComma, getDurationMinMaxValues, getUnitMap, isEmptyObject } from '@deriv/shared';
import moment from 'moment';
import { updateAmountChanges } from './duration-utils';
import { observer, useStore } from '@deriv/stores';

type TNumber = Pick<
    TDurationMobile,
    | 'expiry_epoch'
    | 'has_amount_error'
    | 'payout_value'
    | 'setDurationError'
    | 'setSelectedDuration'
    | 'stake_value'
    | 'toggleModal'
> & {
    basis_option: string;
    contract_expiry?: string;
    duration_unit_option: ReturnType<typeof useTraderStore>['duration_units_list'][0];
    duration_values?: Record<string, number>;
    selected_duration: number;
    show_expiry?: boolean;
};

const DurationNumbersWidgetMobile = observer(
    ({
        basis_option,
        contract_expiry = 'intraday',
        duration_unit_option,
        duration_values,
        expiry_epoch,
        has_amount_error,
        payout_value,
        selected_duration,
        setDurationError,
        setSelectedDuration,
        stake_value,
        show_expiry = false,
        toggleModal,
    }: TNumber) => {
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
        const [has_error, setHasError] = React.useState(false);
        const localized_message = (
            <Localize
                i18n_default_text='Should be between {{min}} and {{max}}'
                values={{
                    min,
                    max: addComma(max, 0, false),
                }}
            />
        );
        const validateDuration = (value: number | string) => {
            if (
                Number(value) < Number(min) ||
                Math.trunc(selected_duration) > Number(max) ||
                value.toString().length < 1
            ) {
                addToast({ key: 'duration_error', content: localized_message, type: 'error', timeout: 2000 });
                setDurationError(true);
                setHasError(true);
                return 'error';
            } else if (Number(value) > Number(max)) {
                addToast({ key: 'duration_error', content: localized_message, type: 'error', timeout: 2000 });
                setHasError(true);
                return 'error';
            }

            setDurationError(false);
            setHasError(false);
            return true;
        };

        const setDuration = (duration: string | number) => {
            const on_change_obj: Partial<ReturnType<typeof useTraderStore>> = {};
            // check for any amount changes from Amount trade params tab before submitting onChange object
            if (!has_amount_error)
                updateAmountChanges(on_change_obj, stake_value, payout_value, basis_option, trade_basis, trade_amount);

            if (trade_duration !== Number(duration) || trade_duration_unit !== duration_unit) {
                on_change_obj.duration_unit = duration_unit;
                on_change_obj.duration = Number(duration);
                on_change_obj.expiry_type = 'duration';
            }

            if (!isEmptyObject(on_change_obj)) onChangeMultiple(on_change_obj);
            toggleModal();
        };

        const setExpiryDate = (epoch: number, duration: string | number) => {
            if (trade_duration_unit !== 'd') {
                return moment.utc().add(Number(duration), 'days').format('D MMM YYYY, [23]:[59]:[59] [GMT +0]');
            }
            let expiry_date = new Date((epoch - trade_duration * 24 * 60 * 60) * 1000);
            if (duration) {
                expiry_date = new Date(expiry_date.getTime() + Number(duration) * 24 * 60 * 60 * 1000);
            }

            return expiry_date
                .toUTCString()
                .replace('GMT', 'GMT +0')
                .substring(5)
                .replace(/(\d{2}) (\w{3} \d{4})/, '$1 $2,');
        };

        const onNumberChange = (num: number | string) => {
            setSelectedDuration(duration_unit, Number(num));
            validateDuration(num);
        };

        const fixed_date = !has_error ? setExpiryDate(Number(expiry_epoch), Number(duration_values?.d_duration)) : '';

        const { name_plural, name } = getUnitMap()[duration_unit];
        const duration_unit_text = name_plural ?? name;

        return (
            <div className='trade-params__amount-keypad'>
                <div className='text-container'>
                    <DurationRangeText min={min} max={max} duration_unit_text={duration_unit_text} />
                    {show_expiry && <ExpiryText fixed_date={fixed_date} />}
                </div>
                <Numpad
                    value={selected_duration}
                    onSubmit={setDuration}
                    render={({ value: v, className }) => {
                        return <div className={className}>{v}</div>;
                    }}
                    pip_size={0}
                    submit_label={localize('OK')}
                    min={Number(min)}
                    max={Number(max)}
                    reset_press_interval={350}
                    reset_value=''
                    onValidate={validateDuration}
                    onValueChange={onNumberChange}
                />
            </div>
        );
    }
);

export default DurationNumbersWidgetMobile;
