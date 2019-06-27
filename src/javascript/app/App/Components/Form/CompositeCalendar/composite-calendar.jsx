import PropTypes            from 'prop-types';
import React                from 'react';
import { localize }         from '_common/localize';
import InputField           from 'App/Components/Form/InputField/input-field.jsx';
import IconCalendar         from 'Assets/Reports/icon-calendar.jsx';
import {
    daysFromTodayTo,
    epochToMoment,
    toMoment,
}                           from 'Utils/Date';
import SideList             from './side-list.jsx';
import TwoMonthPicker       from './two-month-picker.jsx';

class CompositeCalendar extends React.PureComponent {
    constructor(props) {
        super(props);
        const date = toMoment(props.to);

        this.state = {
            show_to           : false,
            show_from         : false,
            selected_to_date  : props.to ? props.to : date.clone().startOf('day').add(1, 'd').subtract(1, 's').unix(),
            selected_from_date: props.from ? props.from : null,
            list              : [
                { children: localize('All time'),     onClick: () => this.selectDateRange(0),  duration: 0, is_active: true },
                { children: localize('Last 7 days'),  onClick: () => this.selectDateRange(7),  duration: 7, is_active: false },
                { children: localize('Last 30 days'), onClick: () => this.selectDateRange(30), duration: 30, is_active: false },
                { children: localize('Last 60 days'), onClick: () => this.selectDateRange(60), duration: 60, is_active: false },
                { children: localize('Last quarter'), onClick: () => this.selectDateRange(90), duration: 90, is_active: false },
            ],
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    selectDateRange (from) {
        this.setState({
            selected_from_date: from ? toMoment().startOf('day').subtract(from, 'day').add(1, 's').unix() : null,
            selected_to_date  : toMoment().startOf('day').unix(),
        }, () => {
            this.setActiveList();
            this.hideCalendar();
            this.apply();
        });
    }

    setActiveList () {
        const copy = [...this.state.list];
        copy.forEach(item => item.is_active = !!this.isBoundToAList(item.duration));
        if (!copy.some(item => item.is_active)) {
            copy.forEach(item => {
                if (item.duration === 0) {
                    item.is_active = true;
                }
            });
        }
        this.setState({
            list: copy,
        });
    }

    get to_date_label() {
        const date = epochToMoment(this.state.selected_to_date);
        return daysFromTodayTo(date) === 0 ? localize('Today') : date.format('MMM, DD YYYY');
    }

    get from_date_label() {
        const date = epochToMoment(this.state.selected_from_date);
        return this.state.selected_from_date ? date.format('MMM, DD YYYY') : '';
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

    isBoundToAList(duration) {
        const today = toMoment().startOf('day').unix();
        const to_date = epochToMoment(this.state.selected_to_date).startOf('day').unix();
        const from_date = epochToMoment(this.state.selected_from_date).startOf('day').unix();
        const that_day = epochToMoment(this.state.selected_to_date).startOf('day').subtract(duration, 'days').unix();

        return today === to_date && that_day === from_date;
    }

    setToDate (date) {
        this.updateState('selected_to_date', epochToMoment(date).startOf('day').add(1, 'd').subtract(1, 's').unix());
    }

    setFromDate(date) {
        this.updateState('selected_from_date', date);
    }

    updateState(key, value) {
        this.setState({
            [key]: value,
        }, () => {
            this.setActiveList();
            this.apply();
        });
    }

    apply() {
        this.props.onChange({
            from: this.state.selected_from_date,
            to  : this.state.selected_to_date,
        });
    }

    isPeriodDisabledTo (date) {
        return date + 1 <= this.state.selected_from_date || date > toMoment().endOf('day').unix();
    }

    isPeriodDisabledFrom (date) {
        return date - 1 >= this.state.selected_to_date;
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
                <div className='composite-calendar__input-fields'>
                    <InputField is_read_only={true} placeholder={localize('Date from')} icon={IconCalendar} onClick={this.showCalendar.bind(this, 'from')} value={this.from_date_label} />
                    <InputField is_read_only={true} placeholder={localize('Date to')} icon={IconCalendar} onClick={this.showCalendar.bind(this, 'to')} value={this.to_date_label} />
                </div>
                {show_to &&
                <div className='composite-calendar' ref={this.setWrapperRef}>
                    <SideList items={list} />
                    <TwoMonthPicker
                        value={selected_to_date}
                        onChange={this.setToDate.bind(this)}
                        isPeriodDisabled={this.isPeriodDisabledTo.bind(this)}
                    />
                </div>}
                {show_from &&
                <div className='composite-calendar' ref={this.setWrapperRef}>
                    <SideList items={list} />
                    <TwoMonthPicker
                        value={selected_from_date}
                        onChange={this.setFromDate.bind(this)}
                        isPeriodDisabled={this.isPeriodDisabledFrom.bind(this)}
                    />
                </div>}
            </React.Fragment>
        );
    }
}

CompositeCalendar.propTypes = {
    from    : PropTypes.number,
    onChange: PropTypes.func,
    to      : PropTypes.number,
};
export default CompositeCalendar;

