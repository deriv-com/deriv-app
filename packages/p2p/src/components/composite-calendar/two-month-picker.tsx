import React from 'react';
import moment from 'moment';
import { Calendar } from '@deriv/components';
import { addMonths, diffInMonths, subMonths, toMoment } from '@deriv/shared';

type TTwoMonthPickerProps = {
    onChange: (date: moment.MomentInput) => void;
    getIsPeriodDisabled: (date: moment.Moment) => boolean;
    value: moment.Moment | number;
};

type TCalendarPaneProps = {
    getIsPeriodDisabled: (date: moment.Moment) => boolean;
    navigateFn: (date: moment.Moment) => void;
    onChange: (date: moment.MomentInput) => void;
    paneDate: moment.Moment | number;
    validateArrows: (date: moment.Moment) => boolean;
    value: moment.Moment | number;
};

const CalendarPane = ({
    getIsPeriodDisabled,
    navigateFn,
    onChange,
    paneDate,
    validateArrows,
    value,
}: TCalendarPaneProps) => {
    const updateSelectedDate = (e: React.MouseEvent<HTMLElement>) => {
        onChange(moment.utc(e.currentTarget.dataset.date, 'YYYY-MM-DD'));
    };

    return (
        <React.Fragment>
            <Calendar.Header
                calendar_date={paneDate}
                calendar_view='date'
                hide_disabled_periods
                isPeriodDisabled={validateArrows}
                navigateTo={navigateFn}
                switchView={() => ({})}
            />
            <Calendar.Body
                calendar_view='date'
                calendar_date={paneDate}
                date_format='YYYY-MM-DD'
                isPeriodDisabled={getIsPeriodDisabled}
                hide_others
                selected_date={value}
                updateSelected={updateSelectedDate}
            />
        </React.Fragment>
    );
};

const TwoMonthPicker = ({ onChange, getIsPeriodDisabled, value }: TTwoMonthPickerProps) => {
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

    return (
        <React.Fragment>
            <div className='first-month'>
                <CalendarPane
                    getIsPeriodDisabled={getIsPeriodDisabled}
                    navigateFn={navigateTo}
                    onChange={onChange}
                    paneDate={left_pane_date}
                    validateArrows={validateFromArrows}
                    value={value}
                />
            </div>
            <div className='second-month'>
                <CalendarPane
                    getIsPeriodDisabled={getIsPeriodDisabled}
                    navigateFn={navigateFrom}
                    onChange={onChange}
                    paneDate={right_pane_date}
                    validateArrows={validateToArrows}
                    value={value}
                />
            </div>
        </React.Fragment>
    );
};

export default React.memo(TwoMonthPicker);
