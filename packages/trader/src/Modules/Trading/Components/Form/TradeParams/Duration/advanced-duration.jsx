import classNames from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown, ButtonToggle, InputField } from '@deriv/components';
import { toMoment } from '@deriv/shared';
import RangeSlider from 'App/Components/Form/RangeSlider';
import { connect } from 'Stores/connect';
import { hasIntradayDurationUnit } from 'Stores/Modules/Trading/Helpers/duration';
import TradingDatePicker from '../../DatePicker';
import TradingTimePicker from '../../TimePicker';

const AdvancedDuration = ({
    advanced_duration_unit,
    advanced_expiry_type,
    duration_units_list,
    duration_t,
    contract_expiry_type,
    changeDurationUnit,
    current_focus,
    getDurationFromUnit,
    expiry_date,
    expiry_list,
    expiry_type,
    number_input_props,
    onChange,
    onChangeUiStore,
    server_time,
    setCurrentFocus,
    shared_input_props,
    start_date,
    validation_errors,
}) => {
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
                        {duration_units_list.length > 1 && (
                            <Dropdown
                                classNameDisplay='dc-dropdown__display--no-symbol'
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
                    </div>
                </>
            )}
        </>
    );
};

AdvancedDuration.propTypes = {
    advanced_duration_unit: PropTypes.string,
    advanced_expiry_type: PropTypes.string,
    changeDurationUnit: PropTypes.func,
    contract_expiry_type: PropTypes.string,
    current_focus: PropTypes.string,
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
    setCurrentFocus: PropTypes.func,
    shared_input_props: PropTypes.object,
    start_date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    validation_errors: PropTypes.object,
};

export default connect(({ modules, ui }) => ({
    contract_expiry_type: modules.trade.contract_expiry_type,
    current_focus: ui.current_focus,
    setCurrentFocus: ui.setCurrentFocus,
    validation_errors: modules.trade.validation_errors,
}))(AdvancedDuration);
