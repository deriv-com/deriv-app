import classNames                      from 'classnames';
import { Formik, Field, ErrorMessage } from 'formik';
import React, { Component }            from 'react';
import { CSSTransition }               from 'react-transition-group';
import { localize }                    from 'App/i18n';
import Localize                        from 'App/Components/Elements/localize.jsx';
import { toMoment }                    from 'Utils/Date';
import FormSubmitButton                from './form-submit-button.jsx';
import 'Sass/personal-details-form.scss';
import DatePickerCalendar              from './date-picker-calendar.jsx';

class DateOfBirth extends Component {
    state = {
        should_show_calendar: false,
        max_date            : toMoment().subtract(18, 'years'),
        min_date            : toMoment().subtract(100, 'years'),
        date                : toMoment().subtract(18, 'years').unix(),
    };

    constructor(props) {
        super(props);
        this.reference = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, { passive: true });
    }

    handleClick = (e) => {
        if (!this.reference.current) {
            return;
        }
        if (!this.reference.current.contains(e.target)) {
            this.setState({
                should_show_calendar: false,
            });
        }
    }

    closeDatePicker = () => {
        this.setState({
            should_show_calendar: false,
        });
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick);
    }

    handleFocus = () => {
        this.setState({
            should_show_calendar: true,
        });
    };

    render() {
        return (
            <Field
                id={this.props.id}
                name={this.props.name}
                render={({
                    field: { name, value },
                    id,
                    label,
                    className,
                    form : { setFieldValue },
                }) => (
                    <div className='datepicker'>
                        <Input
                            name={name}
                            className={classNames(className, 'dc-input--no-placeholder')}
                            id={id}
                            label={label}
                            placeholder={this.props.label}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            value={value ? toMoment(value).format('YYYY-MM-DD') : ''}
                            readOnly
                        />
                        <CSSTransition
                            in={this.state.should_show_calendar}
                            timeout={100}
                            classNames={{
                                enter    : 'datepicker__picker--enter datepicker__picker--bottom-enter',
                                enterDone: 'datepicker__picker--enter-done datepicker__picker--bottom-enter-done',
                                exit     : 'datepicker__picker--exit datepicker__picker--bottom-exit',
                            }}
                            unmountOnExit
                        >
                            <div
                                className='datepicker__picker'
                                ref={this.reference}
                            >
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

const Input = (props) => {
    const ref = React.createRef();
    return (
        <Field {...props}>
            {
                ({ field }) => (
                    <div className={classNames('dc-input', props.className)}>
                        <input ref={ref} {...field} {...props} className='dc-input__field' />
                        {
                            props.trailing_icon &&
                            React.cloneElement(
                                props.trailing_icon,
                                {
                                    className: classNames(
                                        'dc-input__trailing-icon',
                                        props.trailing_icon.props.className,
                                    ),
                                },
                            )
                        }
                        <label className='dc-input__label' htmlFor={field.id}>
                            {props.label || props.placeholder}
                        </label>
                        <ErrorMessage name={field.name}>
                            {
                                (msg) => (
                                    <p className='dc-input__error'>
                                        {msg}
                                    </p>
                                )
                            }
                        </ErrorMessage>
                    </div>
                )
            }
        </Field>
    );
};

class PersonalDetails extends Component {
    validatePersonalDetails = (values) => {
        const max_date = toMoment().subtract(18, 'days');
        const validations = {
            first_name: [
                v => !!v,
                v => /^[a-zA-Z \-\.\']{2,30}$/.exec(v) !== null,
            ],
            last_name: [
                v => !!v,
                v => /^[a-zA-Z \-\.\']{2,30}$/.exec(v) !== null,
            ],
            date_of_birth: [
                v => !!v,
                v => toMoment(v).isValid() && toMoment(v).isBefore(max_date),
            ],
        };

        const mappedKey = {
            first_name: localize('First name'),
            last_name : localize('Last name'),
        };
        const messages = [
            '%s is required',
            '%s is not in a proper format.',
        ];
        const errors = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => !v(values[key]));
                if (error_index !== -1) {
                    errors[key] = localize(messages[error_index].replace('%s', mappedKey[key]));
                }
            });

        return errors;
    };

    render() {
        return (
            <Formik
                initialValues={{
                    first_name   : this.props.value.first_name,
                    last_name    : this.props.value.last_name,
                    date_of_birth: this.props.value.date_of_birth,
                }}
                validate={this.validatePersonalDetails}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
            >
                {
                    ({
                        handleSubmit,
                        isSubmitting,
                        errors,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className='personal-details-form'>
                                <div className='personal-details-form__elements'>
                                    <Input
                                        name='first_name'
                                        label={localize('First name')}
                                        placeholder={localize('John')}
                                    />
                                    <Input
                                        name='last_name'
                                        label={localize('Last name')}
                                        placeholder={localize('Doe')}
                                    />
                                    <DateOfBirth
                                        name='date_of_birth'
                                        label={localize('Date of birth')}
                                        placeholder={localize('1999-07-01')}
                                    />
                                </div>
                                <p className='personal-details-form__description'>
                                    <Localize
                                        i18n_default_text={'Any information you provide is confidential and will be used for verification purposes only.'}
                                    />
                                </p>
                            </div>
                            <FormSubmitButton
                                is_disabled={
                                    isSubmitting ||
                                    Object.keys(errors).length > 0
                                }
                                label='Next'
                                has_cancel
                                cancel_label='Previous'
                                onCancel={this.props.onCancel}
                            />
                        </form>
                    )
                }
            </Formik>
        );
    }
}

export default PersonalDetails;
