import moment from 'moment';
import React from 'react';
import { Calendar } from '@deriv/components';
import { addMonths, diffInMonths, epochToMoment, subMonths, toMoment } from '@deriv/shared';

type TTwoMonthPicker = {
    onChange: (date: moment.MomentInput) => void;
    isPeriodDisabled: (date: moment.MomentInput) => boolean;
    value: number;
};

const TwoMonthPicker = React.memo(({ onChange, isPeriodDisabled, value }: TTwoMonthPicker) => {
    const [left_pane_date, setLeftPaneDate] = React.useState(
        subMonths(value ? new Date(value * 1000).toISOString() : '', 1).unix()
    );
    const [right_pane_date, setRightPaneDate] = React.useState(value);

    /**
     * Navigate from date
     *
     * @param {moment.Moment} date
     */
    const navigateFrom = (date: moment.Moment) => {
        setLeftPaneDate(date.unix());
        setRightPaneDate(addMonths(date.toISOString(), 1).unix());
    };

    /**
     * Navigate to date
     *
     * @param {moment.Moment} date
     */
    const navigateTo = (date: moment.Moment) => {
        setLeftPaneDate(subMonths(date.toISOString(), 1).unix());
        setRightPaneDate(toMoment(date).unix());
    };

    /**
     * Only allow previous months to be available to navigate. Disable other periods
     *
     * @param {moment.Moment} date
     * @param {Extract<moment.DurationInputArg2, 'month'>} range
     */
    const validateFromArrows = (date: moment.Moment, range: Extract<moment.DurationInputArg2, 'month'>) => {
        return diffInMonths(epochToMoment(left_pane_date), date) !== -1;
    };

    /**
     * Only allow next month to be available to navigate (unless next month is in the future).
     * Disable other periods
     *
     * @param {moment.Moment} date
     * @param {Extract<moment.DurationInputArg2, 'month'>} range
     */
    const validateToArrows = (date: moment.Moment, range: Extract<moment.DurationInputArg2, 'month'>) => {
        const r_date = epochToMoment(right_pane_date).startOf('month');
        if (diffInMonths(toMoment().startOf('month'), r_date) === 0) return true; // future months are disallowed
        return diffInMonths(r_date, date) !== 1;
    };

    /**
     * Validate values to be date_from < date_to
     *
     * @param {moment.Moment} date
     */
    const shouldDisableDate = (date: moment.Moment) => {
        return isPeriodDisabled(date.unix());
    };

    const jumpToCurrentMonth = () => {
        const current_month = toMoment().endOf('month').unix();
        setLeftPaneDate(epochToMoment(current_month).endOf('month').subtract(1, 'month').unix());
        setRightPaneDate(current_month);
    };

    const updateSelectedDate = (e: React.MouseEvent<HTMLElement>) => {
        onChange(moment.utc(e.currentTarget.dataset.date, 'YYYY-MM-DD').unix());
    };

    return (
        <React.Fragment>
            <div className='first-month'>
                <Calendar.Header
                    calendar_date={left_pane_date}
                    calendar_view='date'
                    navigateTo={navigateFrom}
                    isPeriodDisabled={validateFromArrows}
                    hide_disabled_periods={true}
                    switchView={() => ({})}
                />
                <Calendar.Body
                    calendar_view='date'
                    calendar_date={left_pane_date}
                    selected_date={value}
                    date_format='YYYY-MM-DD'
                    isPeriodDisabled={shouldDisableDate}
                    hide_others={true}
                    updateSelected={updateSelectedDate}
                />
            </div>
            <div className='second-month'>
                <Calendar.Header
                    calendar_date={right_pane_date}
                    calendar_view='date'
                    isPeriodDisabled={validateToArrows}
                    navigateTo={navigateTo}
                    hide_disabled_periods
                    switchView={() => ({})}
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
                <Calendar.Footer use_icon='IcCalendarForwardToday' has_today_btn={true} onClick={jumpToCurrentMonth} />
            </div>
        </React.Fragment>
    );
});

TwoMonthPicker.displayName = 'TwoMonthPicker';

export default TwoMonthPicker;
