import React, { Component } from 'react';
import moment               from 'moment';
import CalendarHeader       from 'App/Components/Elements/Calendar/calendar-header.jsx';
import CalendarBody         from 'App/Components/Elements/Calendar/calendar-body.jsx';
import { toMoment }         from 'Utils/Date';

class DatePickerCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date : toMoment(props.date).unix(),
            view : 'year',
            year : undefined,
            month: undefined,
        };
    }

    navigateTo = (to) => {
        this.setState({
            date: to.unix(),
        });
    };

    isPeriodDisabled = (e, type, where) => {
        if (type === 'year' && where !== 'body') {
            return false;
        }
        return !(e.isAfter(this.props.min_date) && e.isBefore(this.props.max_date));
    };

    switchView = (view) => {
        this.setState({
            view,
        });
    };

    updateSelectedDate = (e, type) => {
        const map_mode = {
            month : 'date',
            year  : 'month',
            decade: 'year',
        };
        if (type === 'year') {
            this.props.onChange(moment.utc(e.currentTarget.dataset.year, 'YYYY').unix());
        }
        if (type === 'day') {
            this.props.onChange(moment.utc(e.currentTarget.dataset.date, 'YYYY-MM-DD').unix(), 'day');
        } else {
            const date = toMoment(this.props.value)[type === 'decade'
                ? 'year'
                : type](e.target.dataset[type].split('-')[0]).unix();

            this.setState({
                date,
                view: map_mode[type],
            });
        }
    };

    render() {
        return (
            <div className='calendar'>
                <CalendarHeader
                    calendar_date={this.state.date}
                    calendar_view={this.state.view}
                    navigateTo={this.navigateTo}
                    isPeriodDisabled={this.isPeriodDisabled}
                    hide_disabled_periods={true}
                    switchView={this.switchView}
                />
                <CalendarBody
                    calendar_view={this.state.view}
                    calendar_date={this.state.date}
                    selected_date={this.props.value}
                    date_format='YYYY-MM-DD'
                    isPeriodDisabled={this.isPeriodDisabled}
                    hide_others={false}
                    updateSelected={this.updateSelectedDate}
                />
            </div>
        );
    }
}

export default DatePickerCalendar;
