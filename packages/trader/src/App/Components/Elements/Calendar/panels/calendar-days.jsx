import { Popover }         from 'deriv-components';
import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { padLeft }         from '_common/string_util';
import { localize }        from 'deriv-translations';
import {
    getDaysOfTheWeek,
    week_headers_abbr }    from 'Constants/date-time';
import {
    addDays,
    addMonths,
    daysFromTodayTo,
    epochToMoment,
    subDays,
    subMonths,
    toMoment }             from 'Utils/Date';
import { CommonPropTypes } from './types';

const getDays = ({
    calendar_date,
    date_format,
    has_range_selection,
    hide_others,
    holidays,
    hovered_date,
    isPeriodDisabled,
    start_date,
    selected_date,
    updateSelected,
    weekends,
    onMouseOver,
    onMouseLeave,
}) => {
    // adjust Calendar week by 1 day so that Calendar week starts on Monday
    // change to zero to set Calendar week to start on Sunday
    const day_offset = 1;

    const dates = [];
    const days  = [];
    const moment_today       = toMoment().startOf('day');
    const moment_cur_date    = toMoment(calendar_date);
    const num_of_days        = moment_cur_date.daysInMonth() + 1;
    const moment_month_start = moment_cur_date.clone().startOf('month');
    const moment_month_end   = moment_cur_date.clone().endOf('month');
    const moment_selected    = typeof selected_date === 'number' ? epochToMoment(selected_date).startOf('day') : toMoment(selected_date).startOf('day');

    // populate previous months' dates
    const end_of_prev_month = subMonths(moment_cur_date, 1).endOf('month').day();
    for (let i = end_of_prev_month; i > 0; i--) {
        dates.push(subDays(moment_month_start, i).format(date_format));
    }
    // populate current months' dates
    for (let idx = 1; idx < num_of_days; idx += 1) {
        dates.push(moment_cur_date.clone().format(date_format.replace('DD', padLeft(idx, 2, '0'))));
    }
    // populate next months' dates
    const start_of_next_month = addMonths(moment_cur_date, 1).startOf('month').day();
    if (start_of_next_month - day_offset > 0 || dates.length <= 28) {
        // if start_of_next_month doesn't falls on Monday, append rest of the week
        for (let i = 1; i <= 7 - start_of_next_month + day_offset; i++) {
            dates.push(addDays(moment_month_end, i, 'day').format(date_format));
        }
    } else if (!start_of_next_month) {
        // if start_of_next_month falls on Sunday, append 1 day
        dates.push(addDays(moment_month_end, 1).format(date_format));
    }

    const moment_start_date = toMoment(start_date).startOf('day');

    dates.map((date) => {
        const moment_date    = toMoment(date).startOf('day');
        const moment_hovered = toMoment(hovered_date).startOf('day');
        const is_active      = selected_date && moment_date.isSame(moment_selected);
        const is_today       = moment_date.isSame(moment_today, 'day');

        const events          = holidays.filter(event =>
            // filter by date or day of the week
            event.dates.find(d => d === date || getDaysOfTheWeek(d) === toMoment(date).day()));
        const has_events           = !!events.length;
        const is_closes_early      = events.map(event => !!event.descrip.match(/Closes early|Opens late/))[0];
        const message              = events.map(event => event.descrip)[0] || '';
        const duration_from_today  = daysFromTodayTo(date);
        const is_between           = moment_date.isBetween(moment_today, moment_selected);
        const is_between_hover     = moment_date.isBetween(moment_today, moment_hovered);
        const is_before_min_or_after_max_date = isPeriodDisabled(moment_date, 'day');
        const is_disabled =
            // check if date is before min_date or after_max_date
            is_before_min_or_after_max_date
            // for forward starting accounts, only show same day as start date and the day after
            || ((start_date && (moment_date.isBefore(moment_start_date))))
            // check if weekends are disabled
            || weekends.some(day => toMoment(date).day() === day)
            // check if date falls on holidays, and doesn't close early or opens late
            || has_events && !is_closes_early;

        // show 'disabled' style for dates that is not in the same calendar month, it should still be clickable
        const is_other_month = moment_date.month() !== moment_cur_date.month();

        days.push(
            <span
                key={date}
                className={classNames('calendar__cell', {
                    'calendar__cell--active'         : is_active,
                    'calendar__cell--today'          : is_today,
                    'calendar__cell--active-duration': is_active && has_range_selection && !is_today,
                    'calendar__cell--today-duration' : is_today && has_range_selection,
                    'calendar__cell--disabled'       : is_disabled,
                    'calendar__cell--is-hidden'      : is_other_month && hide_others,
                    'calendar__cell--other'          : is_other_month,
                    'calendar__cell--between-hover'  : is_between_hover && has_range_selection,
                    'calendar__cell--between'        : is_between && has_range_selection,
                })}
                onClick={is_disabled ? undefined : (e) => updateSelected(e, 'day')}
                data-date={date}
                data-duration={`${duration_from_today} ${ duration_from_today === 1 ? localize('Day') : localize('Days') }`}
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
            >
                {((has_events || is_closes_early) && !is_other_month && !is_before_min_or_after_max_date) &&
                    <Popover
                        alignment='top'
                        classNameTarget='calendar__cell-tooltip'
                        classNameTargetIcon='calendar__cell-tooltip-icon'
                        icon='dot'
                        message={message}
                    />
                }
                {moment_date.date()}
            </span>
        );
    });

    return days;
};

export const CalendarDays = (props) => {
    const days = getDays(props).map(day => day);

    return (
        <div className='calendar__body calendar__body--date'>
            { Object.keys(week_headers_abbr)
                .map((item, idx) => (
                    <span key={idx} className='calendar__text calendar__text--bold'>{week_headers_abbr[item]}</span>
                ))
            }
            { days }
        </div>
    );
};

CalendarDays.defaultProps = {
    holidays: [],
    weekends: [],
};

CalendarDays.propTypes = {
    ...CommonPropTypes,
    date_format        : PropTypes.string,
    has_range_selection: PropTypes.bool,
    holidays           : PropTypes.arrayOf(
        PropTypes.shape({
            dates  : PropTypes.array,
            descrip: PropTypes.string,
        }),
    ),
    hovered_date: PropTypes.string,
    onMouseLeave: PropTypes.func,
    onMouseOver : PropTypes.func,
    start_date  : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    weekends: PropTypes.arrayOf(PropTypes.number),
};
