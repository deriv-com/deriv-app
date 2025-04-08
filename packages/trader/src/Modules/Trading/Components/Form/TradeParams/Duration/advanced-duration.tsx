import classNames from 'classnames';
import React from 'react';
import { Dropdown, ButtonToggle, InputField } from '@deriv/components';
import { getDurationMinMaxValues, getUnitMap, hasIntradayDurationUnit, toMoment, getTomorrowDate } from '@deriv/shared';
import RangeSlider from 'App/Components/Form/RangeSlider';
import TradingDatePicker from '../../DatePicker';
import TradingTimePicker from '../../TimePicker';
import ExpiryText from './expiry-text';
import DurationRangeText from './duration-range-text';
import type { TDuration } from './duration';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

type TAdvancedDuration = Pick<
    TDuration,
    | 'advanced_duration_unit'
    | 'advanced_expiry_type'
    | 'duration_t'
    | 'duration_units_list'
    | 'expiry_date'
    | 'expiry_epoch'
    | 'expiry_type'
    | 'getDurationFromUnit'
    | 'onChange'
    | 'onChangeUiStore'
    | 'server_time'
    | 'start_date'
> & {
    changeDurationUnit: ({ target }: { target: { name: string; value: string } }) => void;
    expiry_list: {
        text: string;
        value: string;
    }[];
    number_input_props: {
        type: string;
        is_incrementable: boolean;
    };
    shared_input_props: {
        is_hj_whitelisted: boolean;
        onChange: ({
            target,
        }: {
            target: {
                name: string;
                value: string | number;
            };
        }) => void;
        max_value: number;
        min_value: number;
    };
};

const AdvancedDuration = observer(
    ({
        advanced_duration_unit,
        advanced_expiry_type,
        changeDurationUnit,
        duration_t,
        duration_units_list,
        expiry_date,
        expiry_epoch,
        expiry_list,
        expiry_type,
        getDurationFromUnit,
        number_input_props,
        onChange,
        onChangeUiStore,
        server_time,
        shared_input_props,
        start_date,
    }: TAdvancedDuration) => {
        const { ui } = useStore();
        const { current_focus, setCurrentFocus } = ui;
        const { contract_expiry_type, duration_min_max, validation_errors, onChangeMultiple } = useTraderStore();

        const [min, max] = getDurationMinMaxValues(duration_min_max, contract_expiry_type, advanced_duration_unit);
        let is_24_hours_contract = false;

        if (expiry_type === 'endtime') {
            const has_intraday_duration_unit = hasIntradayDurationUnit(duration_units_list);
            is_24_hours_contract =
                (!!start_date || toMoment(expiry_date || server_time).isSame(toMoment(server_time), 'day')) &&
                has_intraday_duration_unit;
        }

        const endtime_container_class = classNames('endtime-container', {
            'has-time': is_24_hours_contract,
        });

        const changeExpiry = ({ target }: { target: { name: string; value: unknown } }) => {
            const { name, value } = target;

            if (value === 'endtime') {
                // Set expiry date to tomorrow when switching to end time
                onChangeMultiple({
                    expiry_date: getTomorrowDate(server_time),
                    expiry_type: value,
                });
            } else {
                onChange({ target: { name: 'expiry_type', value } });
            }

            onChangeUiStore({ name, value });
        };

        const has_error = !!validation_errors?.duration?.length;

        const { name_plural, name } = getUnitMap()[advanced_duration_unit];
        const duration_unit_text = name_plural ?? name;

        React.useEffect(() => {
            if (expiry_type === 'endtime') {
                // Set expiry date to tomorrow when switching to end time
                onChange({ target: { name: 'expiry_date', value: getTomorrowDate(server_time) } });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <>
                {expiry_list.length > 1 && (
                    <ButtonToggle
                        id='dt_advanced_duration_toggle'
                        buttons_arr={expiry_list}
                        name='advanced_expiry_type'
                        is_animated={true}
                        onChange={changeExpiry}
                        value={advanced_expiry_type}
                    />
                )}
                {expiry_type === 'duration' ? (
                    <div className='duration-container'>
                        {duration_units_list.length >= 1 && (
                            <Dropdown
                                classNameDisplay='dc-dropdown__display--duration'
                                disabled={false}
                                is_alignment_left
                                is_nativepicker={false}
                                list={duration_units_list}
                                name='advanced_duration_unit'
                                no_border
                                onChange={changeDurationUnit}
                                value={advanced_duration_unit}
                            />
                        )}
                        {advanced_duration_unit === 't' && contract_expiry_type === 'tick' && (
                            <RangeSlider name='duration' value={duration_t} {...shared_input_props} />
                        )}
                        {advanced_duration_unit === 'd' && (
                            <TradingDatePicker
                                id='dt_advanced_duration_datepicker'
                                mode='duration'
                                name='duration'
                                is_24_hours_contract={is_24_hours_contract}
                            />
                        )}
                        {advanced_duration_unit !== 't' && advanced_duration_unit !== 'd' && (
                            <InputField
                                id='dt_advanced_duration_input'
                                classNameInput='trade-container__input'
                                current_focus={current_focus}
                                error_messages={validation_errors.duration}
                                label={duration_units_list.length === 1 ? duration_units_list[0].text : undefined}
                                name='duration'
                                setCurrentFocus={setCurrentFocus}
                                value={getDurationFromUnit(advanced_duration_unit)}
                                {...number_input_props}
                                {...shared_input_props}
                            />
                        )}
                        {advanced_duration_unit !== 't' && (
                            <DurationRangeText min={min} max={max} duration_unit_text={duration_unit_text} />
                        )}
                        {advanced_duration_unit === 'd' && (
                            <ExpiryText expiry_epoch={Number(expiry_epoch)} has_error={has_error} />
                        )}
                    </div>
                ) : (
                    <div className={endtime_container_class}>
                        <TradingDatePicker
                            id='dt_advanced_duration_datepicker'
                            name='expiry_date'
                            is_24_hours_contract={is_24_hours_contract}
                        />
                        {
                            is_24_hours_contract && <TradingTimePicker />
                            // validation_errors={validation_errors.end_time} TODO: add validation_errors for end time
                        }
                        {!is_24_hours_contract && <ExpiryText expiry_epoch={Number(expiry_epoch)} />}
                    </div>
                )}
            </>
        );
    }
);

export default AdvancedDuration;
