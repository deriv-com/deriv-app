import { Field, Formik }    from 'formik';
import PropTypes            from 'prop-types';
import React, { Component } from 'react';
import {
    ThemedScrollbars,
    Autocomplete,
    Input,
    Loading,
    FormSubmitButton }      from '@deriv/components';
import {
    Localize,
    localize }              from '@deriv/translations';
import { FormSubHeader }    from 'Modules/Account/Components/layout-components.jsx';

const form = React.createRef();

export const InputField = ({ name, optional = false, ...props }) => (
    <Field name={name}>
        {
            ({
                field,
                form: { errors, touched },
            }) => (
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
            )
        }
    </Field>
);

class MT5PersonalDetailsForm extends Component {
    handleCancel = (values) => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    validatePersonalDetails = (values) => {
        const validations = {
            citizen: [
                v => !!v,
                v => this.props.residence_list.map(i => i.text).includes(v),
            ],
            tax_residence: [
                v => !!v,
                v => this.props.residence_list.map(i => i.text).includes(v),
            ],
            tax_identification_number: [
                v => !!v,
                v => /^[\w-]{0,20}$/.test(v),
            ],
        };

        const mappedKey = {
            citizen                  : localize('Citizenship'),
            tax_residence            : localize('Tax residence'),
            tax_identification_number: localize('Tax identification number'),
        };

        const common_messages = [
            '{{field_name}} is required',
            '{{field_name}} is not properly formatted.',
        ];

        const errors = {};

        Object.entries(validations)
            .forEach(([key, rules]) => {
                const error_index = rules.findIndex(v => !v(values[key]));
                if (error_index !== -1) {
                    switch (key) {
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

    submitForm = (values, actions, index, onSubmit) => {
        const { citizen: citizen_text, tax_residence: tax_residence_text, ...restOfValues } = values;
        const { citizen, tax_residence } = this.findDefaultValuesInResidenceList(
            citizen_text,
            tax_residence_text,
        );

        const payload = {
            citizen      : typeof citizen !== 'undefined' ? citizen.value : '',
            tax_residence: typeof tax_residence !== 'undefined' ? tax_residence.value : '',
            ...restOfValues,
        };
        onSubmit(index, payload, actions.setSubmitting);
    }

    findDefaultValuesInResidenceList = (citizen_text, tax_residence_text) => {
        let citizen,
            tax_residence;
        this.props.residence_list.forEach(item => {
            if (item.text === citizen_text) {
                citizen = item;
            }
            if (item.text === tax_residence_text) {
                tax_residence = item;
            }
        });
        return { citizen, tax_residence };
    }

    render() {
        const {
            index,
            is_fully_authenticated,
            onSubmit,
            residence_list,
            value,
        } = this.props;

        const onSubmitForm = (values, actions) => this.submitForm(values, actions, index, onSubmit);
        if (residence_list.length === 0) return <Loading is_fullscreen={false} />;
        return (
            <div id='real_mt5_personal_details' className='details-form mt5-details-form'>
                <Formik
                    initialValues={{
                        citizen                  : value.citizen,
                        tax_residence            : value.tax_residence,
                        tax_identification_number: value.tax_identification_number,
                    }}
                    enableReinitialize={true}
                    isInitialValid={({ initialValues }) => this.validatePersonalDetails(initialValues)}
                    validate={this.validatePersonalDetails}
                    onSubmit={onSubmitForm}
                    ref={form}
                >
                    {
                        ({
                            handleSubmit,
                            isSubmitting,
                            errors,
                            touched,
                            values,
                            setFieldValue,
                        }) => (
                            <form onSubmit={handleSubmit} autoComplete='off'>
                                <div className='details-form'>
                                    <div className='details-form__elements-container'>
                                        <ThemedScrollbars
                                            autoHide
                                            style={{ height: 432 }}
                                        >
                                            <div className='details-form__elements' style={{ paddingBottom: '18rem' }}>
                                                <FormSubHeader title={localize('Details')} />
                                                <fieldset className='details-form__fieldset'>
                                                    <Field name='citizen'>
                                                        {({ field }) => (
                                                            <Autocomplete
                                                                {...field}
                                                                id='real_mt5_citizenship'
                                                                data-lpignore='true'
                                                                autoComplete='off'
                                                                type='search'
                                                                label={localize('Citizenship')}
                                                                error={touched.citizen && errors.citizen}
                                                                disabled={values.citizen && is_fully_authenticated}
                                                                list_items={residence_list}
                                                                onItemSelection={(item) => setFieldValue(
                                                                    'citizen',
                                                                    item.text,
                                                                    false,
                                                                )}
                                                                required
                                                            />
                                                        )}
                                                    </Field>
                                                </fieldset>
                                                <FormSubHeader title={localize('Tax information')} />
                                                <fieldset className='account-form__fieldset'>
                                                    <Field name='tax_residence'>
                                                        {({ field }) => (
                                                            <Autocomplete
                                                                id='real_mt5_tax_residence'
                                                                data-lpignore='true'
                                                                type='search'
                                                                autoComplete='off'
                                                                label={localize('Tax residence')}
                                                                error={touched.tax_residence && errors.tax_residence}
                                                                disabled={
                                                                    values.tax_residence &&
                                                                    is_fully_authenticated
                                                                }
                                                                list_items={residence_list}
                                                                onItemSelection={(item) => setFieldValue(
                                                                    'tax_residence',
                                                                    item.text,
                                                                    false,
                                                                )}
                                                                {...field}
                                                            />
                                                        )}
                                                    </Field>
                                                </fieldset>
                                                <InputField
                                                    id='real_mt5_tax_identification_number'
                                                    name='tax_identification_number'
                                                    placeholder={localize('Tax identification number')}
                                                />
                                                <p className='details-form__description'>
                                                    <Localize
                                                        i18n_default_text={'Any information you provide is confidential and will be used for verification purposes only.'}
                                                    />
                                                </p>
                                            </div>
                                        </ThemedScrollbars>
                                    </div>
                                </div>
                                <FormSubmitButton
                                    cancel_label={localize('Previous')}
                                    is_disabled={
                                        isSubmitting ||
                                        Object.keys(errors).length > 0
                                    }
                                    label={localize('Next')}
                                    onCancel={() => this.handleCancel(values)}
                                />
                            </form>
                        )
                    }
                </Formik>
            </div>
        );
    }
}

MT5PersonalDetailsForm.propTypes = {
    is_fully_authenticated: PropTypes.bool,
    onCancel              : PropTypes.func,
    onSave                : PropTypes.func,
    onSubmit              : PropTypes.func,
    residence_list        : PropTypes.array,
    value                 : PropTypes.object,
};

export default MT5PersonalDetailsForm;
