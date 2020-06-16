import {
    Autocomplete,
    AutoHeightWrapper,
    Checkbox,
    DateOfBirthPicker,
    Div100vhContainer,
    FormSubmitButton,
    Input,
    RadioGroup,
    ThemedScrollbars,
} from '@deriv/components';
import React from 'react';
import { Field, Formik } from 'formik';
import { FormSubHeader } from '@deriv/account';
import { toMoment } from '@deriv/shared/utils/date';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
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
                initialValues={{ ...this.props.value }}
                validate={this.props.validate}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
                ref={this.form}
            >
                {({ handleSubmit, isSubmitting, errors, setFieldValue, touched, values }) => (
                    <AutoHeightWrapper default_height={200}>
                        {({ setRef, height }) => (
                            <form ref={setRef} onSubmit={handleSubmit} autoComplete='off'>
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
                                            <FormSubHeader title={localize('Title and name')} />
                                            {/* TODO: [deriv-eu] Remove salutation once api is optional */}

                                            {'salutation' in this.props.value && (
                                                <RadioGroup
                                                    className='dc-radio__input'
                                                    name='salutation'
                                                    items={this.props.salutation_list}
                                                    selected={values.salutation}
                                                    onToggle={e => {
                                                        e.persist();
                                                        setFieldValue('salutation', e.target.value);
                                                    }}
                                                    required
                                                />
                                            )}
                                            {'first_name' in this.props.value && (
                                                <FormInputField
                                                    name='first_name'
                                                    label={localize('First name')}
                                                    disabled={this.props.disabled_items.includes('first_name')}
                                                    placeholder={localize('John')}
                                                />
                                            )}
                                            {'last_name' in this.props.value && (
                                                <FormInputField
                                                    name='last_name'
                                                    label={localize('Last name')}
                                                    disabled={this.props.disabled_items.includes('last_name')}
                                                    placeholder={localize('Doe')}
                                                />
                                            )}
                                            {'phone' in this.props.value && (
                                                <FormInputField
                                                    name='phone'
                                                    label={localize('Phone number')}
                                                    placeholder={localize('Phone number')}
                                                />
                                            )}
                                            <FormSubHeader title={localize('Other details')} />
                                            {'date_of_birth' in this.props.value && (
                                                <DateOfBirthField
                                                    name='date_of_birth'
                                                    label={localize('Date of birth')}
                                                    placeholder={localize('01-07-1999')}
                                                />
                                            )}
                                            {'place_of_birth' in this.props.value && (
                                                <Field name='place_of_birth'>
                                                    {({ field }) => (
                                                        <Autocomplete
                                                            {...field}
                                                            disabled={this.props.disabled_items.includes(
                                                                'place_of_birth'
                                                            )}
                                                            data-lpignore='true'
                                                            autoComplete='off' // prevent chrome autocomplete
                                                            type='text'
                                                            label={localize('Place of birth')}
                                                            error={touched.place_of_birth && errors.place_of_birth}
                                                            list_items={this.props.residence_list}
                                                            onItemSelection={({ value, text }) =>
                                                                setFieldValue('place_of_birth', value ? text : '', true)
                                                            }
                                                            required
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                            {'citizen' in this.props.value && (
                                                <Field name='citizen'>
                                                    {({ field }) => (
                                                        <Autocomplete
                                                            {...field}
                                                            data-lpignore='true'
                                                            autoComplete='off' // prevent chrome autocomplete
                                                            type='text'
                                                            label={localize('Citizenship')}
                                                            error={touched.citizen && errors.citizen}
                                                            disabled={
                                                                this.props.value.citizen &&
                                                                this.props.is_fully_authenticated
                                                            }
                                                            list_items={this.props.residence_list}
                                                            onItemSelection={({ value, text }) =>
                                                                setFieldValue('citizen', value ? text : '', true)
                                                            }
                                                            required
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                            {('tax_residence' in this.props.value ||
                                                'tax_identification_number' in this.props.value) && (
                                                <React.Fragment>
                                                    <FormSubHeader title={localize('Tax information')} />
                                                    {'tax_residence' in this.props.value && (
                                                        <Field name='tax_residence'>
                                                            {({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    data-lpignore='true'
                                                                    autoComplete='off' // prevent chrome autocomplete
                                                                    type='text'
                                                                    label={localize('Tax residence')}
                                                                    error={
                                                                        touched.tax_residence && errors.tax_residence
                                                                    }
                                                                    list_items={this.props.residence_list}
                                                                    onItemSelection={({ value, text }) =>
                                                                        setFieldValue(
                                                                            'tax_residence',
                                                                            value ? text : '',
                                                                            true
                                                                        )
                                                                    }
                                                                    required
                                                                />
                                                            )}
                                                        </Field>
                                                    )}
                                                    {'tax_identification_number' in this.props.value && (
                                                        <FormInputField
                                                            name='tax_identification_number'
                                                            label={localize('Tax identification number')}
                                                            placeholder={localize('Tax identification number')}
                                                        />
                                                    )}
                                                    {'tax_identification_confirm' in this.props.value && (
                                                        <Checkbox
                                                            name='tax_identification_confirm'
                                                            data-lpignore
                                                            onChange={() =>
                                                                setFieldValue(
                                                                    'tax_identification_confirm',
                                                                    !values.tax_identification_confirm,
                                                                    true
                                                                )
                                                            }
                                                            value={values.tax_identification_confirm}
                                                            label={localize(
                                                                'I hereby confirm that the tax information i provided is true and complete. I will also inform Binary Investments (Europe) Ltd. about any changes to this information.'
                                                            )}
                                                        />
                                                    )}
                                                </React.Fragment>
                                            )}
                                            {'account_opening_reason' in this.props.value && ( // TODO: [deriv-eu] Remove account opening reason once api is optional
                                                <React.Fragment>
                                                    <FormSubHeader title={localize('Account opening reason')} />
                                                    <Field name='account_opening_reason'>
                                                        {({ field }) => (
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                type='text'
                                                                label={localize('Account opening reason')}
                                                                error={
                                                                    touched.account_opening_reason &&
                                                                    errors.account_opening_reason
                                                                }
                                                                list_items={this.props.account_opening_reason_list}
                                                                onItemSelection={({ value, text }) =>
                                                                    setFieldValue(
                                                                        'account_opening_reason',
                                                                        value ? text : '',
                                                                        true
                                                                    )
                                                                }
                                                                required
                                                            />
                                                        )}
                                                    </Field>
                                                </React.Fragment>
                                            )}
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
}

export default PersonalDetails;
