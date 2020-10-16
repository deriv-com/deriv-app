import PropTypes from 'prop-types';
import React from 'react';
import { getStartOfMonth, toMoment } from '@deriv/shared';
import Body from './calendar-body.jsx';
import Footer from './calendar-footer.jsx';
import Header from './calendar-header.jsx';

class Calendar extends React.PureComponent {
    constructor(props) {
        super(props);
        const { date_format, start_date, value } = props;
        const current_date = toMoment(value || start_date).format(date_format);
        this.state = {
            calendar_date: current_date, // calendar date reference
            selected_date: value, // selected date
            calendar_view: this.props.calendar_view || 'date',
            hovered_date: '',
        };
    }

    componentDidMount() {
        if (typeof this.props.onRef === 'function') {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        if (typeof this.props.onRef === 'function') {
            this.props.onRef(undefined);
        }
    }

    switchView = view => {
        this.setState({ calendar_view: view });
    };

    navigateTo = new_date => {
        this.setState(
            {
                calendar_date: toMoment(new_date).format(this.props.date_format),
            },
            () => {
                if (this.props.onChangeCalendarMonth) {
                    const start_of_month = getStartOfMonth(new_date);
                    this.props.onChangeCalendarMonth(start_of_month);
                }
            }
        );
    };

    onMouseOver = event => {
        const target = event.currentTarget;

        if (
            !target.classList.contains('dc-calendar__cell--disabled') &&
            !target.classList.contains('dc-calendar__cell--hover')
        ) {
            target.className += ' dc-calendar__cell--hover';
            this.setState(
                {
                    hovered_date: target.getAttribute('data-date'),
                },
                () => {
                    if (this.props.onHover) {
                        this.props.onHover(this.state.hovered_date);
                    }
                }
            );
        }
    };

    onMouseLeave = event => {
        const target = event.currentTarget;

        if (target.classList.contains('dc-calendar__cell--hover')) {
            target.classList.remove('dc-calendar__cell--hover');

            this.setState(
                {
                    hovered_date: null,
                },
                () => {
                    if (this.props.onHover) {
                        this.props.onHover(this.state.selected_date);
                    }
                }
            );
        }
    };

    updateSelectedDate = e => {
        const { date_format, max_date, min_date, onSelect } = this.props;

        const moment_date = toMoment(e.target.dataset.date).startOf('day');
        const is_before = moment_date.isBefore(toMoment(min_date));
        const is_after = moment_date.isAfter(toMoment(max_date));

        if (is_before || is_after) {
            return;
        }

        const formatted_date = moment_date.format(date_format);
        this.setState({
            calendar_date: formatted_date,
            selected_date: formatted_date,
        });

        if (onSelect) {
            onSelect(formatted_date, this.props.keep_open);
        }
    };

    updateSelected = (e, type) => {
        if (e) e.stopPropagation();

        if (type === 'day') {
            this.updateSelectedDate(e);
            return;
        }

        const view_map = {
            month: 'date',
            year: 'month',
            decade: 'year',
        };
        const date = toMoment(this.state.calendar_date)
            [type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0])
            .format(this.props.date_format);

        if (this.isPeriodDisabled(date, type)) return;

        this.setState(
            {
                calendar_date: date,
                calendar_view: view_map[type],
            },
            () => {
                if (this.props.onChangeCalendarMonth) {
                    const start_of_month = getStartOfMonth(date);
                    this.props.onChangeCalendarMonth(start_of_month);
                }
            }
        );
    };

    setSelectedDate = date => {
        const moment_date = toMoment(date).startOf('day');
        const formatted_date = moment_date.format(this.props.date_format);
        this.setState({
            calendar_date: formatted_date,
            selected_date: formatted_date,
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
        const end_of_period = toMoment(date).clone().endOf(unit);
        return end_of_period.isBefore(toMoment(min_date)) || start_of_period.isAfter(toMoment(max_date));
    };

    render() {
        const {
            date_format,
            footer,
            has_today_btn,
            has_range_selection,
            events,
            start_date,
            disabled_days,
        } = this.props;
        const { calendar_date, calendar_view, selected_date } = this.state;

        return (
            <div ref={this.props.forward_ref} className='dc-calendar' data-value={selected_date}>
                <Header
                    calendar_date={calendar_date}
                    calendar_view={calendar_view}
                    isPeriodDisabled={this.isPeriodDisabled}
                    navigateTo={this.navigateTo}
                    switchView={this.switchView}
                />
                <Body
                    calendar_date={calendar_date}
                    calendar_view={calendar_view}
                    date_format={date_format}
                    disabled_days={disabled_days}
                    isPeriodDisabled={this.isPeriodDisabled}
                    start_date={start_date}
                    selected_date={selected_date}
                    updateSelected={this.updateSelected}
                    events={events}
                    has_range_selection={has_range_selection}
                    hovered_date={this.state.hovered_date}
                    onMouseOver={this.onMouseOver}
                    onMouseLeave={this.onMouseLeave}
                />
                <Footer footer={footer} has_today_btn={has_today_btn} onClick={this.setToday} />
            </div>
        );
    }
}

Calendar.Body = Body;
Calendar.Header = Header;
Calendar.Footer = Footer;

Calendar.defaultProps = {
    date_format: 'YYYY-MM-DD',
    min_date: '1970-01-01', // by default, min_date is set to Unix Epoch (January 1st 1970)
    max_date: toMoment().add(120, 'y').format('YYYY-MM-DD'), // by default, max_date is set to 120 years after today
};

Calendar.propTypes = {
    date_format: PropTypes.string,
    footer: PropTypes.string,
    has_today_btn: PropTypes.bool,
    holidays: PropTypes.arrayOf(
        PropTypes.shape({
            dates: PropTypes.array,
            descrip: PropTypes.string,
        })
    ),
    max_date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    min_date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    onChangeCalendarMonth: PropTypes.func,
    onSelect: PropTypes.func,
    start_date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disable_days: PropTypes.arrayOf(PropTypes.number),
};

export default Calendar;
