import {
    Div100vhContainer,
    AutoHeightWrapper,
    Input,
    ThemedScrollbars,
    DateOfBirthPicker,
    FormSubmitButton,
} from '@deriv/components';
import { Formik, Field } from 'formik';
import React from 'react';
import { isDesktop, isMobile, toMoment } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

import 'Sass/details-form.scss';

const DateOfBirthField = props => (
    <Field name={props.name}>
        {({ field: { value }, form: { setFieldValue, errors, touched, setTouched } }) => (
            <DateOfBirthPicker
                error={touched.date_of_birth && errors.date_of_birth}
                onBlur={() => setTouched({ date_of_birth: true })}
                onChange={({ target }) =>
                    setFieldValue(
                        'date_of_birth',
                        target?.value ? toMoment(target.value).format('YYYY-MM-DD') : '',
                        true
                    )
                }
                value={value}
                portal_id='modal_root'
                {...props}
            />
        )}
    </Field>
);

const FormInputField = ({ name, optional = false, ...props }) => (
    <Field name={name}>
        {({ field, form: { errors, touched } }) => (
            <Input
                type='text'
                required={!optional}
                name={name}
                autoComplete='off'
                maxLength='30'
                error={touched[field.name] && errors[field.name]}
                {...field}
                {...props}
            />
        )}
    </Field>
);

class PersonalDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // add padding-bottom to the form when datepicker is active
            // to add empty spaces at the bottom when scrolling
            paddingBottom: 'unset',
        };
    }

    handleCancel = values => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    onFocus = is_active => {
        this.setState({ paddingBottom: is_active ? '18rem' : 'unset' });
    };

    render() {
        return (
            <Formik
                initialValues={{
                    first_name: this.props.value.first_name,
                    last_name: this.props.value.last_name,
                    date_of_birth: this.props.value.date_of_birth,
                    phone: this.props.value.phone,
                }}
                validate={this.validatePersonalDetails}
                validateOnMount
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
            >
                {({ handleSubmit, isSubmitting, errors, values }) => (
                    <AutoHeightWrapper default_height={200}>
                        {({ setRef, height }) => (
                            <form ref={setRef} onSubmit={handleSubmit}>
                                <Div100vhContainer
                                    className='details-form'
                                    height_offset='199px'
                                    is_disabled={isDesktop()}
                                >
                                    <p className='details-form__description'>
                                        <Localize
                                            i18n_default_text={
                                                'Any information you provide is confidential and will be used for verification purposes only.'
                                            }
                                        />
                                    </p>
                                    <ThemedScrollbars is_bypassed={isMobile()} height={height}>
                                        <div
                                            className='details-form__elements'
                                            style={{ paddingBottom: this.state.paddingBottom }}
                                        >
                                            <FormInputField
                                                name='first_name'
                                                label={localize('First name*')}
                                                placeholder={localize('John')}
                                            />
                                            <FormInputField
                                                name='last_name'
                                                label={localize('Last name*')}
                                                placeholder={localize('Doe')}
                                            />
                                            <DateOfBirthField
                                                name='date_of_birth'
                                                label={localize('Date of birth*')}
                                                placeholder={localize('01-07-1999')}
                                            />
                                            <FormInputField
                                                name='phone'
                                                label={localize('Phone number*')}
                                                placeholder={localize('Phone number')}
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <FormSubmitButton
                                    cancel_label={localize('Previous')}
                                    has_cancel
                                    is_disabled={
                                        // eslint-disable-next-line no-unused-vars
                                        isSubmitting || Object.keys(errors).length > 0
                                    }
                                    label={localize('Next')}
                                    onCancel={this.handleCancel.bind(this, values)}
                                />
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        );
    }

    validatePersonalDetails = values => {
        const max_date = toMoment().subtract(18, 'years');
        const validations = {
            first_name: [
                v => !!v,
                v => v.length > 2,
                v => v.length < 30,
                v => /^[a-zA-Z\s\W'.-]{2,50}$/gu.exec(v) !== null,
            ],
            last_name: [
                v => !!v,
                v => v.length >= 2,
                v => v.length <= 50,
                v => /^[a-zA-Z\s\W'.-]{2,50}$/gu.exec(v) !== null,
            ],
            date_of_birth: [
                v => !!v,
                v =>
                    toMoment(v)
                        .clone()
                        .isValid() && toMoment(v).isBefore(max_date),
            ],
            phone: [v => !!v, v => /^\+?((-|\s)*[0-9]){8,35}$/.exec(v) !== null],
        };

        const mappedKey = {
            first_name: localize('First name'),
            last_name: localize('Last name'),
            date_of_birth: localize('Date of birth'),
            phone: localize('Phone'),
        };

        const common_messages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('{{field_name}} is too short', { field_name }),
            localize('{{field_name}} is too long', { field_name }),
            localize('{{field_name}} is not in a proper format.', { field_name }),
        ];

        const alt_messages = field_name => ({
            phone: [
                localize('{{field_name}} is required', { field_name }),
                localize('{{field_name}} is not in a proper format.', { field_name }),
            ],
            date_of_birth: [
                localize('{{field_name}} is required', { field_name }),
                localize('You must be 18 years old and above.', { field_name }),
            ],
        });

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                switch (key) {
                    case 'date_of_birth':
                    case 'phone':
                        errors[key] = errors[key] = alt_messages(mappedKey[key])[key][error_index];
                        break;
                    default:
                        errors[key] = errors[key] = common_messages(mappedKey[key])[error_index];
                }
            }
        });

        return errors;
    };
}

export default PersonalDetails;
