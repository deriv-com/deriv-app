import React, { Component }    from 'react';
import { localize } from '_common/localize';
import { toMoment } from 'Utils/Date';
import CalendarBody            from 'App/Components/Elements/Calendar/calendar-body.jsx';
import CalendarHeader          from 'App/Components/Elements/Calendar/calendar-header.jsx';

class CompositeCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show              : false,
            selected_date     : toMoment(),
            prepopulated_dates: {
                7 : localize('Past 7 days'),
                30: localize('Past month'),
                45: localize('Past 45 days'),
                90: localize('Past quarter'),
            },
        };
    }

    render() {
        // const now = toMoment().format('YYYY-MM-DD');
        const {
            show,
            selected_date,
        } = this.state;

        return (
            // eslint-disable-next-line react/no-children-prop
            <React.Fragment>
                <button onClick={this.showCalendar.bind(this)}>Here</button>
                {show &&
                <div className='composite-calendar'>
                    <div className='prepopulated-list'>
                        <ul>
                            {}
                        </ul>
                    </div>
                    <div className='first-month'>
                        <CalendarHeader
                            calendar_date={toMoment().format('YYYY-MM-DD')}
                            calendar_view='date'
                            isPeriodDisabled={() => (false)}
                            navigateTo={this.navigateTo}
                            switchView={this.switchView}
                        />
                        <CalendarBody
                            calendar_view='date'
                            calendar_date={toMoment()}
                            selected_date={selected_date}
                            date_format='YYYY-MM-DD'
                            isPeriodDisabled={() => (false)}
                            updateSelected={this.updateSelectedDate.bind(this)}
                        />
                    </div>
                    <div className='second-month'>
                        <CalendarHeader
                            calendar_date={toMoment().format('YYYY-MM-DD')}
                            calendar_view='date'
                            isPeriodDisabled={() => (false)}
                            navigateTo={this.navigateTo}
                            switchView={this.switchView}
                        />
                        <CalendarBody
                            calendar_view='date'
                            calendar_date={toMoment()}
                            selected_date={selected_date}
                            date_format='YYYY-MM-DD'
                            isPeriodDisabled={() => (false)}
                            updateSelected={this.updateSelectedDate.bind(this)}
                        />
                    </div>
                </div>
                }
            </React.Fragment>
        );
    }

    updateSelectedDate (e) {
        this.setState({
            selected_date: toMoment(e),
        });
    }

    showCalendar() {
        this.setState({
            show: true,
        });
    }
}

export default CompositeCalendar;
