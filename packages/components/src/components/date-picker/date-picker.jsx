import PropTypes from 'prop-types';
import React from 'react';
import { addDays, daysFromTodayTo, toMoment, convertDateFormat, isMobile } from '@deriv/shared';

import Input from './date-picker-input.jsx';
import Calendar from './date-picker-calendar.jsx';
import Native from './date-picker-native.jsx';
import MobileWrapper from '../mobile-wrapper';
import DesktopWrapper from '../desktop-wrapper';

class DatePicker extends React.PureComponent {
    datepicker = React.createRef();
    calendar_portal = React.createRef();

    state = {
        date: this.props.value ? toMoment(this.props.value).format(this.props.display_format) : '',
        duration: daysFromTodayTo(this.props.value),
        is_datepicker_visible: false,
        is_placeholder_visible: this.props.placeholder && !this.props.value,
    };

    componentDidMount() {
        document.addEventListener('click', this.onClickOutside, true);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value && nextProps.value !== this.props.value) {
            this.setState({
                date: toMoment(nextProps.value).format(this.props.display_format),
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClickOutside, true);
    }

    handleVisibility = () => {
        this.setState(
            state => ({ is_datepicker_visible: !state.is_datepicker_visible }),
            () => {
                if (
                    this.state.is_datepicker_visible &&
                    this.datepicker &&
                    this.datepicker.current &&
                    this.calendar_portal.current &&
                    this.props.portal_id
                ) {
                    const date_picker_rect = this.datepicker.current.getBoundingClientRect();
                    const calendar_rect = this.calendar_portal.current.getBoundingClientRect();
                    const body_rect = document.body.getBoundingClientRect();
                    let calendar_top = date_picker_rect.top;

                    if (date_picker_rect.top + date_picker_rect.height + calendar_rect.height > body_rect.height) {
                        const diff =
                            date_picker_rect.top + date_picker_rect.height + calendar_rect.height - body_rect.height;
                        calendar_top -= diff;
                    }
                    this.setState({
                        top: calendar_top,
                        left: date_picker_rect.left,
                    });
                }
            }
        );
    };

    onClickOutside = e => {
        const is_click_outside =
            !this.datepicker?.current?.contains(e.target) && !this.calendar_portal?.current?.contains(e.target);

        if (this.state.is_datepicker_visible && is_click_outside) {
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

        const date = selected_date ? toMoment(selected_date).format(display_format) : null;

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
     * TODO: currently only works for duration, make it works for date as well
     */
    onChangeInput = e => {
        const { display_format, mode, name, onChange } = this.props;

        const date = addDays(toMoment(), e.target.value).format(display_format);
        const duration = mode === 'duration' ? e.target.value : '';

        this.setState(
            {
                date,
                duration,
                is_datepicker_visible: true,
                is_placeholder_visible: false,
            },
            () => {
                if (this.calendar) {
                    this.calendar.setSelectedDate(date);
                }
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

    /**
     * TODO: handle datepicker input clear
     */
    // onClickClear = () => {};

    get target_value() {
        const calendar_value = this.calendar_value && toMoment(this.calendar_value);
        return this.props.mode === 'duration' ? this.state.duration : calendar_value;
    }

    get input_value() {
        return this.props.mode === 'duration' ? this.state.duration : this.state.date;
    }

    get calendar_value() {
        if (!this.state.date) return isMobile() ? null : toMoment(this.props.max_date).format(this.props.date_format);
        return convertDateFormat(this.state.date, this.props.display_format, this.props.date_format);
    }

    render() {
        const { id, name, value, onBlur, onFocus, required, type, disabled, ...props } = this.props;

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
                        placeholder={this.props.placeholder}
                        value={this.calendar_value} // native picker accepts date format yyyy-mm-dd
                        disabled={disabled}
                    />
                </MobileWrapper>
                <DesktopWrapper>
                    <div id={id} ref={this.datepicker} className='dc-datepicker' data-value={this.input_value}>
                        <Input
                            {...props}
                            disabled={disabled}
                            name={name}
                            onClick={this.handleVisibility}
                            onChangeInput={this.onChangeInput}
                            // onClickClear={this.onClickClear}
                            is_placeholder_visible={this.state.is_placeholder_visible}
                            onBlur={onBlur}
                            required={required}
                            type={type}
                            value={this.input_value}
                        />
                        <Calendar
                            ref={this.calendar_portal}
                            onRef={ref => (this.calendar = ref)}
                            is_datepicker_visible={this.state.is_datepicker_visible}
                            onHover={this.props.has_range_selection ? this.onHover : undefined}
                            onSelect={this.onSelectCalendar}
                            value={this.calendar_value} // Calendar accepts date format yyyy-mm-dd
                            top={this.state.top}
                            left={this.state.left}
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
