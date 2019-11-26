import PropTypes      from 'prop-types';
import React          from 'react';
import {
    getStartOfMonth,
    toMoment }        from 'Utils/Date';
import { localize }   from 'deriv-translations';
import CalendarBody   from './calendar-body.jsx';
import CalendarFooter from './calendar-footer.jsx';
import CalendarHeader from './calendar-header.jsx';

class Calendar extends React.PureComponent {
    constructor(props) {
        super(props);
        const { date_format, start_date, value } = props;
        const current_date = toMoment(value || start_date).format(date_format);
        this.state = {
            calendar_date: current_date, // calendar date reference
            selected_date: value,        // selected date
            calendar_view: 'date',
            hovered_date : '',
            duration_date: '',
        };
    }

    switchView = (view) => {
        this.setState({ calendar_view: view });
    };

    navigateTo = (new_date) => {
        this.setState({
            calendar_date: toMoment(new_date).format(this.props.date_format),
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
                hovered_date : target.getAttribute('data-date'),
                duration_date: target.getAttribute('data-duration'),
            });
        }
    };

    onMouseLeave = (event) => {
        const target = event.currentTarget;

        if (target.classList.contains('calendar__cell--hover')) {
            target.classList.remove('calendar__cell--hover');

            this.setState({
                hovered_date : null,
                duration_date: null,
            });
        }
    };

    updateSelectedDate = (e) => {
        const { date_format, max_date, min_date, onSelect } = this.props;

        const moment_date = toMoment(e.target.dataset.date).startOf('day');
        const is_before   = moment_date.isBefore(toMoment(min_date));
        const is_after    = moment_date.isAfter(toMoment(max_date));

        if (is_before || is_after) {
            return;
        }

        const formatted_date = moment_date.format(date_format);
        this.setState({
            calendar_date: formatted_date,
            selected_date: formatted_date,
        });

        if (onSelect) {
            onSelect(formatted_date);
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
        const date = toMoment(this.state.calendar_date)[type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0]).format(this.props.date_format);

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
        const { date_format, start_date } = this.props;

        const default_date = toMoment(start_date).format(date_format);
        this.setState({
            calendar_date: default_date,
            selected_date: '',
            calendar_view: 'date',
        });
    };

    setToday = () => {
        const { date_format, onSelect } = this.props;

        const now = toMoment().format(date_format);
        this.setState({
            calendar_date: now,
            selected_date: now,
            calendar_view: 'date',
        });

        if (onSelect) {
            onSelect(now, true);
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
        const { date_format, duration_date, footer, has_today_btn, has_range_selection,
            holidays, start_date, weekends } = this.props;
        const { calendar_date, calendar_view, selected_date  } = this.state;
        let default_message, is_minimum;

        if (duration_date) {
            default_message = `${duration_date} ${duration_date === 1 ? localize('Day') : localize('Days')}`;
            is_minimum = false;
        } else {
            default_message = localize('Minimum duration is 1 day');
            is_minimum = true;
        }

        return (
            <div className='calendar' data-value={selected_date}>
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
                    start_date={start_date}
                    selected_date={selected_date}
                    updateSelected={this.updateSelected}
                    holidays={holidays}
                    has_range_selection={has_range_selection}
                    hovered_date={this.state.hovered_date}
                    weekends={weekends}
                    onMouseOver={this.onMouseOver}
                    onMouseLeave={this.onMouseLeave}
                />
                <CalendarFooter
                    footer={footer}
                    duration_date={this.state.duration_date || default_message}
                    is_minimum={is_minimum}
                    has_today_btn={has_today_btn}
                    has_range_selection={has_range_selection}
                    onClick={this.setToday}
                />
            </div>
        );
    }
}

Calendar.defaultProps = {
    date_format: 'YYYY-MM-DD',
    min_date   : toMoment(0).format('YYYY-MM-DD'),               // by default, min_date is set to Unix Epoch (January 1st 1970)
    max_date   : toMoment().add(120, 'y').format('YYYY-MM-DD'), // by default, max_date is set to 120 years after today
};

Calendar.propTypes = {
    date_format  : PropTypes.string,
    duration_date: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    footer             : PropTypes.string,
    has_range_selection: PropTypes.bool,
    has_today_btn      : PropTypes.bool,
    holidays           : PropTypes.arrayOf(
        PropTypes.shape({
            dates  : PropTypes.array,
            descrip: PropTypes.string,
        }),
    ),
    max_date: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    min_date: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    onChangeCalendarMonth: PropTypes.func,
    onSelect             : PropTypes.func,
    start_date           : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    value   : PropTypes.string,
    weekends: PropTypes.arrayOf(PropTypes.number),
};

export default Calendar;
