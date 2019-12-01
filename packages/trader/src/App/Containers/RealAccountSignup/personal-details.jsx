import classNames             from 'classnames';
import {
    Input,
    ThemedScrollbars }        from 'deriv-components';
import { Formik, Field }      from 'formik';
import React                  from 'react';
import { CSSTransition }      from 'react-transition-group';
import { localize, Localize } from 'deriv-translations';
import IconDatepicker         from 'Assets/Signup/icon-datepicker.jsx';
import { toMoment }           from 'Utils/Date';
import FormSubmitButton       from './form-submit-button.jsx';
import DatePickerCalendar     from './date-picker-calendar.jsx';
import 'Sass/details-form.scss';

export class DateOfBirth extends React.Component {
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

    closeDatePicker = () => {
        this.setState({
            should_show_calendar: false,
        }, () => {
            if (this.props.onFocus) {
                this.props.onFocus(false);
            }
        });
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, { passive: true });
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick);
    }

    handleClick = (e) => {
        if (!this.reference.current) {
            return;
        }
        if (!this.reference.current.contains(e.target)) {
            this.setState({
                should_show_calendar: false,
            }, () => {
                if (this.props.onFocus) {
                    this.props.onFocus(false);
                }
            });
        }
    };

    handleFocus = () => {
        this.setState({
            should_show_calendar: true,
        }, () => {
            if (this.props.onFocus) {
                this.props.onFocus(true);
            }
        });
    };

    render() {
        return (
            <Field
                id={this.props.id}
                name={this.props.name}
                render={({
                    field: { name, value },
                    form : { setFieldValue, handleBlur },
                }) => (
                    <div className='datepicker'>
                        <InputField
                            {...this.props}
                            onFocus={this.handleFocus}
                            className={classNames(this.props.className, {
                                'datepicker--active-label': !!value,
                            })}
                            onBlur={handleBlur}
                            value={value ? toMoment(value).format('DD-MM-YYYY') : ''}
                            readOnly
                        />
                        <IconDatepicker className='icon-datepicker' />
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

const InputField = (props) => {
    return (
        <Field name={props.name}>
            {
                ({
                    field,
                    form: { errors, touched },
                }) => (
                    <React.Fragment>
                        <Input
                            type='text'
                            required
                            autoComplete='off'
                            maxLength='30'
                            error={touched[field.name] && errors[field.name]}
                            {...field}
                            {...props}
                        />
                    </React.Fragment>
                )
            }
        </Field>
    );
};

class PersonalDetails extends React.Component {
    constructor(props) {
        super(props);
        this.form = React.createRef();
        this.state = {
            // add padding-bottom to the form when datepicker is active
            // to add empty spaces at the bottom when scrolling
            paddingBottom: 'unset',
        };
    }

    componentDidMount() {
        this.form.current.getFormikActions().validateForm();
    }

    handleCancel = (values) => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    onFocus = (is_active) => {
        this.setState({ paddingBottom: is_active ? '18rem' : 'unset' });
    };

    render() {
        return (
            <Formik
                initialValues={{
                    first_name   : this.props.value.first_name,
                    last_name    : this.props.value.last_name,
                    date_of_birth: this.props.value.date_of_birth,
                    phone        : this.props.value.phone,
                }}
                validate={this.validatePersonalDetails}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
                ref={this.form}
            >
                {
                    ({
                        handleSubmit,
                        isSubmitting,
                        errors,
                        values,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className='details-form'>
                                <p className='details-form__description'>
                                    <Localize
                                        i18n_default_text={'Any information you provide is confidential and will be used for verification purposes only.'}
                                    />
                                </p>
                                <div className='details-form__elements-container'>
                                    <ThemedScrollbars
                                        autoHide
                                        style={{
                                            height: 'calc(100% - 16px)',
                                        }}
                                    >
                                        <div className='details-form__elements' style={{ paddingBottom: this.state.paddingBottom }}>
                                            <InputField
                                                name='first_name'
                                                label={localize('First name*')}
                                                placeholder={localize('John')}
                                            />
                                            <InputField
                                                name='last_name'
                                                label={localize('Last name*')}
                                                placeholder={localize('Doe')}
                                            />
                                            <DateOfBirth
                                                name='date_of_birth'
                                                label={localize('Date of birth*')}
                                                placeholder={localize('01-07-1999')}
                                                onFocus={this.onFocus}
                                            />
                                            <InputField
                                                name='phone'
                                                label={localize('Phone number*')}
                                                placeholder={localize('Phone number')}
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </div>
                            </div>
                            <FormSubmitButton
                                is_absolute
                                cancel_label={localize('Previous')}
                                has_cancel
                                is_disabled={
                                    // eslint-disable-next-line no-unused-vars
                                    isSubmitting ||
                                    Object.keys(errors).length > 0
                                }
                                label={localize('Next')}
                                onCancel={this.handleCancel.bind(this, values)}
                            />
                        </form>
                    )
                }
            </Formik>
        );
    }

    validatePersonalDetails = (values) => {
        const max_date    = toMoment().subtract(18, 'days');
        const validations = {
            first_name: [
                v => !!v,
                v => v.length > 2,
                v => v.length < 30,
                v => /^[\p{L}\s'.-]{2,50}$/gu.exec(v) !== null,
            ],
            last_name: [
                v => !!v,
                v => v.length >= 2,
                v => v.length <= 50,
                v =>  /^[\p{L}\s'.-]{2,50}$/gu.exec(v) !== null,
            ],
            date_of_birth: [
                v => !!v,
                v => toMoment(v).isValid() && toMoment(v).isBefore(max_date),
            ],
            phone: [
                v => !!v,
                v => /^\+?((-|\s)*[0-9]){8,35}$/.exec(v) !== null,
            ],
        };

        const mappedKey = {
            first_name   : localize('First name'),
            last_name    : localize('Last name'),
            date_of_birth: localize('Date of birth'),
            phone        : localize('Phone'),
        };

        const common_messages  = [
            '{{field_name}} is required',
            '{{field_name}} is too short',
            '{{field_name}} is too long',
            '{{field_name}} is not in a proper format.',
        ];

        const alt_messages = [
            '{{field_name}} is required',
            '{{field_name}} is not in a proper format.',
        ];

        const errors    = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => !v(values[key]));
                if (error_index !== -1) {
                    switch (key) {
                        case 'date_of_birth':
                        case 'phone':
                            errors[key] = errors[key] = <Localize
                                i18n_default_text={alt_messages[error_index]}
                                values={{
                                    field_name: mappedKey[key],
                                }}
                            />;
                            break;
                        default:
                            errors[key] = errors[key] = <Localize
                                i18n_default_text={common_messages[error_index]}
                                values={{
                                    field_name: mappedKey[key],
                                }}
                            />;
                    }
                }
            });

        return errors;
    };
}

export default PersonalDetails;
