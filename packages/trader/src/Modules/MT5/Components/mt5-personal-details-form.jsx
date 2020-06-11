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

const getAccountOpeningReasonList = () => [
    {
        text: localize('Hedging'),
        value: 'Hedging',
    },
    {
        text: localize('Income Earning'),
        value: 'Income Earning',
    },
    {
        text: localize('Speculative'),
        value: 'Speculative',
    },
    {
        text: localize('Peer-to-peer exchange'),
        value: 'Peer-to-peer exchange',
    },
];

class TaxIdentificationNumber extends React.Component {
    softValidate = (v, { tax_residence }) => {
        const { residence_list } = this.props;

        const from_list = residence_list.filter(res => res.text === tax_residence && res?.tin_format);

        const tax_regex = from_list[0]?.tin_format?.[0];

        const has_notice = tax_regex ? new RegExp(tax_regex).test(v) : /^[\w-]{0,20}$/.test(v);

        return has_notice ? (
            <Localize i18n_default_text='This Tax Identification Number (TIN) is invalid. You may continue, but to facilitate future payment processes, valid tax information will be required.' />
        ) : null;
    };

    render() {
        const { name, optional, ...props } = this.props;
        return (
            <Field name={name}>
                {({ field, form: { errors, touched, values } }) => {
                    return (
                        <React.Fragment>
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
                            <p className={classNames('tin-input--has-error')}>
                                {this.softValidate(field.value, values)}
                            </p>
                        </React.Fragment>
                    );
                }}
            </Field>
        );
    }
}

TaxIdentificationNumber.propTypes = {
    name: PropTypes.any,
    residence_list: PropTypes.array,
    optional: PropTypes.bool,
};

TaxIdentificationNumber.defaultProps = { optional: false };

export const InputField = ({ name, optional = false, ...props }) => (
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

class MT5PersonalDetailsForm extends React.Component {
    is_initial_valid = false;
    state = {
        is_acc_op_focused: false,
        account_opening_reason: getAccountOpeningReasonList(),
    };

    handleCancel = values => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    validatePersonalDetails = values => {
        const validations = {
            citizen: [v => !!v, v => this.props.residence_list.map(i => i.text).includes(v)],
            tax_residence: [v => !!v, v => this.props.residence_list.map(i => i.text).includes(v)],
            tax_identification_number: [v => !!v, (v, values) => !!values.tax_residence],
            account_opening_reason: [v => !!v, v => this.state.account_opening_reason.map(i => i.text).includes(v)],
        };

        const mappedKey = {
            citizen: localize('Citizenship'),
            tax_residence: localize('Tax residence'),
            tax_identification_number: localize('Tax identification number'),
            account_opening_reason: localize('Account opening reason'),
        };

        const common_messages = ['{{field_name}} is required', '{{field_name}} is not properly formatted.'];
        const tax_identification_number_messages = ['{{field_name}} is required', 'Please fill-in tax residence.'];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => !v(values[key], values));
            if (error_index !== -1) {
                switch (key) {
                    case 'tax_identification_number':
                        errors[key] = (
                            <Localize
                                i18n_default_text={tax_identification_number_messages[error_index]}
                                values={{
                                    field_name: mappedKey[key],
                                }}
                            />
                        );
                        break;
                    default:
                        errors[key] = (
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

    toggleAccOpeningDropdown = () => {
        this.setState({
            is_acc_op_focused: !this.state.is_acc_op_focused,
        });
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
                    account_opening_reason: value.account_opening_reason,
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
                {({ handleSubmit, isSubmitting, errors, touched, values, setFieldValue, setFieldTouched }) => (
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
                                                                autoComplete='off'
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
                                                                autoComplete='off'
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
                                            <TaxIdentificationNumber
                                                id='real_mt5_tax_identification_number'
                                                name='tax_identification_number'
                                                placeholder={localize('Tax identification number')}
                                                residence_list={this.props.residence_list}
                                            />
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
                                                        list_items={this.state.account_opening_reason}
                                                        onItemSelection={({ value: v, text }) => {
                                                            setFieldValue(
                                                                'account_opening_reason',
                                                                v ? text : '',
                                                                true
                                                            );
                                                            setFieldTouched('account_opening_reason', true, true);
                                                        }}
                                                        onFocus={this.toggleAccOpeningDropdown}
                                                        onBlur={this.toggleAccOpeningDropdown}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                            {/* Extend the modal to allow the scrolling when dropdown is open */}
                                            <div
                                                style={{
                                                    paddingBottom: this.state.is_acc_op_focused ? '14rem' : '0',
                                                }}
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
