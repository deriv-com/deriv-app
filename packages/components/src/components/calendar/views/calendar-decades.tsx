import classNames from 'classnames';
import React from 'react';
import { toMoment } from '@deriv/shared';
import { CommonPropTypes } from './types';
import { getCentury, getDecade } from '../helpers';

const Decades = ({ calendar_date, isPeriodDisabled, selected_date, updateSelected }: CommonPropTypes) => {
    const moment_selected = toMoment(selected_date);
    const moment_date = toMoment(calendar_date);
    const start_year = getCentury(moment_date).split('-')[0];

    const decades = [];
    let min_year = +start_year - 10;
    for (let i = 0; i < 12; i++) {
        const decade = getDecade(toMoment().year(min_year));
        decades.push(decade);
        min_year = +decade.split('-')[1] + 1;
    }
    return (
        <div className='dc-calendar__body dc-calendar__body--decade'>
            {decades.map((decade, idx) => {
                const [start_of_decade, end_of_decade] = decade.split('-');
                const is_active = +start_of_decade === moment_selected.year();
                const is_disabled =
                    isPeriodDisabled(moment_date.clone().year(+start_of_decade), 'year') &&
                    isPeriodDisabled(moment_date.clone().year(+end_of_decade), 'year');
                const is_other_century = idx === 0 || idx === 11;
                return (
                    <span
                        key={idx}
                        className={classNames('dc-calendar__cell', {
                            'dc-calendar__cell--active': is_active,
                            'dc-calendar__cell--disabled': is_disabled,
                            'dc-calendar__cell--other': is_other_century,
                        })}
                        onClick={is_disabled ? undefined : e => updateSelected(e, 'years')}
                        data-years={decade} // data-years attribute contains a range of years selected on the calendar control e.g. 2011-2020
                    >
                        {decade}
                    </span>
                );
            })}
        </div>
    );
};

export default Decades;
