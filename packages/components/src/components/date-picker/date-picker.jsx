import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { addDays, daysFromTodayTo, formatDate, toMoment, convertDateFormat } from '@deriv/shared/utils/date';
import Icon from 'Components/icon';
import DesktopWrapper from 'Components/desktop-wrapper';
import MobileWrapper from 'Components/mobile-wrapper';
import Input from './date-picker-input.jsx';
import Calendar from './date-picker-calendar.jsx';

class DatePicker extends React.PureComponent {
    datepicker = React.createRef();
    calendar = React.createRef();

    state = {
        date: this.props.value ? toMoment(this.props.value).format(this.props.display_format) : '',
        duration: 0,
        is_datepicker_visible: false,
        is_placeholder_visible: this.props.placeholder,
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

    onHover = hovered_date => {
        const date = toMoment(hovered_date).format(this.props.display_format);
        const duration = this.props.mode === 'duration' ? daysFromTodayTo(hovered_date) : null;

        if (this.props.onChange) {
            this.props.onChange({
                date,
                duration,
            });
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
                is_placeholder_visible: false,
            },
            () => {
                if (this.props.onChange) {
                    this.props.onChange({
                        date,
                        duration,
                        target: {
                            name: this.props.name,
                            value: new Date(selected_date),
                        },
                    });
                }
            }
        );
    };

    onSelectCalendarNative = selected_date => {
        const date = toMoment(selected_date).format(this.props.display_format);

        this.setState(
            {
                date,
            },
            () => {
                if (this.props.onChange) {
                    this.props.onChange({
                        target: {
                            name: this.props.name,
                            value: date,
                        },
                    });
                }
            }
        );
    };

    /**
     * TODO: handle datepicker input change
     */
    // onChangeInput = e => {};

    /**
     * TODO: handle datepicker input clear
     */
    // onClickClear = () => {};

    get input_value() {
        return this.props.mode === 'duration' ? this.state.duration : this.state.date;
    }

    get calendar_value() {
        if (!this.state.date) return toMoment(this.props.max_date).format(this.props.date_format);
        return convertDateFormat(this.state.date, this.props.display_format, this.props.date_format);
    }

    render() {
        const { id, name, value, onBlur, required, ...props } = this.props;

        return (
            <>
                <MobileWrapper>
                    <div ref={this.datepicker} className={classNames('dc-datepicker-native', this.props.className)}>
                        <input
                            id={name}
                            name={name}
                            className='dc-datepicker-native__input'
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
                            value={this.calendar_value} // native input accepts date format 'YYYY-MM-DD'
                        />
                        <label className='dc-datepicker-native__label' htmlFor={this.props.name}>
                            {this.props.label}
                        </label>
                        <label className='dc-datepicker-native__overlay' htmlFor={this.props.name}>
                            <span className='dc-datepicker-native__overlay-text'>
                                {this.input_value || this.props.placeholder}
                            </span>
                            <Icon icon='IcCalendar' className='dc-datepicker__icon' />
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
                            name={name}
                            onClick={this.handleVisibility}
                            // onChange={this.onChangeInput}
                            // onClickClear={this.onClickClear}
                            is_placeholder_visible={this.state.is_placeholder_visible}
                            value={this.input_value}
                            onBlur={onBlur}
                            required={required}
                            {...props}
                        />
                        <Calendar
                            ref={this.calendar}
                            is_datepicker_visible={this.state.is_datepicker_visible}
                            value={this.calendar_value}
                            onHover={this.props.has_range_selection ? this.onHover : undefined}
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
    keep_open: false,
};

DatePicker.propTypes = {
    error_messages: PropTypes.array,
    label: PropTypes.string,
};

export default DatePicker;
