import classNames from 'classnames';
import React from 'react';
import dayjs from 'dayjs';
import { CommonPropTypes } from './types';

const Months = ({ calendar_date, isPeriodDisabled, selected_date, updateSelected }: CommonPropTypes) => {
    const dayjs_date = dayjs(calendar_date);
    const dayjs_selected_date = dayjs(selected_date);
    const is_same_year = dayjs_selected_date.isSame(dayjs_date, 'year');
    const selected_month_number = Number(dayjs_selected_date.format('M'));
    const months_numbers = [...Array(12).keys()];

    return (
        <div className='dc-calendar__body dc-calendar__body--month'>
            {months_numbers.map(month_number => {
                const month = dayjs_date.clone().month(month_number);
                const is_active = is_same_year && selected_month_number === month_number + 1;
                const is_disabled = isPeriodDisabled(month, 'month');

                return (
                    <span
                        key={month_number}
                        className={classNames('dc-calendar__cell', {
                            'dc-calendar__cell--active': is_active,
                            'dc-calendar__cell--disabled': is_disabled,
                        })}
                        onClick={is_disabled ? undefined : e => updateSelected(e, 'month')}
                        data-month={month_number}
                    >
                        {month.format('MMM')}
                    </span>
                );
            })}
        </div>
    );
};

export default Months;
