import classNames from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown, ButtonToggle, InputField } from '@deriv/components';
import { toMoment, hasIntradayDurationUnit } from '@deriv/shared';
import RangeSlider from 'App/Components/Form/RangeSlider';
import TradingDatePicker from '../../DatePicker';
import TradingTimePicker from '../../TimePicker';
import ExpiryText from './expiry-text.jsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

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
    }) => {
        const { ui } = useStore();
        const { current_focus, setCurrentFocus } = ui;
        const { contract_expiry_type, is_vanilla, validation_errors } = useTraderStore();

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

        const changeExpiry = ({ target }) => {
            const { name, value } = target;

            onChange({ target: { name: 'expiry_type', value } });
            onChangeUiStore({ name, value });
        };

        const has_error = !!validation_errors?.duration?.length;

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
                    <>
                        <div className='duration-container'>
                            {duration_units_list.length >= 1 && (
                                <Dropdown
                                    classNameDisplay='dc-dropdown__display--duration'
                                    disabled={false}
                                    id='duration'
                                    is_alignment_left
                                    is_nativepicker={false}
                                    list={duration_units_list}
                                    name='advanced_duration_unit'
                                    no_border={true}
                                    onChange={changeDurationUnit}
                                    value={advanced_duration_unit}
                                />
                            )}
                            {advanced_duration_unit === 't' && contract_expiry_type === 'tick' && (
                                <RangeSlider name='duration' ticks={10} value={duration_t} {...shared_input_props} />
                            )}
                            {advanced_duration_unit === 'd' && (
                                <TradingDatePicker
                                    id='dt_advanced_duration_datepicker'
                                    mode='duration'
                                    name='duration'
                                    is_24_hours_contract={is_24_hours_contract}
                                />
                            )}
                            {advanced_duration_unit === 'd' && is_vanilla && (
                                <ExpiryText expiry_epoch={expiry_epoch} has_error={has_error} />
                            )}
                            {advanced_duration_unit !== 't' && advanced_duration_unit !== 'd' && (
                                <InputField
                                    id='dt_advanced_duration_input'
                                    classNameInput='trade-container__input'
                                    current_focus={current_focus}
                                    error_messages={validation_errors.duration}
                                    label={duration_units_list.length === 1 ? duration_units_list[0].text : null}
                                    name='duration'
                                    setCurrentFocus={setCurrentFocus}
                                    value={getDurationFromUnit(advanced_duration_unit)}
                                    {...number_input_props}
                                    {...shared_input_props}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className={endtime_container_class}>
                            <TradingDatePicker
                                id='dt_advanced_duration_datepicker'
                                name='expiry_date'
                                is_24_hours_contract={is_24_hours_contract}
                                value={expiry_date}
                            />
                            {
                                is_24_hours_contract && <TradingTimePicker />
                                // validation_errors={validation_errors.end_time} TODO: add validation_errors for end time
                            }
                            {!is_24_hours_contract && is_vanilla && (
                                <ExpiryText expiry_epoch={expiry_epoch} />
                            )}
                        </div>
                    </>
                )}
            </>
        );
    }
);

AdvancedDuration.propTypes = {
    advanced_duration_unit: PropTypes.string,
    advanced_expiry_type: PropTypes.string,
    changeDurationUnit: PropTypes.func,
    duration_t: PropTypes.number,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    expiry_list: PropTypes.array,
    expiry_type: PropTypes.string,
    getDurationFromUnit: PropTypes.func,
    number_input_props: PropTypes.object,
    onChange: PropTypes.func,
    onChangeUiStore: PropTypes.func,
    server_time: PropTypes.object,
    shared_input_props: PropTypes.object,
    start_date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default AdvancedDuration;
