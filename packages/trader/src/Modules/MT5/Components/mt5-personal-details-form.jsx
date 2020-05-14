import classNames from 'classnames';
import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Autocomplete,
    AutoHeightWrapper,
    Div100vhContainer,
    ThemedScrollbars,
    Input,
    Loading,
    FormSubmitButton,
    DesktopWrapper,
    MobileWrapper,
    SelectNative,
} from '@deriv/components';
import { FormSubHeader } from '@deriv/account';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
import { Localize, localize } from '@deriv/translations';
import { isDeepEqual } from '@deriv/shared/utils/object';

export const InputField = ({ name, optional = false, ...props }) => (
    <Field name={name}>
        {({ field, form: { errors, touched } }) => (
            <Input
                type='text'
                required={!optional}
                name={name}
                autoComplete='new-password'
                maxLength='30'
                error={touched[field.name] && errors[field.name]}
                {...field}
                {...props}
            />
        )}
    </Field>
);

class MT5PersonalDetailsForm extends React.Component {
    is_initial_valid = false;

    handleCancel = values => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    validatePersonalDetails = values => {
        const validations = {
            citizen: [v => !!v, v => this.props.residence_list.map(i => i.text).includes(v)],
            tax_residence: [v => !!v, v => this.props.residence_list.map(i => i.text).includes(v)],
            tax_identification_number: [v => !!v, v => /^[\w-]{0,20}$/.test(v)],
        };

        const mappedKey = {
            citizen: localize('Citizenship'),
            tax_residence: localize('Tax residence'),
            tax_identification_number: localize('Tax identification number'),
        };

        const common_messages = ['{{field_name}} is required', '{{field_name}} is not properly formatted.'];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                switch (key) {
                    default:
                        errors[key] = errors[key] = (
                            <Localize
                                i18n_default_text={common_messages[error_index]}
                                values={{
                                    field_name: mappedKey[key],
                                }}
                            />
                        );
                }
            }
        });

        return errors;
    };

    submitForm = (values, actions, index, onSubmit, is_dirty) => {
        const { citizen: citizen_text, tax_residence: tax_residence_text, ...restOfValues } = values;
        const { citizen, tax_residence } = this.findDefaultValuesInResidenceList(citizen_text, tax_residence_text);

        const payload = {
            citizen: typeof citizen !== 'undefined' ? citizen.value : '',
            tax_residence: typeof tax_residence !== 'undefined' ? tax_residence.value : '',
            ...restOfValues,
        };
        onSubmit(index, payload, actions.setSubmitting, is_dirty);
    };

    findDefaultValuesInResidenceList = (citizen_text, tax_residence_text) => {
        let citizen, tax_residence;
        this.props.residence_list.forEach(item => {
            if (item.text === citizen_text) {
                citizen = item;
            }
            if (item.text === tax_residence_text) {
                tax_residence = item;
            }
        });
        return { citizen, tax_residence };
    };

    render() {
        const { index, is_fully_authenticated, onSubmit, residence_list, value } = this.props;

        const onSubmitForm = (values, actions) =>
            this.submitForm(values, actions, index, onSubmit, !isDeepEqual(value, values));

        if (residence_list.length === 0) return <Loading is_fullscreen={false} />;
        return (
            <Formik
                initialValues={{
                    citizen: value.citizen,
                    tax_residence: value.tax_residence,
                    tax_identification_number: value.tax_identification_number,
                }}
                enableReinitialize={true}
                isInitialValid={({ initialValues }) => {
                    const initial_errors = this.validatePersonalDetails(initialValues);
                    this.is_initial_valid =
                        Object.entries(initial_errors).length === 0 && initial_errors.constructor === Object;
                    return initial_errors;
                }}
                validate={this.validatePersonalDetails}
                onSubmit={onSubmitForm}
            >
                {({ handleSubmit, isSubmitting, errors, touched, values, setFieldValue }) => (
                    <AutoHeightWrapper default_height={200}>
                        {({ height, setRef }) => (
                            <form
                                className='mt5-financial-stp-modal__form'
                                ref={setRef}
                                onSubmit={handleSubmit}
                                autoComplete='off'
                            >
                                <Div100vhContainer
                                    className={classNames('details-form', 'mt5-details-form')}
                                    is_disabled={isDesktop()}
                                    height_offset='199px'
                                >
                                    <p className='details-form__description'>
                                        <Localize
                                            i18n_default_text={
                                                'Any information you provide is confidential and will be used for verification purposes only.'
                                            }
                                        />
                                    </p>
                                    <ThemedScrollbars autoHide height={height} is_native={isMobile()}>
                                        <div className='details-form__elements'>
                                            <FormSubHeader title={localize('Details')} />
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Field name='citizen'>
                                                        {({ field }) => (
                                                            <Autocomplete
                                                                {...field}
                                                                id='real_mt5_citizenship'
                                                                data-lpignore='true'
                                                                autoComplete='new-password'
                                                                type='text'
                                                                label={localize('Citizenship')}
                                                                error={touched.citizen && errors.citizen}
                                                                disabled={value.citizen && is_fully_authenticated}
                                                                list_items={residence_list}
                                                                onItemSelection={item =>
                                                                    setFieldValue(
                                                                        'citizen',
                                                                        item.value ? item.text : '',
                                                                        true
                                                                    )
                                                                }
                                                                required
                                                            />
                                                        )}
                                                    </Field>
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        label={localize('Citizenship')}
                                                        value={values.citizen}
                                                        list_items={residence_list}
                                                        error={touched.citizen && errors.citizen}
                                                        disabled={value.citizen && is_fully_authenticated}
                                                        use_text={true}
                                                        onChange={e => setFieldValue('citizen', e.target.value, true)}
                                                        required
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <FormSubHeader title={localize('Tax information')} />
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Field name='tax_residence'>
                                                        {({ field }) => (
                                                            <Autocomplete
                                                                id='real_mt5_tax_residence'
                                                                data-lpignore='true'
                                                                type='text'
                                                                autoComplete='new-password'
                                                                label={localize('Tax residence')}
                                                                error={touched.tax_residence && errors.tax_residence}
                                                                disabled={value.tax_residence && is_fully_authenticated}
                                                                list_items={residence_list}
                                                                onItemSelection={({ value: v, text }) =>
                                                                    setFieldValue('tax_residence', v ? text : '', true)
                                                                }
                                                                {...field}
                                                            />
                                                        )}
                                                    </Field>
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        label={localize('Tax residence')}
                                                        value={values.tax_residence}
                                                        error={touched.tax_residence && errors.tax_residence}
                                                        disabled={value.tax_residence && is_fully_authenticated}
                                                        list_items={residence_list}
                                                        use_text={true}
                                                        onChange={e =>
                                                            setFieldValue('tax_residence', e.target.value, true)
                                                        }
                                                        required
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <InputField
                                                id='real_mt5_tax_identification_number'
                                                name='tax_identification_number'
                                                placeholder={localize('Tax identification number')}
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <FormSubmitButton
                                    cancel_label={localize('Previous')}
                                    is_disabled={
                                        isSubmitting ||
                                        (Object.keys(touched).length === 0 && !this.is_initial_valid) ||
                                        (Object.keys(touched).length > 0 && Object.keys(errors).length > 0)
                                    }
                                    label={localize('Next')}
                                    onCancel={() => this.handleCancel(values)}
                                />
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        );
    }
}

MT5PersonalDetailsForm.propTypes = {
    is_fully_authenticated: PropTypes.bool,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onSubmit: PropTypes.func,
    residence_list: PropTypes.array,
    value: PropTypes.object,
};

export default MT5PersonalDetailsForm;
