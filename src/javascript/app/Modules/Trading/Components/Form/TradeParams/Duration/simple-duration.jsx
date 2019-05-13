import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React, { Fragment }            from 'react';
import ButtonToggleMenu               from 'App/Components/Form/ButtonToggleMenu';
import InputField                     from 'App/Components/Form/InputField';
import RangeSlider                    from 'App/Components/Form/RangeSlider';
import TradingDatePicker              from '../../DatePicker';

const SimpleDuration = ({
    changeDurationUnit,
    duration_t,
    duration_units_list,
    getDurationFromUnit,
    number_input_props,
    shared_input_props,
    simple_duration_unit,
}) => {
    const filterMinutesAndTicks = (arr) => {
        const filtered_arr = arr.filter(du => du.value === 't' || du.value === 'm');
        if (filtered_arr.length <= 1) return [];

        return filtered_arr;
    };
    const has_label = !duration_units_list.some(du => du.value === 't');

    return (
        <Fragment>
            { duration_units_list.length > 1 &&
                <ButtonToggleMenu
                    buttons_arr={filterMinutesAndTicks(duration_units_list)}
                    is_animated={true}
                    name='simple_duration_unit'
                    onChange={changeDurationUnit}
                    value={simple_duration_unit}
                />
            }
            { simple_duration_unit === 't' &&
                <RangeSlider
                    name='duration'
                    value={duration_t}
                    ticks={10}
                    {...shared_input_props}
                />
            }
            { simple_duration_unit === 'd' &&
                <TradingDatePicker
                    alignment='left'
                    mode='duration'
                    name='duration'
                />
            }
            { (simple_duration_unit !== 't' && simple_duration_unit !== 'd') &&
                <InputField
                    classNameInput='trade-container__input'
                    name='duration'
                    label={has_label ? duration_units_list[0].text : null}
                    value={getDurationFromUnit(simple_duration_unit)}
                    {...number_input_props}
                    {...shared_input_props}
                />
            }
        </Fragment>
    );
};

SimpleDuration.propTypes = {
    changeDurationUnit: PropTypes.func,
    duration_t        : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_units_list : MobxPropTypes.arrayOrObservableArray,
    getDurationFromUnit : PropTypes.func,
    number_input_props  : PropTypes.object,
    shared_input_props  : PropTypes.object,
    simple_duration_unit: PropTypes.string,
};

export default SimpleDuration;
