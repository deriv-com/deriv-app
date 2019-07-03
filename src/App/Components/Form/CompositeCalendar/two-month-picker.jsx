import PropTypes                from 'prop-types';
import moment                   from 'moment';
import React                    from 'react';
import CalendarBody            from 'App/Components/Elements/Calendar/calendar-body.jsx';
import CalendarHeader           from 'App/Components/Elements/Calendar/calendar-header.jsx';
import CalendarFooter           from 'App/Components/Elements/Calendar/calendar-footer.jsx';
import {
    addMonths,
    diffInMonths,
    epochToMoment,
    subMonths,
    toMoment,
}                               from 'Utils/Date';

class TwoMonthPicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            left_pane_date : subMonths(props.value, 1).unix(),
            right_pane_date: props.value,
        };
    }

    navigateFrom (e) {
        this.setState({
            left_pane_date : e.unix(),
            right_pane_date: addMonths(e, 1).unix(),
        });
    }

    /**
     * Only allow previous months to be available to navigate. Disable other periods
     *
     * @param date
     * @param range
     * @returns {boolean}
     */
    validateFromArrows(date, range) {
        return (range === 'year' || diffInMonths(epochToMoment(this.state.left_pane_date), date) !== -1);
    }

    /**
     * Validate values to be date_from < date_to
     */
    shouldDisableDate(date) {
        return this.props.isPeriodDisabled(date.unix());
    }

    /**
     * Only allow next month to be available to navigate (unless next month is in the future).
     * Disable other periods
     *
     * @param date
     * @param range
     * @returns {boolean}
     */
    validateToArrows(date, range) {
        if (range === 'year') return true; // disallow year arrows
        const r_date = epochToMoment(this.state.right_pane_date).startOf('month');
        if (diffInMonths(toMoment().startOf('month'), r_date) === 0) return true; // future months are disallowed
        return diffInMonths(r_date, date) !== 1;
    }

    jumpToCurrentMonth () {
        const current_month = toMoment().endOf('month').unix();
        this.setState({
            left_pane_date : epochToMoment(current_month).endOf('month').subtract(1, 'month').unix(),
            right_pane_date: current_month,
        });
    }

    navigateTo(e) {
        this.setState({
            left_pane_date : subMonths(e, 1).unix(),
            right_pane_date: toMoment(e).unix(),
        });
    }

    updateSelectedDate (e) {
        this.props.onChange(moment.utc(e.currentTarget.dataset.date, 'YYYY-MM-DD').unix());
    }

    render() {
        const {
            right_pane_date,
            left_pane_date,
        } = this.state;

        return (
            <React.Fragment>
                <div className='first-month'>
                    <CalendarHeader
                        calendar_date={left_pane_date}
                        calendar_view='date'
                        navigateTo={this.navigateFrom.bind(this)}
                        isPeriodDisabled={this.validateFromArrows.bind(this)}
                        hide_disabled_periods={true}
                        switchView={() => ({})}
                    />
                    <CalendarBody
                        calendar_view='date'
                        calendar_date={left_pane_date}
                        selected_date={this.props.value}
                        date_format='YYYY-MM-DD'
                        isPeriodDisabled={this.shouldDisableDate.bind(this)}
                        hide_others={true}
                        updateSelected={this.updateSelectedDate.bind(this)}
                    />
                </div>
                <div className='second-month'>
                    <CalendarHeader
                        calendar_date={right_pane_date}
                        calendar_view='date'
                        isPeriodDisabled={this.validateToArrows.bind(this)}
                        navigateTo={this.navigateTo.bind(this)}
                        hide_disabled_periods={true}
                        switchView={() => ({})}
                    />
                    <CalendarBody
                        calendar_view='date'
                        calendar_date={right_pane_date}
                        selected_date={this.props.value}
                        date_format='YYYY-MM-DD'
                        isPeriodDisabled={this.shouldDisableDate.bind(this)}
                        hide_others={true}
                        updateSelected={this.updateSelectedDate.bind(this)}
                    />
                    <CalendarFooter use_icon='IconCalendarForwardToday' has_today_btn={true} onClick={this.jumpToCurrentMonth.bind(this)} />
                </div>
            </React.Fragment>
        );
    }
}

TwoMonthPicker.propTypes = {
    isPeriodDisabled: PropTypes.func,
    onChange        : PropTypes.func,
    value           : PropTypes.number,
};
export default TwoMonthPicker;
