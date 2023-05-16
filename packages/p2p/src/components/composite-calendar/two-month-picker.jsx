import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar } from '@deriv/components';
import { addMonths, subMonths, toMoment } from '@deriv/shared';
import { shouldDisableDate, validateFromArrows, validateToArrows } from 'Utils/calendar';

const TwoMonthPicker = React.memo(({ onChange, isPeriodDisabled, value }) => {
    const [left_pane_date, setLeftPaneDate] = React.useState(subMonths(value, 1).unix());
    const [right_pane_date, setRightPaneDate] = React.useState(value);

    const navigateFrom = e => {
        setLeftPaneDate(e.unix());
        setRightPaneDate(addMonths(e, 1).unix());
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
                    isPeriodDisabled={(date, range) => validateFromArrows(date, range, left_pane_date)}
                    hide_disabled_periods={true}
                    switchView={() => ({})}
                />
                <Calendar.Body
                    calendar_view='date'
                    calendar_date={left_pane_date}
                    selected_date={value}
                    date_format='YYYY-MM-DD'
                    isPeriodDisabled={date => shouldDisableDate(date, isPeriodDisabled)}
                    hide_others={true}
                    updateSelected={updateSelectedDate}
                />
            </div>
            <div className='second-month'>
                <Calendar.Header
                    calendar_date={right_pane_date}
                    calendar_view='date'
                    isPeriodDisabled={(date, range) => validateToArrows(date, range, right_pane_date)}
                    navigateTo={navigateTo}
                    hide_disabled_periods
                    switchView={() => ({})}
                />
                <Calendar.Body
                    calendar_view='date'
                    calendar_date={right_pane_date}
                    selected_date={value}
                    date_format='YYYY-MM-DD'
                    isPeriodDisabled={date => shouldDisableDate(date, isPeriodDisabled)}
                    hide_others
                    updateSelected={updateSelectedDate}
                />
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
