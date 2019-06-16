
import React, { Component } from 'react';
import { localize }         from '_common/localize';
import InputField           from 'App/Components/Form/InputField/input-field.jsx';
import {
    daysFromTodayTo,
    epochToMoment,
    subDays,
    toMoment,
}                           from 'Utils/Date';
import TwoMonthPicker       from './two-month-picker.jsx';

class CompositeCalendar extends Component {
    constructor(props) {
        super(props);
        const date = toMoment(props.to);

        this.state = {
            show_to           : false,
            show_from         : false,
            selected_to_date  : date.unix(),
            selected_from_date: props.from ? toMoment(props.from) : null,
            list              : [
                { children: localize('All time'),     onClick: () => this.selectDateRange(0) },
                { children: localize('Last 7 days'),  onClick: () => this.selectDateRange(7) },
                { children: localize('Last 30 days'), onClick: () => this.selectDateRange(30) },
                { children: localize('Last 60 days'), onClick: () => this.selectDateRange(60) },
                { children: localize('Last quarter'), onClick: () => this.selectDateRange(90) },
            ],
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    selectDateRange (from) {
        const now = toMoment();
        this.setState({
            selected_from_date: from ? subDays(now, from).unix() : null,
            selected_to_date  : now.unix(),
        });
        this.hideCalendar();
    }

    get to_date_label() {
        const date = epochToMoment(this.state.selected_to_date);
        return daysFromTodayTo(date) === 0 ? localize('Today') : date.format('MMM, DD YYYY');
    }

    get from_date_label() {
        const date = epochToMoment(this.state.selected_from_date);
        return !this.state.selected_from_date ? localize('From the start') : date.format('MMM, DD YYYY');
    }

    hideCalendar () {
        this.setState({
            show_from: false,
            show_to  : false,
        });
    }

    showCalendar(e) {
        this.setState({
            [`show_${e}`]: true,
        });
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside (event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            event.stopPropagation();
            event.preventDefault();
            this.hideCalendar();
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        const {
            show_from,
            show_to,
            selected_to_date,
            selected_from_date,
            list,
        } = this.state;

        return (
            // eslint-disable-next-line react/no-children-prop
            <React.Fragment>
                <InputField  onClick={this.showCalendar.bind(this, 'from')} value={this.from_date_label} />
                <InputField  onClick={this.showCalendar.bind(this, 'to')} value={this.to_date_label} />
                {show_to &&
                <div className='composite-calendar' ref={this.setWrapperRef}>
                    <div className='composite-calendar__prepopulated-list'>
                        <ul>
                            {list.map((item, index) => <li key={index} {...item} />)}
                        </ul>
                    </div>
                    <TwoMonthPicker
                        key='to-date'
                        value={selected_to_date}
                        onChange={(e) => {
                            this.setState({
                                selected_to_date: e,
                            });
                        }}
                    />
                </div>}
                {show_from &&
                <div className='composite-calendar' ref={this.setWrapperRef}>
                    <div className='composite-calendar__prepopulated-list'>
                        <ul>
                            {list.map((item, index) => <li key={index} {...item} />)}
                        </ul>
                    </div>
                    <TwoMonthPicker
                        key='to-date'
                        value={selected_from_date}
                        onChange={(e) => {
                            this.setState({
                                selected_from_date: e,
                            });
                        }}
                    />
                </div>}
            </React.Fragment>
        );
    }
}

export default CompositeCalendar;
