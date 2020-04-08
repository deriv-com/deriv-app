import PropTypes from 'prop-types';
import React from 'react';
import { addDays, daysFromTodayTo, formatDate, toMoment, convertDateFormat } from '@deriv/shared/utils/date';
import DesktopWrapper from 'Components/desktop-wrapper';
import MobileWrapper from 'Components/mobile-wrapper';
import Input from './date-picker-input.jsx';
import Calendar from './date-picker-calendar.jsx';
import Native from './date-picker-native.jsx';

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
        if (this.datepicker && !this.datepicker.current?.contains(e.target) && this.state.is_datepicker_visible) {
            this.setState({ is_datepicker_visible: false });
        }
    };

    onHover = hovered_date => {
        const { display_format, mode, onChange } = this.props;

        const date = toMoment(hovered_date).format(display_format);
        const duration = mode === 'duration' ? daysFromTodayTo(hovered_date) : null;

        if (typeof onChange === 'function') {
            onChange({
                date,
                duration,
            });
        }
    };

    onSelectCalendar = (selected_date, is_datepicker_visible = true) => {
        const { display_format, mode, name, onChange } = this.props;

        const date = toMoment(selected_date).format(display_format);
        const duration = mode === 'duration' ? daysFromTodayTo(selected_date) : null;

        this.setState(
            {
                date,
                duration,
                is_datepicker_visible,
                is_placeholder_visible: false,
            },
            () => {
                if (typeof onChange === 'function') {
                    onChange({
                        date,
                        duration,
                        target: {
                            name,
                            value: this.target_value,
                        },
                    });
                }
            }
        );
    };

    onSelectCalendarNative = selected_date => {
        const { display_format, name, onChange } = this.props;

        const date = toMoment(selected_date).format(display_format);

        this.setState(
            {
                date,
            },
            () => {
                if (typeof onChange === 'function') {
                    onChange({
                        target: {
                            name,
                            value: this.target_value,
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

    get target_value() {
        return this.props.mode === 'duration' ? this.state.duration : new Date(this.calendar_value);
    }

    get input_value() {
        return this.props.mode === 'duration' ? this.state.duration : this.state.date;
    }

    get calendar_value() {
        if (!this.state.date) return toMoment(this.props.max_date).format(this.props.date_format);
        return convertDateFormat(this.state.date, this.props.display_format, this.props.date_format);
    }

    render() {
        const { id, name, value, onBlur, onFocus, required, ...props } = this.props;

        return (
            <>
                <MobileWrapper>
                    <Native
                        id={id}
                        name={name}
                        display_format={this.props.display_format}
                        error={this.props.error}
                        label={this.props.label}
                        max_date={this.props.max_date}
                        min_date={this.props.min_date}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onSelect={this.onSelectCalendarNative}
                        value={this.calendar_value} // native picker accepts date format yyyy-mm-dd
                    />
                </MobileWrapper>
                <DesktopWrapper>
                    <div id={id} ref={this.datepicker} className='dc-datepicker' data-value={this.input_value}>
                        <Input
                            name={name}
                            onClick={this.handleVisibility}
                            // onChange={this.onChangeInput}
                            // onClickClear={this.onClickClear}
                            is_placeholder_visible={this.state.is_placeholder_visible}
                            onBlur={onBlur}
                            required={required}
                            value={this.input_value}
                            {...props}
                        />
                        <Calendar
                            ref={this.calendar}
                            is_datepicker_visible={this.state.is_datepicker_visible}
                            onHover={this.props.has_range_selection ? this.onHover : undefined}
                            onSelect={this.onSelectCalendar}
                            value={this.calendar_value} // Calendar accepts date format yyyy-mm-dd
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
