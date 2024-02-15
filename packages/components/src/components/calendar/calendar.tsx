import React from 'react';
import { getStartOfMonth, toMoment } from '@deriv/shared';
import Body from './calendar-body';
import Footer from './calendar-footer';
import Header from './calendar-header';
import { getDate } from './helpers/constants';

type TCalendarProps = {
    date_format?: string;
    footer?: string;
    has_today_btn?: boolean;
    holidays?: Array<{
        dates: string[];
        descrip: string;
    }>;
    max_date?: string;
    min_date?: string;
    onChangeCalendarMonth?: (start_of_month: string) => void;
    onSelect: (formatted_date: string, keep_open: boolean) => void;
    start_date?: string;
    value: string;
    disable_days?: number[];
    calendar_view?: string;
    calendar_el_ref: React.RefObject<HTMLDivElement>;
    disabled_days?: number[];
    events?: Array<{
        dates: string[];
        descrip: string;
    }>;
    has_range_selection?: boolean;
    keep_open?: boolean;
    onHover?: (selected_date: moment.MomentInput | null) => void;
    should_show_today?: boolean;
};

type TCalendarRef = {
    setSelectedDate?: (date: string) => void;
};

const Calendar = React.memo(
    React.forwardRef<TCalendarRef, TCalendarProps>(
        (
            {
                calendar_view,
                calendar_el_ref,
                date_format = 'YYYY-MM-DD',
                disabled_days,
                events,
                footer = '',
                has_today_btn,
                has_range_selection,
                keep_open,
                max_date = toMoment().add(120, 'y').format('YYYY-MM-DD'), // by default, max_date is set to 120 years after today
                min_date = '1970-01-01', // by default, min_date is set to Unix Epoch (January 1st 1970)
                onChangeCalendarMonth,
                onHover,
                onSelect,
                start_date = '',
                value,
                should_show_today,
            },
            ref
        ) => {
            const [calendar_date, setCalendarDate] = React.useState<string>(
                toMoment(value || start_date).format(date_format)
            ); // calendar date reference
            const [selected_date, setSelectedDate] = React.useState<moment.MomentInput>(value); // selected date
            const [view, setView] = React.useState(calendar_view || 'date');
            const [hovered_date, setHoveredDate] = React.useState<string | null>('');

            React.useImperativeHandle(ref, () => ({
                setSelectedDate: (date: string) => {
                    const moment_date = toMoment(date).startOf('day');
                    const formatted_date = moment_date.format(date_format);
                    setCalendarDate(formatted_date);
                    setSelectedDate(formatted_date);
                },
            }));

            const navigateTo = (new_date: moment.MomentInput) => {
                setCalendarDate(toMoment(new_date).format(date_format));

                if (onChangeCalendarMonth) {
                    const start_of_month = getStartOfMonth(new_date);
                    onChangeCalendarMonth(start_of_month);
                }
            };

            const onMouseOver = (event: React.MouseEvent<HTMLSpanElement>) => {
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

            const onMouseLeave = (event: React.MouseEvent<HTMLSpanElement>) => {
                const target = event.currentTarget;

                if (target.classList.contains('dc-calendar__cell--hover')) {
                    target.classList.remove('dc-calendar__cell--hover');

                    setHoveredDate(null);

                    if (onHover) {
                        onHover(selected_date);
                    }
                }
            };

            const updateSelectedDate = (e: React.MouseEvent<HTMLSpanElement>) => {
                const moment_date = toMoment(e.currentTarget.dataset.date).startOf('day');
                const is_before = moment_date.isBefore(toMoment(min_date));
                const is_after = moment_date.isAfter(toMoment(max_date));

                if (is_before || is_after) {
                    return;
                }

                const formatted_date = moment_date.format(date_format);
                setCalendarDate(formatted_date);
                setSelectedDate(formatted_date);

                if (onSelect) {
                    onSelect(formatted_date, !!keep_open);
                }
            };

            const updateSelected = (e: React.MouseEvent<HTMLSpanElement>, type: moment.unitOfTime.StartOf) => {
                if (e) e.stopPropagation();

                if (type === 'day') {
                    updateSelectedDate(e);
                    return;
                }

                const view_map: Record<string, string> = {
                    month: 'date',
                    year: 'month',
                    years: 'year',
                };

                let date = '';
                if (type) {
                    const selected_date_part = e?.currentTarget?.dataset?.[type]?.split?.('-')?.[0] || 0;
                    date = getDate(toMoment(calendar_date), type, date_format, +selected_date_part);
                }
                if (isPeriodDisabled(date, type)) return;

                setCalendarDate(date);
                setView(view_map[type || '']);

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

            const isPeriodDisabled = (date: moment.Moment | string, unit: moment.unitOfTime.StartOf) => {
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
                        should_show_today={!!should_show_today}
                    />
                    <Footer footer={footer} has_today_btn={has_today_btn} onClick={setToday} />
                </div>
            );
        }
    )
) as React.MemoExoticComponent<React.ForwardRefExoticComponent<TCalendarProps & React.RefAttributes<TCalendarRef>>> & {
    Body: (props: React.ComponentProps<typeof Body>) => JSX.Element;
    Header: (props: React.ComponentProps<typeof Header>) => JSX.Element;
    Footer: (props: React.ComponentProps<typeof Footer>) => JSX.Element;
};

Calendar.displayName = 'Calendar';

Calendar.Body = Body;
Calendar.Header = Header;
Calendar.Footer = Footer;

export default Calendar;
