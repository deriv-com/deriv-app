import classNames      from 'classnames';
import React           from 'react';
import { toMoment }    from 'Utils/Date';
import { CommonPropTypes } from './types';
import { getDecade }   from '../helper';

export const CalendarYears = ({
    calendar_date,
    isPeriodDisabled,
    selected_date,
    updateSelected,
}) => {
    const moment_selected = toMoment(selected_date);
    const moment_date     = toMoment(calendar_date);
    const [start_of_decade, end_of_decade] = getDecade(moment_date).split('-');

    const years = [];
    for (let year = +start_of_decade - 1; year <= +end_of_decade + 1; year++) {
        years.push(year);
    }
    return (
        <div className='calendar__body calendar__body--year'>
            { years.map((year, idx) => {
                const is_other_decade = idx === 0 || idx === 11;
                const is_disabled     = isPeriodDisabled(moment_date.clone().year(year), 'year', 'body');
                return (
                    <span
                        key={idx}
                        className={classNames('calendar__cell', {
                            'calendar__cell--active'  : year === moment_selected.year(),
                            'calendar__cell--other'   : is_other_decade,
                            'calendar__cell--disabled': is_disabled,
                        })}
                        onClick={is_disabled ? undefined : (e) => updateSelected(e, 'year')}
                        data-year={year}
                    >
                        {year}
                    </span>
                );
            })
            }
        </div>
    );
};

CalendarYears.propTypes = { ...CommonPropTypes };
