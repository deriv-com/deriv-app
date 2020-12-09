import classNames from 'classnames';
import React from 'react';
import { toMoment } from '@deriv/shared';
import { CommonPropTypes } from './types';
import { month_headers } from '../helpers';

const Months = ({ calendar_date, isPeriodDisabled, selected_date, updateSelected }) => {
    const moment_date = toMoment(calendar_date);
    const moment_selected_date = toMoment(selected_date);

    return (
        <div className='dc-calendar__body dc-calendar__body--month'>
            {Object.keys(month_headers).map((month, idx) => {
                const is_active =
                    month === moment_selected_date.clone().format('MMM') &&
                    moment_selected_date.isSame(moment_date, 'year');
                const is_disabled = isPeriodDisabled(moment_date.clone().month(month), 'month');
                return (
                    <span
                        key={idx}
                        className={classNames('dc-calendar__cell', {
                            'dc-calendar__cell--active': is_active,
                            'dc-calendar__cell--disabled': is_disabled,
                        })}
                        onClick={is_disabled ? undefined : e => updateSelected(e, 'month')}
                        data-month={month}
                    >
                        {month_headers[month]}
                    </span>
                );
            })}
        </div>
    );
};

Months.propTypes = { ...CommonPropTypes };

export default Months;
