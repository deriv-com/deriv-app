import React from 'react';
import dayjs from 'dayjs';
import { Calendar } from '@deriv/components';

type TTwoMonthPickerProps = {
    onChange: (date: dayjs.Dayjs) => void;
    getIsPeriodDisabled: (date: dayjs.Dayjs) => boolean;
    value: dayjs.Dayjs | number;
};

type TCalendarPaneProps = {
    getIsPeriodDisabled: (date: dayjs.Dayjs) => boolean;
    navigateFn: (date: dayjs.Dayjs) => void;
    onChange: (date: dayjs.Dayjs) => void;
    paneDate: dayjs.Dayjs | number;
    validateArrows: (date: dayjs.Dayjs) => boolean;
    value: dayjs.Dayjs | number;
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
        onChange(dayjs.utc(e.currentTarget.dataset.date, 'YYYY-MM-DD'));
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
    const [left_pane_date, setLeftPaneDate] = React.useState(dayjs(value).subtract(1, 'month'));
    const [right_pane_date, setRightPaneDate] = React.useState(value);

    const navigateFrom = (date: dayjs.Dayjs) => {
        setLeftPaneDate(date);
        setRightPaneDate(dayjs(date).add(1, 'month'));
    };

    const navigateTo = (date: dayjs.Dayjs) => {
        setLeftPaneDate(dayjs(date).subtract(1, 'month'));
        setRightPaneDate(date);
    };

    const validateFromArrows = (date: dayjs.Dayjs) => {
        return dayjs(left_pane_date).diff(date, 'month') !== -1;
    };

    const validateToArrows = (date: dayjs.Dayjs) => {
        const r_date = dayjs(right_pane_date).startOf('month');
        if (dayjs().startOf('month').diff(r_date, 'month') === 0) return true;
        return r_date.diff(date, 'month') !== 1;
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