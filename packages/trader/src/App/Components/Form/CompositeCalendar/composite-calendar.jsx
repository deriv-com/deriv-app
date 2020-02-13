import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, DesktopWrapper, MobileDialog, MobileWrapper, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import DatePicker from 'App/Components/Form/DatePicker';
import InputField from 'App/Components/Form/InputField/input-field.jsx';
import Lazy from 'App/Containers/Lazy';
import { daysFromTodayTo, epochToMoment, toMoment } from 'Utils/Date';
import SideList from './side-list.jsx';

export const RadioButton = ({ id, className, selected_value, value, label, onChange }) => {
    return (
        <label
            htmlFor={id}
            className={classNames('composite-calendar-modal__radio', className, {
                'composite-calendar-modal__radio--selected': selected_value === value,
            })}
            onClick={() => onChange({ label, value })}
        >
            <input className='composite-calendar-modal__radio__input' id={id} type='radio' value={value} />
            <span
                className={classNames('composite-calendar-modal__radio__circle', {
                    'composite-calendar-modal__radio__circle--selected': selected_value === value,
                })}
            />
            <p className='composite-calendar-modal__radio__label'>{label}</p>
        </label>
    );
};

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
        this.state.selected_date_range = this.state.list.find(range => range.value === 'all_time');

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    selectDateRange(from) {
        this.hideCalendar();
        this.applyBatch({
            from: Number.isFinite(from)
                ? toMoment()
                      .startOf('day')
                      .subtract(from, 'day')
                      .add(1, 's')
                      .unix()
                : null,
            to: toMoment()
                .endOf('day')
                .unix(),
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
        this.updateState(
            'to',
            epochToMoment(date)
                .endOf('day')
                .unix()
        );
    }

    setFromDate(date) {
        this.updateState('from', date);
    }

    updateState(key, value) {
        this.apply(key, value);
    }

    applyBatch(values) {
        this.props.onChange(values);
    }

    apply(key, value) {
        this.applyBatch({
            [key]: value,
        });
    }

    applyDateRange = () => {
        const { selected_date_range } = this.state;
        const selected_range = this.state.list.find(r => selected_date_range && r.value === selected_date_range.value);
        if (selected_range && selected_range.onClick) {
            selected_range.onClick();
        }
        this.setState({ open: false });
    };

    selectToday = () => {
        this.selectDateRange(0);
        this.setState({
            selected_date_range: {
                label: localize('Today'),
            },
            open: false,
        });
    };

    isPeriodDisabledTo(date) {
        return (
            date + 1 <= this.props.from ||
            date >
                toMoment()
                    .endOf('day')
                    .unix()
        );
    }

    isPeriodDisabledFrom(date) {
        return date - 1 >= this.props.to;
    }

    getMobileFooter() {
        return (
            <div className='composite-calendar-modal__actions'>
                <Button
                    className='composite-calendar-modal__actions__cancel'
                    text={localize('Cancel')}
                    onClick={() => this.setState({ open: false })}
                    has_effect
                    secondary
                    large
                />
                <Button
                    className='composite-calendar-modal__actions__ok'
                    text={localize('OK')}
                    onClick={this.applyDateRange}
                    has_effect
                    primary
                    large
                />
            </div>
        );
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
                            icon={() => <Icon icon='IcCalendarDatefrom' className='inline-icon' />}
                            onClick={this.showCalendar.bind(this, 'from')}
                            value={this.from_date_label}
                        />
                        <InputField
                            id='dt_calendar_input_to'
                            is_read_only={true}
                            placeholder={localize('Date to')}
                            icon={() => <Icon icon='IcCalendarDateto' className='inline-icon' />}
                            onClick={this.showCalendar.bind(this, 'to')}
                            value={this.to_date_label}
                        />
                    </div>
                    {show_to && (
                        <div className='composite-calendar' ref={this.setWrapperRef}>
                            <SideList from={from} to={to} items={list} />
                            <Lazy
                                ctor={() => import(/* webpackChunkName: "two-month-picker" */ './two-month-picker.jsx')}
                                should_load={true}
                                has_progress={false}
                                value={to}
                                onChange={this.setToDate.bind(this)}
                                isPeriodDisabled={this.isPeriodDisabledTo.bind(this)}
                            />
                        </div>
                    )}
                    {show_from && (
                        <div className='composite-calendar' ref={this.setWrapperRef}>
                            <SideList from={from} to={to} items={list} />
                            <Lazy
                                ctor={() => import(/* webpackChunkName: "two-month-picker" */ './two-month-picker.jsx')}
                                should_load={true}
                                has_progress={false}
                                value={from}
                                onChange={this.setFromDate.bind(this)}
                                isPeriodDisabled={this.isPeriodDisabledFrom.bind(this)}
                            />
                        </div>
                    )}
                </DesktopWrapper>
                <MobileWrapper>
                    <div className='composite-calendar__input-fields composite-calendar__input-fields--fill'>
                        <InputField
                            id='dt_calendar_input'
                            is_read_only={true}
                            icon={() => <Icon icon='IcCalendarDatefrom' className='inline-icon' />}
                            onClick={() => this.setState({ open: true })}
                            value={this.state.selected_date_range.label}
                        />
                    </div>
                    <MobileDialog
                        portal_element_id='deriv_app'
                        title={localize('Please select duration')}
                        visible={this.state.open}
                        onClose={() => this.setState({ open: false })}
                        footer={this.getMobileFooter()}
                    >
                        <div className='composite-calendar-modal'>
                            <div className='composite-calendar-modal__radio-group'>
                                {this.state.list.map(duration => (
                                    <RadioButton
                                        id={`composite-calendar-modal__radio__${duration.value}`}
                                        key={duration.value}
                                        value={duration.value}
                                        label={duration.label}
                                        selected_value={this.state.selected_date_range.value}
                                        onChange={date_range => this.setState({ selected_date_range: date_range })}
                                    />
                                ))}
                            </div>
                            <div className='composite-calendar-modal__custom-date-range'>
                                <RadioButton
                                    id={'composite-calendar-modal__radio__custom'}
                                    className='composite-calendar-modal__radio__custom'
                                    value={'custom'}
                                    label={localize('Custom')}
                                    selected_value={this.state.selected_date_range.value}
                                    onChange={date_range => this.setState({ selected_date_range: date_range })}
                                />
                                <DatePicker
                                    name='composite-calendar-modal__radio__custom__start-date'
                                    is_nativepicker={false}
                                    placeholder={localize('Start Date')}
                                    value={this.state.from}
                                    onChange={e => {
                                        this.setState({ from: e.target.value });
                                    }}
                                />
                                <DatePicker
                                    name='composite-calendar-modal__radio__custom__end-date'
                                    is_nativepicker={false}
                                    placeholder={localize('End Date')}
                                />
                            </div>
                            <Button
                                className='composite-calendar-modal__actions__today'
                                text={localize('Back to today')}
                                onClick={this.selectToday}
                                has_effect
                                tertiary
                                large
                            />
                        </div>
                    </MobileDialog>
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
