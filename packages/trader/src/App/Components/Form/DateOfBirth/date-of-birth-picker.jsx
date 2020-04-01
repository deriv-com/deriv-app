import classNames from 'classnames';
import React from 'react';
import { Icon, Input } from '@deriv/components';
import { Field } from 'formik';
import { CSSTransition } from 'react-transition-group';
import { toMoment } from '@deriv/shared/utils/date';
import DatePickerCalendar from './date-of-birth-calendar.jsx';

const InputField = props => {
    return (
        <Field name={props.name}>
            {({ field, form: { errors, touched } }) => (
                <React.Fragment>
                    <Input
                        type='text'
                        required
                        autoComplete='off'
                        maxLength='30'
                        error={touched[field.name] && errors[field.name]}
                        trailing_icon={<Icon icon='IcCalendar' className='icon-datepicker' />}
                        {...field}
                        {...props}
                    />
                </React.Fragment>
            )}
        </Field>
    );
};

// TODO: Move DateOfBirth and Calendar to components
class DateOfBirth extends React.Component {
    state = {
        should_show_calendar: false,
        max_date: toMoment().subtract(18, 'years'),
        min_date: toMoment().subtract(100, 'years'),
        date: toMoment()
            .subtract(18, 'years')
            .unix(),
    };

    constructor(props) {
        super(props);
        this.reference = React.createRef();
    }

    closeDatePicker = () => {
        this.setState(
            {
                should_show_calendar: false,
            },
            () => {
                if (this.props.onFocus) {
                    this.props.onFocus(false);
                }
            }
        );
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, { passive: true });
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick);
    }

    handleClick = e => {
        if (!this.reference.current) {
            return;
        }
        if (!this.reference.current.contains(e.target)) {
            this.setState(
                {
                    should_show_calendar: false,
                },
                () => {
                    if (this.props.onFocus) {
                        this.props.onFocus(false);
                    }
                }
            );
        }
    };

    handleFocus = () => {
        this.setState(
            {
                should_show_calendar: true,
            },
            () => {
                if (this.props.onFocus) {
                    this.props.onFocus(true);
                }
            }
        );
    };

    render() {
        return (
            <Field
                id={this.props.id}
                name={this.props.name}
                render={({ field: { name, value }, form: { setFieldValue, handleBlur } }) => (
                    <div className='dc-datepicker'>
                        <InputField
                            {...this.props}
                            onFocus={this.handleFocus}
                            className={classNames(this.props.className, {
                                'dc-datepicker--active-label': !!value,
                            })}
                            onBlur={handleBlur}
                            value={value ? toMoment(value).format('DD-MM-YYYY') : ''}
                            readOnly
                        />
                        <CSSTransition
                            in={this.state.should_show_calendar}
                            timeout={100}
                            classNames={{
                                enter: 'dc-datepicker__picker--enter dc-datepicker__picker--bottom-enter',
                                enterDone: 'dc-datepicker__picker--enter-done dc-datepicker__picker--bottom-enter-done',
                                exit: 'dc-datepicker__picker--exit dc-datepicker__picker--bottom-exit',
                            }}
                            unmountOnExit
                        >
                            <div className='dc-datepicker__picker' ref={this.reference}>
                                <DatePickerCalendar
                                    max_date={this.state.max_date}
                                    min_date={this.state.min_date}
                                    date={this.state.date}
                                    onChange={(val, type) => {
                                        setFieldValue(name, val, true);
                                        if (type === 'day') {
                                            this.closeDatePicker();
                                        }
                                    }}
                                    value={value}
                                />
                            </div>
                        </CSSTransition>
                    </div>
                )}
            />
        );
    }
}

export default DateOfBirth;
