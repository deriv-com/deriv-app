import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import Icon              from 'Assets/icon.jsx';
import { month_headers } from 'Constants/date-time';
import {
    addMonths,
    addYears,
    subMonths,
    subYears,
    toMoment }           from 'Utils/Date';
import CalendarButton    from './calendar-button.jsx';
import {
    getCentury,
    getDecade }          from './helper';

const CalendarHeader = ({
    calendar_date,
    calendar_view,
    disable_month_selector,
    disable_year_selector,
    hide_disabled_periods,
    isPeriodDisabled,
    navigateTo,
    switchView,
}) => {
    const is_date_view   = calendar_view === 'date';
    const is_month_view  = calendar_view === 'month';
    const is_year_view   = calendar_view === 'year';
    const is_decade_view = calendar_view === 'decade';
    const moment_date    = toMoment(calendar_date);

    let num_of_years = 1;
    if (is_year_view)   num_of_years = 10;
    if (is_decade_view) num_of_years = 100;

    const century = getCentury(moment_date.clone());
    const decade  = getDecade(moment_date.clone());
    const end_of_decade = (is_year_view ? decade : century).split('-')[1];

    const is_prev_month_disabled  = isPeriodDisabled(subMonths(moment_date, 1), 'month');
    const is_prev_year_disabled   = isPeriodDisabled(subYears(moment_date, num_of_years), 'month');
    const is_next_month_disabled  = isPeriodDisabled(addMonths(moment_date, 1), 'month');
    const is_next_year_disabled   = isPeriodDisabled(addYears(moment_date, num_of_years), 'month');
    const is_select_year_disabled = isPeriodDisabled(moment_date.clone().year(end_of_decade), 'year') || disable_year_selector;
    const should_hide_next_month  = is_next_month_disabled && hide_disabled_periods;
    const should_hide_prev_month  = is_prev_month_disabled && hide_disabled_periods;
    const should_hide_prev_year   = is_prev_year_disabled && hide_disabled_periods;
    const should_hide_next_year   = is_next_year_disabled && hide_disabled_periods;

    const onClickPrevYear = !(is_prev_year_disabled || should_hide_prev_year) ?
        () => navigateTo(subYears(calendar_date, num_of_years)) :
        undefined;

    const onClickNextYear = !(is_next_year_disabled || should_hide_next_year) ?
        () => navigateTo(addYears(calendar_date, num_of_years)) :
        undefined;

    const onClickPrevMonth = !(is_prev_month_disabled || should_hide_prev_month) ?
        () => navigateTo(subMonths(calendar_date, 1)) :
        undefined;

    const onClickNextMonth = !(is_next_month_disabled || should_hide_next_month) ?
        () => navigateTo(addMonths(calendar_date, 1)) :
        undefined;

    return (
        <div className='calendar__header'>
            <CalendarButton
                className={classNames('calendar__nav calendar__nav--prev-year', {
                    'calendar__nav--disabled' : is_prev_year_disabled,
                    'calendar__nav--is-hidden': should_hide_prev_year,
                })}
                onClick={onClickPrevYear}
            >
                <Icon icon='IconChevronDoubleLeft' className='calendar__icon' />
            </CalendarButton>
            <CalendarButton
                className={classNames('calendar__nav calendar__nav--prev-month', {
                    'calendar__nav--disabled' : is_prev_month_disabled,
                    'calendar__nav--is-hidden': should_hide_prev_month,
                })}
                is_hidden={!is_date_view}
                onClick={onClickPrevMonth}
            >
                <Icon icon='IconChevronLeft' className='calendar__icon' />
            </CalendarButton>

            <React.Fragment>
                { is_date_view &&
                    <CalendarButton
                        className='calendar__btn calendar__btn--select'
                        is_hidden={!is_date_view}
                        label={month_headers[moment_date.format('MMM')]}
                        onClick={() => disable_month_selector ? undefined : switchView('month')}
                    />
                }
                { (is_date_view || is_month_view) &&
                    <CalendarButton
                        className={classNames('calendar__btn calendar__btn--select', {
                            'calendar__btn--disabled': is_select_year_disabled,
                        })}
                        label={moment_date.format('YYYY')}
                        onClick={() => is_select_year_disabled ? undefined : switchView('year')}
                    />
                }
                { (is_year_view || is_decade_view) &&
                    <CalendarButton
                        className={classNames('calendar__btn calendar__btn--select', {
                            'calendar__btn--disabled': is_select_year_disabled,
                        })}
                        onClick={is_select_year_disabled ? undefined : () => switchView('decade')}
                    >
                        { is_year_view   && `${decade}`  }
                        { is_decade_view && `${century}` }
                    </CalendarButton>
                }
            </React.Fragment>

            <CalendarButton
                className={classNames('calendar__nav calendar__nav--next-month', {
                    'calendar__nav--disabled' : is_next_month_disabled,
                    'calendar__nav--is-hidden': should_hide_next_month,
                })}
                is_hidden={!is_date_view}
                onClick={onClickNextMonth}
            >
                <Icon icon='IconChevronRight' className='calendar__icon' />
            </CalendarButton>
            <CalendarButton
                className={classNames('calendar__nav calendar__nav--next-year', {
                    'calendar__nav--disabled' : is_next_year_disabled,
                    'calendar__nav--is-hidden': should_hide_next_year,
                })}
                onClick={onClickNextYear}
            >
                <Icon icon='IconChevronDoubleRight' className='calendar__icon' />
            </CalendarButton>
        </div>
    );
};

CalendarHeader.propTypes = {
    calendar_date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.number,
    ]),
    calendar_view         : PropTypes.string,
    disable_month_selector: PropTypes.bool,
    disable_year_selector : PropTypes.bool,
    hide_disabled_periods : PropTypes.bool,
    isPeriodDisabled      : PropTypes.func,
    navigateTo            : PropTypes.func,
    switchView            : PropTypes.func,
};

export default CalendarHeader;
