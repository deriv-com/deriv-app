import PropTypes from 'prop-types';
import moment from 'moment';
import React from 'react';
import { Calendar } from '@deriv/components';
import { addMonths, diffInMonths, epochToMoment, subMonths, toMoment } from '@deriv/shared';

const TwoMonthPicker = React.memo(({ onChange, isPeriodDisabled, value }) => {
    const [left_pane_date, setLeftPaneDate] = React.useState(subMonths(value, 1).unix());
    const [right_pane_date, setRightPaneDate] = React.useState(value);

    const navigateFrom = e => {
        setLeftPaneDate(e.unix());
        setRightPaneDate(addMonths(e, 1).unix());
    };

    /**
     * Only allow previous months to be available to navigate. Disable other periods
     *
     * @param date
     * @param range
     * @returns {boolean}
     */
    const validateFromArrows = (date, range) => {
        return range === 'year' || diffInMonths(epochToMoment(left_pane_date), date) !== -1;
    };

    /**
     * Validate values to be date_from < date_to
     */
    const shouldDisableDate = date => {
        return isPeriodDisabled(date.unix());
    };

    /**
     * Only allow next month to be available to navigate (unless next month is in the future).
     * Disable other periods
     *
     * @param date
     * @param range
     * @returns {boolean}
     */
    const validateToArrows = (date, range) => {
        if (range === 'year') return true; // disallow year arrows
        const r_date = epochToMoment(right_pane_date).startOf('month');
        if (diffInMonths(toMoment().startOf('month'), r_date) === 0) return true; // future months are disallowed
        return diffInMonths(r_date, date) !== 1;
    };

    const jumpToCurrentMonth = () => {
        const current_month = toMoment().endOf('month').unix();
        setLeftPaneDate(epochToMoment(current_month).endOf('month').subtract(1, 'month').unix());
        setRightPaneDate(current_month);
    };

    const navigateTo = e => {
        setLeftPaneDate(subMonths(e, 1).unix());
        setRightPaneDate(toMoment(e).unix());
    };

    const updateSelectedDate = e => {
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

TwoMonthPicker.propTypes = {
    isPeriodDisabled: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.number,
};
export default TwoMonthPicker;
