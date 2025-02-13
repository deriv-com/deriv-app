import React from 'react';
import moment from 'moment';

import { Calendar } from '@deriv/components';
import { addMonths, diffInMonths, subMonths, toMoment } from '@deriv/shared';

type TTwoMonthPicker = {
    onChange: (date: moment.MomentInput) => void;
    isPeriodDisabled: (date: moment.Moment) => boolean;
    value: moment.Moment;
};

const TwoMonthPicker = React.memo(({ onChange, isPeriodDisabled, value }: TTwoMonthPicker) => {
    const [left_pane_date, setLeftPaneDate] = React.useState(toMoment(value).clone().subtract(1, 'month'));
    const [right_pane_date, setRightPaneDate] = React.useState(value);

    /**
     * Navigate from date
     *
     * @param {moment.Moment} date
     */
    const navigateFrom = (date: moment.Moment) => {
        setLeftPaneDate(date);
        setRightPaneDate(addMonths(date.toISOString(), 1));
    };

    /**
     * Navigate to date
     *
     * @param {moment.Moment} date
     */
    const navigateTo = (date: moment.Moment) => {
        setLeftPaneDate(subMonths(date.toISOString(), 1));
        setRightPaneDate(toMoment(date));
    };

    /**
     * Only allow previous months to be available to navigate. Disable other periods
     *
     * @param {moment.Moment} date
     */
    const validateFromArrows = (date: moment.Moment) => {
        return diffInMonths(toMoment(left_pane_date), date) !== -1;
    };

    /**
     * Only allow next month to be available to navigate (unless next month is in the future).
     * Disable other periods
     *
     * @param {moment.Moment} date
     */
    const validateToArrows = (date: moment.Moment) => {
        const r_date = toMoment(right_pane_date).startOf('month');
        if (diffInMonths(toMoment().startOf('month'), r_date) === 0) return true; // future months are disallowed
        return diffInMonths(r_date, date) !== 1;
    };

    /**
     * Validate values to be date_from < date_to
     *
     * @param {moment.Moment} date
     */
    const shouldDisableDate = (date: moment.Moment) => {
        return isPeriodDisabled(date);
    };

    const jumpToCurrentMonth = () => {
        setLeftPaneDate(toMoment().subtract(1, 'month'));
        setRightPaneDate(toMoment());
    };

    const updateSelectedDate = (e: React.MouseEvent<HTMLElement>) => {
        onChange(moment.utc(e.currentTarget.dataset.date, 'YYYY-MM-DD'));
    };

    return (
        <React.Fragment>
            <div className='first-month' data-testid='first-month'>
                <Calendar.Header
                    calendar_date={left_pane_date}
                    calendar_view='date'
                    navigateTo={navigateFrom}
                    isPeriodDisabled={validateFromArrows}
                    hide_disabled_periods
                />
                <Calendar.Body
                    calendar_view='date'
                    calendar_date={left_pane_date}
                    selected_date={value}
                    date_format='YYYY-MM-DD'
                    isPeriodDisabled={shouldDisableDate}
                    hide_others
                    updateSelected={updateSelectedDate}
                />
            </div>
            <div className='second-month' data-testid='second-month'>
                <Calendar.Header
                    calendar_date={right_pane_date}
                    calendar_view='date'
                    isPeriodDisabled={validateToArrows}
                    navigateTo={navigateTo}
                    hide_disabled_periods
                />
                <Calendar.Body
                    calendar_view='date'
                    calendar_date={right_pane_date}
                    selected_date={value}
                    date_format='YYYY-MM-DD'
                    isPeriodDisabled={shouldDisableDate}
                    hide_others
                    updateSelected={updateSelectedDate}
                />
                <Calendar.Footer use_icon='IcCalendarForwardToday' has_today_btn onClick={jumpToCurrentMonth} />
            </div>
        </React.Fragment>
    );
});

TwoMonthPicker.displayName = 'TwoMonthPicker';

export default TwoMonthPicker;
