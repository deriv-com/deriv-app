import dayjs from 'dayjs';
import React from 'react';
import { Calendar } from '@deriv/components';

type TTwoMonthPicker = {
    onChange: (date: dayjs.Dayjs) => void;
    isPeriodDisabled: (date: dayjs.Dayjs) => boolean;
    value: dayjs.Dayjs;
};

const TwoMonthPicker = React.memo(({ onChange, isPeriodDisabled, value }: TTwoMonthPicker) => {
    const [left_pane_date, setLeftPaneDate] = React.useState(value.clone().subtract(1, 'month'));
    const [right_pane_date, setRightPaneDate] = React.useState(value);

    const navigateFrom = (date: dayjs.Dayjs) => {
        setLeftPaneDate(date);
        setRightPaneDate(date.add(1, 'month'));
    };

    const navigateTo = (date: dayjs.Dayjs) => {
        setLeftPaneDate(date.subtract(1, 'month'));
        setRightPaneDate(date);
    };

    const validateFromArrows = (date: dayjs.Dayjs) => {
        return left_pane_date.diff(date, 'month') !== -1;
    };

    const validateToArrows = (date: dayjs.Dayjs) => {
        const r_date = right_pane_date.startOf('month');
        if (dayjs().startOf('month').diff(r_date, 'month') === 0) return true;
        return r_date.diff(date, 'month') !== 1;
    };

    const shouldDisableDate = (date: dayjs.Dayjs) => {
        return isPeriodDisabled(date);
    };

    const jumpToCurrentMonth = () => {
        setLeftPaneDate(dayjs().subtract(1, 'month'));
        setRightPaneDate(dayjs());
    };

    const updateSelectedDate = (e: React.MouseEvent<HTMLElement>) => {
        onChange(dayjs.utc(e.currentTarget.dataset.date, 'YYYY-MM-DD'));
    };

    return (
        <React.Fragment>
            <div className='first-month'>
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
            <div className='second-month'>
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