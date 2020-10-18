import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { daysFromTodayTo, epochToMoment, toMoment } from '@deriv/shared';
import InputField from 'App/Components/Form/InputField/input-field.jsx';
import CompositeCalendarMobile from './composite-calendar-mobile.jsx';
import SideList from './side-list.jsx';
import CalendarIcon from './calendar-icon.jsx';

const TwoMonthPicker = Loadable({
    loader: () => import(/* webpackChunkName: "two-month-picker" */ './two-month-picker.jsx'),
    loading: () => null,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

class CompositeCalendar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show_to: false,
            show_from: false,
            list: [
                {
                    value: 'all_time',
                    label: localize('All time'),
                    onClick: () => this.selectDateRange(),
                    duration: 0,
                },
                {
                    value: 'last_7_days',
                    label: localize('Last 7 days'),
                    onClick: () => this.selectDateRange(7),
                    duration: 7,
                },
                {
                    value: 'last_30_days',
                    label: localize('Last 30 days'),
                    onClick: () => this.selectDateRange(30),
                    duration: 30,
                },
                {
                    value: 'last_60_days',
                    label: localize('Last 60 days'),
                    onClick: () => this.selectDateRange(60),
                    duration: 60,
                },
                {
                    value: 'last_quarter',
                    label: localize('Last quarter'),
                    onClick: () => this.selectDateRange(90),
                    duration: 90,
                },
            ],
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    selectDateRange(from) {
        this.hideCalendar();
        this.applyBatch({
            from: from ? toMoment().startOf('day').subtract(from, 'day').add(1, 's').unix() : null,
            to: toMoment().endOf('day').unix(),
            is_batch: true,
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

    hideCalendar() {
        this.setState({
            show_from: false,
            show_to: false,
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

    handleClickOutside(event) {
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

    setToDate(date) {
        this.updateState('to', epochToMoment(date).endOf('day').unix());
    }

    setFromDate(date) {
        this.updateState('from', date);
        this.hideCalendar();
    }

    updateState(key, value) {
        this.apply(key, value);
        this.hideCalendar();
    }

    applyBatch(values) {
        this.props.onChange(values);
    }

    apply(key, value) {
        this.applyBatch({
            [key]: value,
        });
    }

    isPeriodDisabledTo(date) {
        return date + 1 <= this.props.from || date > toMoment().endOf('day').unix();
    }

    isPeriodDisabledFrom(date) {
        return date - 1 >= this.props.to;
    }

    render() {
        const { show_from, show_to, list } = this.state;
        const { to, from } = this.props;

        return (
            // eslint-disable-next-line react/no-children-prop
            <>
                <DesktopWrapper>
                    <div id='dt_composite_calendar_inputs' className='composite-calendar__input-fields'>
                        <InputField
                            id='dt_calendar_input_from'
                            is_read_only={true}
                            placeholder={localize('Date from')}
                            icon={CalendarIcon}
                            onClick={this.showCalendar.bind(this, 'from')}
                            value={this.from_date_label}
                        />
                        <InputField
                            id='dt_calendar_input_to'
                            is_read_only={true}
                            placeholder={localize('Date to')}
                            icon={CalendarIcon}
                            onClick={this.showCalendar.bind(this, 'to')}
                            value={this.to_date_label}
                        />
                    </div>
                    {show_to && (
                        <div className='composite-calendar' ref={this.setWrapperRef}>
                            <SideList from={from} to={to} items={list} />
                            <TwoMonthPicker
                                value={to}
                                onChange={this.setToDate.bind(this)}
                                isPeriodDisabled={this.isPeriodDisabledTo.bind(this)}
                            />
                        </div>
                    )}
                    {show_from && (
                        <div className='composite-calendar' ref={this.setWrapperRef}>
                            <SideList from={from} to={to} items={list} />
                            <TwoMonthPicker
                                value={from}
                                onChange={this.setFromDate.bind(this)}
                                isPeriodDisabled={this.isPeriodDisabledFrom.bind(this)}
                            />
                        </div>
                    )}
                </DesktopWrapper>
                <MobileWrapper>
                    <CompositeCalendarMobile duration_list={this.state.list} {...this.props} />
                </MobileWrapper>
            </>
        );
    }
}

CompositeCalendar.propTypes = {
    from: PropTypes.number,
    onChange: PropTypes.func,
    to: PropTypes.number,
};
export default CompositeCalendar;
