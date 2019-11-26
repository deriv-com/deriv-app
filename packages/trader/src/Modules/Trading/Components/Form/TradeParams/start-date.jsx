import { Dropdown }             from 'deriv-components';
import {
    PropTypes as MobxPropTypes,
    observer }                  from 'mobx-react';
import PropTypes                from 'prop-types';
import React                    from 'react';
import { localize }             from 'deriv-translations';
import Fieldset                 from 'App/Components/Form/fieldset.jsx';
import TimePicker               from 'App/Components/Form/TimePicker';

/* TODO:
    1. update sessions list when the selected one doesn’t have any enabled time
*/

const StartDate = ({
    is_minimized,
    is_nativepicker,
    onChange,
    start_date,
    start_dates_list,
    start_time,
    validation_errors,
}) => {
    // Number(0) refers to 'now'
    const is_today = start_date === Number(0);
    let current_date_config = '';
    if (!is_today) {
        current_date_config = start_dates_list.find(o => o.value === +start_date) || {};
    }
    if (is_minimized) {
        return (
            <div className='fieldset-minimized fieldset-minimized__start-date'>
                {is_today ? localize('Now') : `${current_date_config.text}\n${start_time}`}
            </div>
        );
    }
    return (
        <Fieldset className='trade-container__fieldset'>
            <Dropdown
                id='start_date'
                is_alignment_left
                is_nativepicker={is_nativepicker}
                list={start_dates_list}
                name='start_date'
                value={start_date}
                onChange={onChange}
            />
            {(!is_today && start_time) &&
                <TimePicker
                    onChange={onChange}
                    name='start_time'
                    selected_time={start_time}
                    placeholder='12:00'
                    start_time={start_date}
                    is_clearable={false}
                    is_nativepicker={is_nativepicker}
                    validation_errors={validation_errors.start_time}
                />
            }
        </Fieldset>
    );
};

StartDate.propTypes = {
    is_minimized     : PropTypes.bool,
    is_nativepicker  : PropTypes.bool,
    onChange         : PropTypes.func,
    sessions         : MobxPropTypes.arrayOrObservableArray,
    start_date       : PropTypes.number,
    start_dates_list : MobxPropTypes.arrayOrObservableArray,
    start_time       : PropTypes.string,
    validation_errors: PropTypes.object,
};

export default observer(StartDate);
