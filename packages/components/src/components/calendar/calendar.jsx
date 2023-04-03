import PropTypes from 'prop-types';
import React from 'react';
import { getStartOfMonth, toMoment } from '@deriv/shared';
import Body from './calendar-body.jsx';
import Footer from './calendar-footer.jsx';
import Header from './calendar-header.jsx';

const Calendar = React.memo(
    React.forwardRef(
        (
            {
                calendar_view,
                calendar_el_ref,
                date_format,
                disabled_days,
                events,
                footer,
                has_today_btn,
                has_range_selection,
                keep_open,
                max_date,
                min_date,
                onChangeCalendarMonth,
                onHover,
                onSelect,
                start_date,
                value,
                should_show_today,
            },
            ref
        ) => {
            const [calendar_date, setCalendarDate] = React.useState(toMoment(value || start_date).format(date_format)); // calendar date reference
            const [selected_date, setSelectedDate] = React.useState(value); // selected date
            const [view, setView] = React.useState(calendar_view || 'date');
            const [hovered_date, setHoveredDate] = React.useState('');

            React.useImperativeHandle(ref, () => ({
                setSelectedDate: date => {
                    const moment_date = toMoment(date).startOf('day');
                    const formatted_date = moment_date.format(date_format);
                    setCalendarDate(formatted_date);
                    setSelectedDate(formatted_date);
                },
            }));

            const navigateTo = new_date => {
                setCalendarDate(toMoment(new_date).format(date_format));

                if (onChangeCalendarMonth) {
                    const start_of_month = getStartOfMonth(new_date);
                    onChangeCalendarMonth(start_of_month);
                }
            };

            const onMouseOver = event => {
                const target = event.currentTarget;

                if (
                    !target.classList.contains('dc-calendar__cell--disabled') &&
                    !target.classList.contains('dc-calendar__cell--hover')
                ) {
                    target.className += ' dc-calendar__cell--hover';
                    const new_hovered_date = target.getAttribute('data-date');
                    setHoveredDate(new_hovered_date);

                    if (onHover) {
                        onHover(new_hovered_date);
                    }
                }
            };

            const onMouseLeave = event => {
                const target = event.currentTarget;

                if (target.classList.contains('dc-calendar__cell--hover')) {
                    target.classList.remove('dc-calendar__cell--hover');

                    setHoveredDate(null);

                    if (onHover) {
                        onHover(selected_date);
                    }
                }
            };

            const updateSelectedDate = e => {
                const moment_date = toMoment(e.target.dataset.date).startOf('day');
                const is_before = moment_date.isBefore(toMoment(min_date));
                const is_after = moment_date.isAfter(toMoment(max_date));

                if (is_before || is_after) {
                    return;
                }

                const formatted_date = moment_date.format(date_format);
                setCalendarDate(formatted_date);
                setSelectedDate(formatted_date);

                if (onSelect) {
                    onSelect(formatted_date, keep_open);
                }
            };

            const updateSelected = (e, type) => {
                if (e) e.stopPropagation();

                if (type === 'day') {
                    updateSelectedDate(e);
                    return;
                }

                const view_map = {
                    month: 'date',
                    year: 'month',
                    decade: 'year',
                };

                const date = toMoment(calendar_date)
                    [type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0]) // eslint-disable-line no-unexpected-multiline
                    .format(date_format); // eslint-disable-line no-unexpected-multiline

                if (isPeriodDisabled(date, type)) return;

                setCalendarDate(date);
                setView(view_map[type]);

                if (onChangeCalendarMonth) {
                    const start_of_month = getStartOfMonth(date);
                    onChangeCalendarMonth(start_of_month);
                }
            };

            const setToday = () => {
                const now = toMoment().format(date_format);
                setCalendarDate(now);
                setSelectedDate(now);
                setView('date');

                if (onSelect) {
                    onSelect(now, true);
                }
            };

            const isPeriodDisabled = (date, unit) => {
                const start_of_period = toMoment(date).clone().startOf(unit);
                const end_of_period = toMoment(date).clone().endOf(unit);
                return end_of_period.isBefore(toMoment(min_date)) || start_of_period.isAfter(toMoment(max_date));
            };

            return (
                <div ref={calendar_el_ref} className='dc-calendar' data-value={selected_date}>
                    <Header
                        calendar_date={calendar_date}
                        calendar_view={view}
                        isPeriodDisabled={isPeriodDisabled}
                        navigateTo={navigateTo}
                        switchView={setView}
                    />
                    <Body
                        calendar_date={calendar_date}
                        calendar_view={view}
                        date_format={date_format}
                        disabled_days={disabled_days}
                        isPeriodDisabled={isPeriodDisabled}
                        start_date={start_date}
                        selected_date={selected_date}
                        updateSelected={updateSelected}
                        events={events}
                        has_range_selection={has_range_selection}
                        hovered_date={hovered_date}
                        onMouseOver={onMouseOver}
                        onMouseLeave={onMouseLeave}
                        should_show_today={should_show_today}
                    />
                    <Footer footer={footer} has_today_btn={has_today_btn} onClick={setToday} />
                </div>
            );
        }
    )
);

Calendar.displayName = 'Calendar';

Calendar.Body = Body;
Calendar.Header = Header;
Calendar.Footer = Footer;

Calendar.defaultProps = {
    date_format: 'YYYY-MM-DD',
    min_date: '1970-01-01', // by default, min_date is set to Unix Epoch (January 1st 1970)
    max_date: toMoment().add(120, 'y').format('YYYY-MM-DD'), // by default, max_date is set to 120 years after today
};

Calendar.propTypes = {
    date_format: PropTypes.string,
    footer: PropTypes.string,
    has_today_btn: PropTypes.bool,
    holidays: PropTypes.arrayOf(
        PropTypes.shape({
            dates: PropTypes.array,
            descrip: PropTypes.string,
        })
    ),
    max_date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    min_date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    onChangeCalendarMonth: PropTypes.func,
    onSelect: PropTypes.func,
    start_date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disable_days: PropTypes.arrayOf(PropTypes.number),
    calendar_view: PropTypes.string,
    calendar_el_ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]),
    disabled_days: PropTypes.array,
    events: PropTypes.array,
    has_range_selection: PropTypes.bool,
    keep_open: PropTypes.bool,
    onHover: PropTypes.func,
    should_show_today: PropTypes.bool,
};

export default Calendar;
