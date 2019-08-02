import PropTypes      from 'prop-types';
import React          from 'react';
import {
    getStartOfMonth,
    toMoment }        from 'Utils/Date';
import CalendarBody   from './calendar-body.jsx';
import CalendarFooter from './calendar-footer.jsx';
import CalendarHeader from './calendar-header.jsx';

class Calendar extends React.PureComponent {
    state = {
        calendar_date: toMoment(),          // calendar date reference
        selected_date: this.props.duration ? this.props.duration.unix() : toMoment(this.props.value).unix(), // selected date
        calendar_view: 'date',
        hovered_date : null,
    };

    switchView = (view) => this.setState({ calendar_view: view });

    navigateTo = (new_date) => {
        this.setState({
            calendar_date: toMoment(new_date), // .format(this.props.date_format),
        }, () => {
            if (this.props.onChangeCalendarMonth) {
                const start_of_month = getStartOfMonth(new_date);
                this.props.onChangeCalendarMonth(start_of_month);
            }
        });
    };

    onMouseOver = (event) => {
        const target = event.currentTarget;

        if (!target.classList.contains('calendar__cell--disabled') && !target.classList.contains('calendar__cell--hover')) {
            target.className += ' calendar__cell--hover';
            this.setState({
                hovered_date: toMoment(target.getAttribute('data-date')).unix(),
            });
        }
    };

    onMouseLeave = (event) => {
        const target = event.currentTarget;

        if (target.classList.contains('calendar__cell--hover')) {
            target.classList.remove('calendar__cell--hover');

            this.setState({ hovered_date: null });
        }
    };

    updateSelectedDate = (e) => {
        const { max_date, min_date, onSelect } = this.props;

        const moment_date = toMoment(e.target.dataset.date).startOf('day');
        const is_before   = moment_date.isBefore(toMoment(min_date));
        const is_after    = moment_date.isAfter(toMoment(max_date));

        if (is_before || is_after) {
            return;
        }

        this.setState({
            calendar_date: moment_date,
            selected_date: moment_date.unix(),
        });

        if (onSelect) {
            onSelect(moment_date);
        }
    };

    updateSelected = (e, type) => {
        if (e) e.stopPropagation();

        if (type === 'day') {
            this.updateSelectedDate(e);
            return;
        }

        const view_map = {
            month : 'date',
            year  : 'month',
            decade: 'year',
        };
        const date = toMoment(this.state.calendar_date)[type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0]);

        if (this.isPeriodDisabled(date, type)) return;

        this.setState({
            calendar_date: date,
            calendar_view: view_map[type],
        }, () => {
            if (this.props.onChangeCalendarMonth) {
                const start_of_month = getStartOfMonth(date);
                this.props.onChangeCalendarMonth(start_of_month);
            }
        });
    };

    resetCalendar = () => {
        const default_date = toMoment(this.props.start_date);

        this.setState({
            calendar_date: default_date,
            selected_date: default_date.unix(),
            calendar_view: 'date',
        });
    };

    setToday = () => {
        const now = toMoment();

        this.setState({
            calendar_date: now,
            selected_date: now.unix(),
            calendar_view: 'date',
        });

        if (this.props.onSelect) {
            this.props.onSelect(now, true);
        }
    };

    isPeriodDisabled = (date, unit) => {
        const { max_date, min_date } = this.props;

        const start_of_period = toMoment(date).clone().startOf(unit);
        const end_of_period   = toMoment(date).clone().endOf(unit);

        return end_of_period.isBefore(toMoment(min_date))
            || start_of_period.isAfter(toMoment(max_date));
    };

    render() {
        const {
            date_format,
            footer,
            has_today_btn,
            has_range_selection,
            holidays,
            start_date,
            weekends,
        } = this.props;

        const {
            calendar_date,
            calendar_view,
            selected_date,
        } = this.state;

        return (
            <div className='calendar'>
                <CalendarHeader
                    calendar_date={calendar_date}
                    calendar_view={calendar_view}
                    isPeriodDisabled={this.isPeriodDisabled}
                    navigateTo={this.navigateTo}
                    switchView={this.switchView}
                />
                <CalendarBody
                    calendar_date={calendar_date}
                    calendar_view={calendar_view}
                    date_format={date_format}
                    isPeriodDisabled={this.isPeriodDisabled}
                    has_range_selection={has_range_selection}
                    holidays={holidays}
                    hovered_date={this.state.hovered_date}
                    onMouseOver={this.onMouseOver}
                    onMouseLeave={this.onMouseLeave}
                    selected_date={selected_date}
                    start_date={start_date}
                    updateSelected={this.updateSelected}
                    weekends={weekends}
                />
                <CalendarFooter
                    footer={footer}
                    has_range_selection={has_range_selection}
                    has_today_btn={has_today_btn}
                    onClick={this.setToday}
                    value={this.state.hovered_date || this.state.selected_date}
                />
            </div>
        );
    }
}

Calendar.defaultProps = {
    date_format: 'YYYY-MM-DD',
    min_date   : toMoment(0),              // by default, min_date is set to Unix Epoch (January 1st 1970)
    max_date   : toMoment().add(120, 'y'), // by default, max_date is set to 120 years after today
};

Calendar.propTypes = {
    date_format        : PropTypes.string,
    footer             : PropTypes.string,
    has_range_selection: PropTypes.bool,
    has_today_btn      : PropTypes.bool,
    holidays           : PropTypes.arrayOf(
        PropTypes.shape({
            dates  : PropTypes.array,
            descrip: PropTypes.string,
        }),
    ),
    max_date             : PropTypes.object,
    min_date             : PropTypes.object,
    onChangeCalendarMonth: PropTypes.func,
    onSelect             : PropTypes.func,
    start_date           : PropTypes.number,
    value                : PropTypes.oneOfType([
        PropTypes.number, // num. of days
        PropTypes.object, // moment object
    ]),
    weekends: PropTypes.arrayOf(PropTypes.number),
};

export default Calendar;
