import classNames from 'classnames';
import React from 'react';
import { toMoment } from '@deriv/shared';
import { CommonPropTypes } from './types';
import { month_headers } from '../helpers';

const Months = ({ calendar_date, isPeriodDisabled, selected_date, updateSelected }) => {
    const moment_date = toMoment(calendar_date);
    const moment_selected_date = toMoment(selected_date);
    const is_same_year = moment_selected_date.isSame(moment_date, 'year');
    const selected_month_number = Number(moment_selected_date.clone().format('M'));

    return (
        <div className='dc-calendar__body dc-calendar__body--month'>
            {Object.keys(month_headers).map((month, index) => {
                const month_name = month_headers[month]();
                const month_number = index + 1;
                const is_active = month_number === selected_month_number && is_same_year;
                const is_disabled = isPeriodDisabled(moment_date.clone().month(month), 'month');

                return (
                    <span
                        key={month_number}
                        className={classNames('dc-calendar__cell', {
                            'dc-calendar__cell--active': is_active,
                            'dc-calendar__cell--disabled': is_disabled,
                        })}
                        onClick={is_disabled ? undefined : e => updateSelected(e, 'month')}
                        data-month={index}
                    >
                        {month_name}
                    </span>
                );
            })}
        </div>
    );
};

Months.propTypes = { ...CommonPropTypes };

export default Months;
