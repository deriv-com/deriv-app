import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { addDays, daysFromTodayTo, formatDate, getStartOfMonth, isDateValid, toMoment } from '@deriv/shared/utils/date';
import Icon from 'Components/icon';
import DesktopWrapper from 'Components/desktop-wrapper';
import MobileWrapper from 'Components/mobile-wrapper';
import Input from './date-picker-input.jsx';
import Calendar from './date-picker-calendar.jsx';

class DatePicker extends React.PureComponent {
    datepicker = React.createRef();
    calendar = React.createRef();

    state = {
        date: toMoment(this.props.value).format(this.props.display_format),
        duration: 0,
        is_datepicker_visible: false,
    };

    componentDidMount() {
        document.addEventListener('click', this.onClickOutside, true);
        if (this.props.mode === 'duration') {
            this.setState({
                date: formatDate(addDays(toMoment(), this.props.value || 1), this.props.display_format),
                duration: daysFromTodayTo(this.props.value) || 1,
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClickOutside, true);
    }

    handleVisibility = () => {
        this.setState(state => ({ is_datepicker_visible: !state.is_datepicker_visible }));
    };

    onClickOutside = e => {
        if (/purchase_/gi.test(e.target.id)) {
            return;
        }
        if (!this.datepicker.current.contains(e.target) && this.state.is_datepicker_visible) {
            this.setState({ is_datepicker_visible: false });
        }
    };

    onSelectCalendar = (selected_date, is_datepicker_visible = true) => {
        const date = toMoment(selected_date).format(this.props.display_format);
        const duration = this.props.mode === 'duration' ? daysFromTodayTo(selected_date) : null;

        this.setState(
            {
                date,
                duration,
                is_datepicker_visible,
            },
            () => {
                if (this.props.onChange) {
                    this.props.onChange({
                        date,
                        duration,
                        target: {
                            name: this.props.name,
                            value: this.input_value,
                        },
                    });
                }
            }
        );
    };

    onSelectCalendarNative = selected_date => {
        let value = selected_date;
        if (!isDateValid(value)) {
            value = '';
        }
        this.setState(
            {
                value: value ? formatDate(value, this.props.display_format) : value,
            },
            this.updateStore
        );
    };

    /**
     * TODO: handle input change
     */
    // onChangeInput = e => {
    //     const value = e.target.value;
    //     const formatted_value = formatDate(addDays(toMoment(), value), this.props.display_format);
    //     this.updateDatePickerValue(formatted_value);
    //     this.props.onChange(e);
    // };

    // clearDatePickerInput = () => {
    //     this.setState({ date: null, duration: null });
    //     if (this.calendar.current) {
    //         this.calendar.current.resetCalendar();
    //     }
    // };

    get input_value() {
        return this.props.mode === 'duration' ? this.state.duration : this.state.date;
    }

    render() {
        const { id, value, ...props } = this.props;

        return (
            <>
                <MobileWrapper>
                    <div ref={this.datepicker} className={classNames('dc-datepicker-native', this.props.className)}>
                        <input
                            id={this.props.name}
                            name={this.props.name}
                            className='input dc-datepicker-native__input'
                            type='date'
                            min={this.props.min_date}
                            max={this.props.max_date}
                            onChange={e => {
                                // fix for ios issue: clear button doesn't work
                                // https://github.com/facebook/react/issues/8938
                                const target = e.nativeEvent.target;
                                function iosClearDefault() {
                                    target.defaultValue = '';
                                }
                                window.setTimeout(iosClearDefault, 0);

                                this.onSelectCalendarNative(e.target.value);
                            }}
                        />
                        <label className='dc-natepicker-native__overlay' htmlFor={this.props.name}>
                            <Icon icon='IcCalendarDatefrom' className='dc-datepicker__arrowhead' />
                            <span className='dc-datepicker-native__overlay-text'>
                                {this.state.value || this.props.placeholder}
                            </span>
                        </label>
                    </div>
                </MobileWrapper>
                <DesktopWrapper>
                    <div
                        id={this.props.id}
                        ref={this.datepicker}
                        className='dc-datepicker'
                        data-value={this.input_value}
                    >
                        <Input
                            onClick={this.handleVisibility}
                            onClickClear={this.clearDatePickerInput}
                            value={this.input_value}
                            {...props}
                        />
                        <Calendar
                            ref={this.calendar}
                            is_datepicker_visible={this.state.is_datepicker_visible}
                            value={value}
                            onSelect={this.onSelectCalendar}
                            {...props}
                        />
                    </div>
                </DesktopWrapper>
            </>
        );
    }
}

DatePicker.defaultProps = {
    alignment: 'bottom',
    date_format: 'YYYY-MM-DD',
    mode: 'date',
    display_format: 'DD MMM YYYY',
};

DatePicker.propTypes = {
    error_messages: PropTypes.array,
    label: PropTypes.string,
};

export default DatePicker;
