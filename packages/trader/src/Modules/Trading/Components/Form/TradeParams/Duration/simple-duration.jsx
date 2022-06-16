import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { ButtonToggle, InputField } from '@deriv/components';
import RangeSlider from 'App/Components/Form/RangeSlider';
import { connect } from 'Stores/connect';
import TradingDatePicker from '../../DatePicker';

const SimpleDuration = ({
    contract_expiry_type,
    changeDurationUnit,
    current_focus,
    duration_t,
    duration_units_list,
    getDurationFromUnit,
    number_input_props,
    shared_input_props,
    simple_duration_unit,
    validation_errors,
    setCurrentFocus,
}) => {
    const filterMinutesAndTicks = arr => {
        const filtered_arr = arr.filter(du => du.value === 't' || du.value === 'm');
        if (filtered_arr.length <= 1) return [];

        return filtered_arr;
    };
    const has_label = !duration_units_list.some(du => du.value === 't');

    return (
        <>
            {duration_units_list.length > 1 && (
                <ButtonToggle
                    id='dt_simple_duration_toggle'
                    buttons_arr={filterMinutesAndTicks(duration_units_list)}
                    is_animated={true}
                    name='simple_duration_unit'
                    onChange={changeDurationUnit}
                    value={simple_duration_unit}
                />
            )}
            {simple_duration_unit === 't' && contract_expiry_type === 'tick' && (
                <RangeSlider name='duration' value={duration_t} ticks={10} {...shared_input_props} />
            )}
            {simple_duration_unit === 'd' && (
                <TradingDatePicker id='dt_simple_duration_datepicker' mode='duration' name='duration' />
            )}
            {simple_duration_unit !== 't' && simple_duration_unit !== 'd' && (
                <InputField
                    id='dt_simple_duration_input'
                    classNameInput='trade-container__input'
                    current_focus={current_focus}
                    error_messages={validation_errors.duration}
                    name='duration'
                    label={has_label ? duration_units_list[0].text : null}
                    setCurrentFocus={setCurrentFocus}
                    value={getDurationFromUnit(simple_duration_unit)}
                    {...number_input_props}
                    {...shared_input_props}
                />
            )}
        </>
    );
};

SimpleDuration.propTypes = {
    changeDurationUnit: PropTypes.func,
    contract_expiry_type: PropTypes.string,
    current_focus: PropTypes.string,
    duration_t: PropTypes.number,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    getDurationFromUnit: PropTypes.func,
    number_input_props: PropTypes.object,
    setCurrentFocus: PropTypes.func,
    shared_input_props: PropTypes.object,
    simple_duration_unit: PropTypes.string,
    validation_errors: PropTypes.object,
};

export default connect(({ modules, ui }) => ({
    contract_expiry_type: modules.trade.contract_expiry_type,
    current_focus: ui.current_focus,
    setCurrentFocus: ui.setCurrentFocus,
    simple_duration_unit: ui.simple_duration_unit,
    validation_errors: modules.trade.validation_errors,
}))(SimpleDuration);
