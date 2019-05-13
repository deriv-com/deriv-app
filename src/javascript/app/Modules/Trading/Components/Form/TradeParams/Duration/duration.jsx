import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React, { Fragment }            from 'react';
import { localize }                   from '_common/localize';
import Fieldset                       from 'App/Components/Form/fieldset.jsx';
import RangeSlider                    from 'App/Components/Form/RangeSlider';
import { convertDurationLimit }       from 'Stores/Modules/Trading/Helpers/duration';
import { toMoment }                   from 'Utils/Date';
import DurationToggle                 from './duration-toggle.jsx';
import AdvancedDuration               from './advanced-duration.jsx';
import SimpleDuration                 from './simple-duration.jsx';

const Duration = ({
    advanced_duration_unit,
    advanced_expiry_type,
    contract_expiry_type,
    duration,
    duration_unit,
    duration_units_list,
    duration_min_max,
    duration_t,
    expiry_date,
    expiry_time,
    expiry_type,
    getDurationFromUnit,
    hasDurationUnit,
    is_advanced_duration,
    is_minimized,
    onChange,
    onChangeUiStore,
    onChangeMultiple,
    simple_duration_unit,
    server_time,
    start_date,
    validation_errors,
    market_open_times,
}) => {
    const expiry_list = [
        { text: localize('Duration'), value: 'duration' },
    ];

    const has_end_time = expiry_list.find(expiry => expiry.value === 'endtime');
    if (duration_units_list.length === 1 && duration_unit === 't') {
        if (has_end_time) {
            expiry_list.pop(); // remove end time for contracts with only tick duration
        }
    } else if (!has_end_time) {
        expiry_list.push({ text: localize('End time'), value: 'endtime' });
    }

    if (is_minimized) {
        const moment_expiry = toMoment(expiry_date);
        const duration_unit_text = (duration_units_list.find(o => o.value === duration_unit) || {}).text;
        return (
            <div className='fieldset-minimized fieldset-minimized__duration'>
                {expiry_type === 'duration'
                    ? `${duration} ${duration_unit_text}`
                    : `${moment_expiry.format('ddd - DD MMM, YYYY')}\n${expiry_time}`
                }
            </div>
        );
    }

    const changeDurationUnit = ({ target }) => {
        const { name, value } = target;
        const duration_value  = getDurationFromUnit(value);

        onChangeUiStore({ name, value });
        onChangeMultiple({
            duration_unit: value,
            duration     : duration_value,
        });
    };

    const changeDurationValue = ({ target }) => {
        const { name, value } = target;
        const duration_name   = `duration_${is_advanced_duration ? advanced_duration_unit : simple_duration_unit}`;

        onChangeUiStore({ name: duration_name, value });
        onChange({ target: { name, value } });
    };

    const onToggleDurationType = ({ target }) => {
        const { name, value } = target;
        onChangeUiStore({ name, value });

        // replace selected duration unit and duration if the contract doesn't have that duration unit
        let current_duration_unit = value ? advanced_duration_unit : simple_duration_unit;
        if (!hasDurationUnit(current_duration_unit)) {
            current_duration_unit = duration_units_list[0].value;
            onChangeUiStore({ name: `${value ? 'advanced' : 'simple'}_duration_unit`, value: current_duration_unit });
        }

        const duration_value         = getDurationFromUnit(current_duration_unit);
        const new_trade_store_values = {
            duration_unit: current_duration_unit,
            duration     : duration_value,
        };

        // simple only has expiry type of duration
        if (!value && expiry_type !== 'duration') {
            new_trade_store_values.expiry_type = 'duration';
        }

        if (value && expiry_type !== advanced_expiry_type) {
            new_trade_store_values.expiry_type = advanced_expiry_type;
        }

        onChangeMultiple({ ...new_trade_store_values });
    };

    let max_value, min_value;
    if (duration_min_max[contract_expiry_type]) {
        max_value = convertDurationLimit(+duration_min_max[contract_expiry_type].max, duration_unit);
        min_value = convertDurationLimit(+duration_min_max[contract_expiry_type].min, duration_unit);
    }

    const props = {
        shared_input: {
            max_value,
            min_value,
            onChange: changeDurationValue,
        },
        number_input: {
            type            : 'number',
            is_incrementable: true,
            error_messages  : validation_errors.duration || [],
        },
    };
    // e.g. digit contracts only has range slider - does not have toggle between advanced / simple
    const has_toggle = expiry_list.length > 1 || duration_units_list.length > 1;

    return (
        <Fieldset className={classNames('trade-container__fieldset', {
            'trade-container__fieldset--advanced': is_advanced_duration,
        })}
        >
            { !has_toggle &&
                <RangeSlider
                    name='duration'
                    value={duration_t}
                    {...props.shared_input}
                />
            }
            { has_toggle &&
                <Fragment>
                    { is_advanced_duration &&
                        <AdvancedDuration
                            advanced_expiry_type={advanced_expiry_type}
                            advanced_duration_unit={advanced_duration_unit}
                            changeDurationUnit={changeDurationUnit}
                            duration_t={duration_t}
                            duration_units_list={duration_units_list}
                            expiry_date={expiry_date}
                            expiry_list={expiry_list}
                            expiry_type={expiry_type}
                            getDurationFromUnit={getDurationFromUnit}
                            market_open_times={market_open_times}
                            number_input_props={props.number_input}
                            onChange={onChange}
                            onChangeUiStore={onChangeUiStore}
                            server_time={server_time}
                            shared_input_props={props.shared_input}
                            start_date={start_date}
                        /> }
                    { !is_advanced_duration &&
                        <SimpleDuration
                            getDurationFromUnit={getDurationFromUnit}
                            changeDurationUnit={changeDurationUnit}
                            duration_t={duration_t}
                            duration_units_list={duration_units_list}
                            number_input_props={props.number_input}
                            shared_input_props={props.shared_input}
                            simple_duration_unit={simple_duration_unit}
                        /> }
                    <DurationToggle
                        name={'is_advanced_duration'}
                        onChange={onToggleDurationType}
                        value={is_advanced_duration}
                    />
                </Fragment>
            }
        </Fieldset>
    );
};

Duration.propTypes = {
    advanced_duration_unit: PropTypes.string,
    advanced_expiry_type  : PropTypes.string,
    contract_expiry_type  : PropTypes.string,
    duration              : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_min_max: PropTypes.object,
    duration_t      : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_unit      : PropTypes.string,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_date        : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    expiry_time         : PropTypes.string,
    expiry_type         : PropTypes.string,
    getDurationFromUnit : PropTypes.func,
    hasDurationUnit     : PropTypes.func,
    is_advanced_duration: PropTypes.bool,
    is_minimized        : PropTypes.bool,
    market_open_times   : PropTypes.array,
    onChange            : PropTypes.func,
    onChangeUiStore     : PropTypes.func,
    server_time         : PropTypes.object,
    simple_duration_unit: PropTypes.string,
    start_date          : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    validation_errors: PropTypes.object,
};

export default Duration;
