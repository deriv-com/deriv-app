import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import { CSSTransition }    from 'react-transition-group';
import Icon                 from 'Assets/icon.jsx';
import InputField           from 'App/Components/Form/InputField';
import {
    addDays,
    daysFromTodayTo,
    formatDate,
    getStartOfMonth,
    isDateValid,
    toMoment }              from 'Utils/Date';
import { localize }         from 'App/i18n';
import { getTradingEvents } from './helpers';
import Calendar             from '../../Elements/Calendar';

class DatePicker extends React.PureComponent {
    state = {
        display_value        : '',
        holidays             : [],
        is_clear_btn_visible : false,
        is_datepicker_visible: false,
        value                : this.props.value,
        weekends             : [],
    };

    is_mounted = false;

    componentDidMount() {
        this.is_mounted = true;
        document.addEventListener('click', this.onClickOutside);
        if (this.props.disable_trading_events) {
            this.onChangeCalendarMonth(getStartOfMonth(this.state.value));
        }
    }

    componentWillUnmount() {
        this.is_mounted = false;
        document.removeEventListener('click', this.onClickOutside);
    }

    handleVisibility = () => {
        this.setState(state => ({ is_datepicker_visible: !state.is_datepicker_visible }));
    };

    onClickOutside = (e) => {
        if (/purchase_/ig.test(e.target.id)) {
            return;
        }
        if (!this.mainNode.contains(e.target) && this.state.is_datepicker_visible) {
            this.setState({ is_datepicker_visible: false });
        }
    };

    onMouseEnter = () => {
        if (this.state.value && (('is_clearable' in this.props) || this.props.is_clearable)) {
            this.setState({ is_clear_btn_visible: true });
        }
    };

    onMouseLeave = () => {
        this.setState({ is_clear_btn_visible: false });
    };

    onSelectCalendar = (selected_date) => {
        if (!isDateValid(selected_date)) return;
        this.updateDatePickerValue(selected_date);
    };

    onChangeInput = (e) => {
        const value = e.target.value;
        const formatted_value = addDays(toMoment(), value);
        this.updateDatePickerValue(formatted_value);
    };

    clearDatePickerInput = () => {
        this.setState({ value: null }, this.updateStore);
        if (this.calendar) {
            this.calendar.resetCalendar();
        }
    };

    // TODO: handle cases where user inputs date before min_date and date after max_date
    updateDatePickerValue = (selected_date) => {
        this.setState({
            value: this.props.mode === 'duration' ? daysFromTodayTo(selected_date) : selected_date.unix(),
        }, this.updateStore);

        if (this.calendar) {
            this.calendar.setState({
                calendar_date: selected_date,
                selected_date: selected_date.unix(),
            });
        }
    };

    // update MobX store
    updateStore = () => {
        const { name, onChange } = this.props;
        if (onChange) {
            onChange({ target: { name, value: this.state.value } });
        }
    };

    async onChangeCalendarMonth(calendar_date) {
        const trading_events = await getTradingEvents(calendar_date, this.props.underlying);
        const holidays = [];
        let weekends   = [];
        trading_events.forEach(events => {
            const dates = events.dates.split(', '); // convert dates str into array
            const idx = dates.indexOf('Fridays');
            if (idx !== -1) {
                weekends = [6, 0]; // Sat, Sun
            }
            holidays.push({
                dates,
                descrip: events.descrip,
            });
        });

        if (this.is_mounted) {
            this.setState({
                holidays,
                weekends,
            });
        }
    }

    renderInputField = () => {
        const {
            is_clearable,
            is_read_only,
            mode,
            name,
            label,
            error_messages,
        } = this.props;

        let { placeholder } = this.props;
        let display_value, onChange;

        if (mode === 'duration') {
            onChange = this.onChangeInput;
            display_value = this.state.value; // daysFromTodayTo(this.state.value);
        } else {
            placeholder = placeholder || localize('Select a date');
            display_value = formatDate(this.state.value, 'DD MMM YYYY');
        }

        return (
            <React.Fragment>
                <InputField
                    className='datepicker__input-field'
                    classNameInput='datepicker__input trade-container__input'
                    data-tip={false}
                    data-value={display_value}
                    error_messages={error_messages}
                    is_autocomplete_disabled={true}
                    is_hj_whitelisted
                    is_read_only={is_read_only}
                    label={label}
                    name={name}
                    onChange={onChange}
                    onClick={this.handleVisibility}
                    placeholder={placeholder}
                    type='text'
                    value={display_value}
                />
                <Icon
                    icon='IconCalendar'
                    className={classNames('datepicker__icon datepicker__icon--calendar', {
                        'datepicker__icon--is-hidden' : this.state.is_clear_btn_visible,
                        'datepicker__icon--with-label': label,
                    })}
                    onClick={this.handleVisibility}
                />
                { is_clearable &&
                    <Icon
                        icon='IconClear'
                        className={classNames('datepicker__icon datepicker__icon--clear', {
                            'datepicker__icon--is-hidden': !this.state.is_clear_btn_visible,
                        })}
                        onClick={this.state.is_clear_btn_visible ? this.clearDatePickerInput : undefined}
                    />
                }
            </React.Fragment>
        );
    };

    render() {
        const {
            alignment,
            date_format,
            disable_trading_events,
            footer,
            has_range_selection,
            has_today_btn,
            id,
            is_nativepicker,
            max_date,
            min_date,
            mode,
            name,
            placeholder,
            start_date,
        } = this.props;

        const {
            holidays,
            is_datepicker_visible,
            value,
            weekends,
        } = this.state;

        const onChangeCalendarMonth = (
            disable_trading_events ?
                this.onChangeCalendarMonth.bind(this)
                :
                undefined
        );

        if (is_nativepicker) {
            return (
                <div
                    ref={node => { this.mainNode = node; }}
                    className='datepicker'
                >
                    <input
                        className='input trade-container__input datepicker__input'
                        id={name}
                        max={max_date} /** max should be in String */
                        min={min_date} /** min should be in String */
                        name={name}
                        onChange={(e) => {
                            // fix for ios issue: clear button doesn't work
                            // https://github.com/facebook/react/issues/8938
                            const target = e.nativeEvent.target;
                            function iosClearDefault() { target.defaultValue = ''; }
                            window.setTimeout(iosClearDefault, 0);
                            this.onSelectCalendar(e.target.value);
                        }}
                        type='date'
                        value={value} /** value should be in String */
                    />
                    <label
                        className='datepicker__native-overlay'
                        htmlFor={name}
                    >
                        {value || placeholder}
                        <Icon icon='IconArrow' className='datepicker__arrowhead' />
                    </label>
                </div>
            );
        }

        return (
            <div
                ref={node => { this.mainNode = node; }}
                className='datepicker'
                id={id}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                { this.renderInputField() }
                <CSSTransition
                    classNames={{
                        enter    : `datepicker__picker--enter datepicker__picker--${alignment}-enter`,
                        enterDone: `datepicker__picker--enter-done datepicker__picker--${alignment}-enter-done`,
                        exit     : `datepicker__picker--exit datepicker__picker--${alignment}-exit`,
                    }}
                    in={is_datepicker_visible}
                    timeout={100}
                    unmountOnExit
                >
                    <div
                        className={classNames('datepicker__picker', {
                            'datepicker__picker--left': alignment === 'left',
                        })}
                    >
                        <Calendar
                            ref={node => { this.calendar = node; }}
                            date_format={date_format}
                            duration={addDays(toMoment(), value || 1)}
                            footer={footer}
                            has_range_selection={has_range_selection}
                            has_today_btn={has_today_btn}
                            holidays={holidays}
                            max_date={max_date}
                            min_date={min_date}
                            mode={mode}
                            onChangeCalendarMonth={onChangeCalendarMonth}
                            onSelect={this.onSelectCalendar}
                            start_date={start_date}
                            value={value}
                            weekends={weekends}
                        />
                    </div>
                </CSSTransition>
            </div>
        );
    }
}

DatePicker.defaultProps = {
    date_format: Calendar.defaultProps.date_format,
    mode       : 'date',
};

DatePicker.propTypes = {
    ...Calendar.propTypes,
    error_messages: PropTypes.array,
    label         : PropTypes.string,
};

export default DatePicker;
