import PropTypes            from 'prop-types';
import React                from 'react';
import { localize }         from 'App/i18n';
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
        this.state = {
            show_to  : false,
            show_from: false,
            list     : [
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
        this.setActiveList();
        this.hideCalendar();
        this.applyBatch({
            from: from ? toMoment().startOf('day').subtract(from, 'day').add(1, 's').unix() : null,
            to  : toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix(),
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
        const date = epochToMoment(this.props.to);
        return daysFromTodayTo(date) === 0 ? localize('Today') : date.format('MMM, DD YYYY');
    }

    get from_date_label() {
        const date = epochToMoment(this.props.from);
        return this.props.from ? date.format('MMM, DD YYYY') : '';
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
        const to_date = epochToMoment(this.props.to).startOf('day').unix();
        const from_date = epochToMoment(this.props.from).startOf('day').unix();
        const that_day = epochToMoment(this.props.to).startOf('day').subtract(duration, 'days').unix();

        return today === to_date && that_day === from_date;
    }

    setToDate (date) {
        this.updateState('to', epochToMoment(date).endOf('day').unix());
    }

    setFromDate(date) {
        this.updateState('from', date);
    }

    updateState(key, value) {
        this.setActiveList();
        this.apply(key, value);
    }

    applyBatch (values) {
        this.props.onChange(values);
    }

    apply(key, value) {
        this.applyBatch({
            [key]: value,
        });
    }

    isPeriodDisabledTo (date) {
        return date + 1 <= this.props.from || date > toMoment().endOf('day').unix();
    }

    isPeriodDisabledFrom (date) {
        return date - 1 >= this.props.to;
    }

    render() {
        const {
            show_from,
            show_to,
            list,
        } = this.state;

        const {
            to,
            from,
        } = this.props;
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
                        value={to}
                        onChange={this.setToDate.bind(this)}
                        isPeriodDisabled={this.isPeriodDisabledTo.bind(this)}
                    />
                </div>}
                {show_from &&
                <div className='composite-calendar' ref={this.setWrapperRef}>
                    <SideList items={list} />
                    <TwoMonthPicker
                        value={from}
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

