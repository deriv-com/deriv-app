import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Calendar from '../calendar';
import { useBlockScroll } from '../../hooks';

type TDatePickerCalendarProps = {
    value: string;
    alignment?: string;
    is_datepicker_visible: boolean;
    calendar_el_ref: React.RefObject<HTMLDivElement>;
    parent_ref: React.RefObject<HTMLElement>;
    portal_id?: string;
    style: React.CSSProperties;
    placement: string;
    onSelect: (formatted_date: string, keep_open: boolean) => void;
    calendar_view?: 'date' | 'month' | 'year' | 'decade';
    keep_open?: boolean;
    footer?: string;
    has_today_btn?: boolean;
    holidays?: Array<{
        dates: string[];
        descrip: string;
    }>;
    onChangeCalendarMonth?: (start_of_month: string) => void;
    start_date?: string;
    disable_days?: number[];
    disabled_days?: number[];
    events?: Array<{
        dates: string[];
        descrip: string;
    }>;
    has_range_selection?: boolean;
    onHover?: (selected_date: moment.MomentInput | null) => void;
    should_show_today?: boolean;
};

type TCalendarRef = {
    setSelectedDate?: (date: string) => void;
};

const DatePickerCalendar = React.forwardRef<TCalendarRef, TDatePickerCalendarProps>(
    ({ alignment, is_datepicker_visible, parent_ref, portal_id, style, placement, ...props }, ref) => {
        const css_transition_classnames = {
            enter: classNames('dc-datepicker__picker--enter', {
                [`dc-datepicker__picker--${alignment}-enter`]: alignment,
            }),
            enterDone: classNames('dc-datepicker__picker--enter-done', {
                [`dc-datepicker__picker--${placement || alignment}-enter-done`]: placement || alignment,
            }),
            exit: classNames('dc-datepicker__picker--exit', {
                [`dc-datepicker__picker--${alignment}-exit`]: alignment,
            }),
        };

        const el_calendar = (
            <CSSTransition
                in={is_datepicker_visible}
                timeout={100}
                classNames={css_transition_classnames}
                unmountOnExit
            >
                <div
                    className={classNames('dc-datepicker__picker', {
                        'dc-datepicker__picker--left': alignment === 'left',
                    })}
                    style={
                        portal_id
                            ? {
                                  top: style.top,
                                  bottom: style.bottom,
                                  left: style.left,
                              }
                            : {
                                  top: 0, // we pass 0 to overcome additional margin from calendar enter animation
                              }
                    }
                >
                    <Calendar ref={ref} {...props} />
                </div>
            </CSSTransition>
        );

        useBlockScroll(portal_id && is_datepicker_visible ? parent_ref : undefined);

        if (portal_id) {
            const portal = document.getElementById(portal_id);

            if (portal) {
                return ReactDOM.createPortal(el_calendar, portal);
            }
        }

        return el_calendar;
    }
);

DatePickerCalendar.displayName = 'DatePickerCalendar';

export default DatePickerCalendar;
