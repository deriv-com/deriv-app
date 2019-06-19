import classNames      from 'classnames';
import React           from 'react';
import { toMoment }    from 'Utils/Date';
import { CommonPropTypes } from './types';
import {
    getCentury,
    getDecade }        from '../helper';

export const CalendarDecades = ({
    calendar_date,
    isPeriodDisabled,
    selected_date,
    updateSelected,
}) => {
    const moment_selected = toMoment(selected_date);
    const moment_date     = toMoment(calendar_date);
    const start_year      = getCentury(moment_date).split('-')[0];

    const decades = [];
    let min_year = +start_year - 10;
    for (let i = 0; i < 12; i++) {
        const decade = getDecade(toMoment().year(min_year));
        decades.push(decade);
        min_year = +decade.split('-')[1] + 1;
    }
    return (
        <div className='calendar__body calendar__body--decade'>
            { decades.map((decade, idx) => {
                const [start_of_decade, end_of_decade] = decade.split('-');
                const is_active    = +start_of_decade === moment_selected.year();
                const is_disabled  = isPeriodDisabled(moment_date.clone().year(start_of_decade), 'year') &&
                    isPeriodDisabled(moment_date.clone().year(end_of_decade), 'year');
                const is_other_century = idx === 0 || idx === 11;
                return (
                    <span
                        key={idx}
                        className={classNames('calendar__cell', {
                            'calendar__cell--active'  : is_active,
                            'calendar__cell--disabled': is_disabled,
                            'calendar__cell--other'   : is_other_century,
                        })}
                        onClick={is_disabled ? undefined : (e) => updateSelected(e, 'decade')}
                        data-decade={decade}
                    >
                        {decade}
                    </span>
                );
            })
            }
        </div>
    );
};

CalendarDecades.propTypes = { ...CommonPropTypes };
