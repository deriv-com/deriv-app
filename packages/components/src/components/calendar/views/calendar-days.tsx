import classNames from 'classnames';
import React from 'react';
import {
    addDays,
    addMonths,
    daysFromTodayTo,
    epochToMoment,
    subDays,
    subMonths,
    toMoment,
    padLeft,
} from '@deriv/shared';
import { CommonPropTypes } from './types';
import Popover from '../../popover';
import { getDaysOfTheWeek, week_headers_abbr } from '../helpers';
import Text from '../../text';

type TDaysProps = CommonPropTypes & {
    date_format: string;
    has_range_selection?: boolean;
    events?: Array<{
        dates: string[];
        descrip: string;
    }>;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
    onMouseOver?: React.MouseEventHandler<HTMLSpanElement>;
    start_date?: string;
    disabled_days?: number[];
    should_show_today?: boolean;
    hide_others?: boolean;
};

const getDays = ({
    calendar_date,
    date_format,
    has_range_selection,
    hide_others,
    events = [],
    isPeriodDisabled,
    start_date,
    selected_date,
    updateSelected,
    disabled_days = [],
    onMouseOver,
    onMouseLeave,
    should_show_today = true,
}: TDaysProps) => {
    // adjust Calendar week by 1 day so that Calendar week starts on Monday
    // change to zero to set Calendar week to start on Sunday
    const day_offset = 1;

    const dates = [];
    const days: JSX.Element[] = [];
    const moment_today = toMoment().startOf('day');
    const moment_cur_date = toMoment(calendar_date);
    const num_of_days = moment_cur_date.daysInMonth() + 1;
    const moment_month_start = moment_cur_date.clone().startOf('month');
    const moment_month_end = moment_cur_date.clone().endOf('month');
    const moment_selected =
        typeof selected_date === 'number'
            ? epochToMoment(selected_date).startOf('day')
            : toMoment(selected_date).startOf('day');

    // populate previous months' dates
    const end_of_prev_month = subMonths(moment_cur_date, 1).endOf('month').day();
    for (let i = end_of_prev_month; i > 0; i--) {
        dates.push(subDays(moment_month_start, i).format(date_format));
    }
    // populate current months' dates
    for (let idx = 1; idx < num_of_days; idx += 1) {
        dates.push(moment_cur_date.clone().format(date_format.replace('DD', padLeft(idx.toString(), 2, '0'))));
    }
    // populate next months' dates
    const start_of_next_month = addMonths(moment_cur_date, 1).startOf('month').day();
    if (start_of_next_month - day_offset > 0 || dates.length <= 28) {
        // if start_of_next_month doesn't falls on Monday, append rest of the week
        for (let i = 1; i <= 7 - start_of_next_month + day_offset; i++) {
            dates.push(addDays(moment_month_end, i).format(date_format));
        }
    } else if (!start_of_next_month) {
        // if start_of_next_month falls on Sunday, append 1 day
        dates.push(addDays(moment_month_end, 1).format(date_format));
    }

    const moment_start_date = toMoment(start_date).startOf('day');

    dates.forEach(date => {
        const moment_date = toMoment(date).startOf('day');
        const is_active = selected_date && moment_date.isSame(moment_selected);
        const is_today = moment_date.isSame(moment_today, 'day');

        const calendar_events = events.filter(event =>
            // filter by date or day of the week
            event.dates.find(d => getDaysOfTheWeek(d) === toMoment(date).day())
        );
        const has_events = !!calendar_events.length;
        const is_closes_early = calendar_events.map(event => !!event.descrip.match(/Closes early|Opens late/))[0];
        const message = calendar_events.map(event => event.descrip)[0] || '';
        const duration_from_today = daysFromTodayTo(date);
        const is_between = moment_date.isBetween(moment_today, moment_selected);
        const is_before_min_or_after_max_date = isPeriodDisabled(moment_date, 'day');
        const is_disabled =
            // check if date is before min_date or after_max_date
            is_before_min_or_after_max_date ||
            // for forward starting accounts, only show same day as start date and the day after
            (start_date && moment_date.isBefore(moment_start_date)) ||
            // check if weekends are disabled
            disabled_days.some(day => toMoment(date).day() === day) ||
            // check if date falls on holidays, and doesn't close early or opens late
            (has_events && !is_closes_early);

        // show 'disabled' style for dates that is not in the same calendar month, it should still be clickable
        const is_other_month = moment_date.month() !== moment_cur_date.month();

        days.push(
            <span
                key={date}
                className={classNames('dc-calendar__cell', {
                    'dc-calendar__cell--active': is_active,
                    'dc-calendar__cell--today': should_show_today && is_today,
                    'dc-calendar__cell--active-duration': is_active && has_range_selection && !is_today,
                    'dc-calendar__cell--today-duration': is_today && has_range_selection,
                    'dc-calendar__cell--disabled': is_disabled,
                    'dc-calendar__cell--is-hidden': is_other_month && hide_others,
                    'dc-calendar__cell--other': is_other_month,
                    'dc-calendar__cell--between': is_between && has_range_selection,
                })}
                onClick={is_disabled ? undefined : e => updateSelected(e, 'day')}
                data-date={date}
                data-duration={`${duration_from_today} ${duration_from_today === 1 ? 'Day' : 'Days'}`}
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
            >
                {(has_events || is_closes_early) && !is_other_month && !is_before_min_or_after_max_date && (
                    <Popover
                        alignment='top'
                        classNameTarget='dc-calendar__cell-tooltip'
                        classNameTargetIcon='dc-calendar__cell-tooltip-icon'
                        icon='dot'
                        is_bubble_hover_enabled
                        message={message}
                        zIndex='9999'
                        should_show_cursor
                    />
                )}
                {moment_date.date()}
            </span>
        );
    });

    return days;
};

const Days = (props: TDaysProps) => {
    const days = getDays(props).map(day => day);

    return (
        <div className='dc-calendar__body dc-calendar__body--date'>
            {Object.keys(week_headers_abbr).map((item, idx) => (
                <Text size='xxs' align='center' weight='bold' key={idx}>
                    {week_headers_abbr[item]}
                </Text>
            ))}
            {days}
        </div>
    );
};

export default Days;
