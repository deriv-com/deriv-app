import classNames        from 'classnames';
import React             from 'react';
import { month_headers } from 'Constants/date-time';
import { toMoment }      from 'Utils/Date';
import { CommonPropTypes }   from './types';

export const CalendarMonths = ({
    calendar_date,
    isPeriodDisabled,
    selected_date,
    updateSelected,
}) => {
    const moment_date          = toMoment(calendar_date);
    const moment_selected_date = toMoment(selected_date);

    return (
        <div className='calendar__body calendar__body--month'>
            { Object.keys(month_headers).map((month, idx) => {
                const is_active   = month === moment_selected_date.clone().format('MMM') && moment_selected_date.isSame(moment_date, 'year');
                const is_disabled = isPeriodDisabled(moment_date.clone().month(month), 'month');
                return (
                    <span
                        key={idx}
                        className={classNames('calendar__cell', {
                            'calendar__cell--active'  : is_active,
                            'calendar__cell--disabled': is_disabled,
                        })}
                        onClick={is_disabled ? undefined : (e) => updateSelected(e, 'month')}
                        data-month={month}
                    >
                        {month_headers[month]}
                    </span>
                );
            })
            }
        </div>
    );
};

CalendarMonths.propTypes = { ...CommonPropTypes };
