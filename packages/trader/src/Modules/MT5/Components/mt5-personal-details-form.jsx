import classNames from 'classnames';
import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Autocomplete,
    AutoHeightWrapper,
    Div100vhContainer,
    Dropdown,
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
            tax_identification_number: [v => !!v, v => /^[\w-]{0,20}$/.test(v)],
            account_opening_reason: [v => !!v, v => this.state.account_opening_reason.map(i => i.text).includes(v)],
        };

        const mappedKey = {
            citizen: localize('Citizenship'),
            tax_residence: localize('Tax residence'),
            tax_identification_number: localize('Tax identification number'),
            account_opening_reason: localize('Account opening reason'),
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
                {({ handleSubmit, isSubmitting, handleChange, handleBlur, errors, touched, values, setFieldValue }) => (
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
                                    <ThemedScrollbars height={`calc(${height}px - 120px)`} is_bypassed={isMobile()}>
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
                                                                list_height='160px'
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
                                            <InputField
                                                id='real_mt5_tax_identification_number'
                                                name='tax_identification_number'
                                                placeholder={localize('Tax identification number')}
                                                value={values.tax_identification_number}
                                                onBlur={handleBlur}
                                            />
                                            <FormSubHeader title={localize('Account opening reason')} />
                                            <Field name='account_opening_reason'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Account opening reason')}
                                                                is_align_text_left
                                                                is_alignment_top
                                                                name={field.name}
                                                                list={this.state.account_opening_reason}
                                                                value={values.account_opening_reason}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.account_opening_reason &&
                                                                    errors.account_opening_reason
                                                                }
                                                                {...field}
                                                                required
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                name={field.name}
                                                                label={localize('Account opening reason')}
                                                                list_items={this.state.account_opening_reason}
                                                                value={values.account_opening_reason}
                                                                use_text={true}
                                                                error={
                                                                    touched.account_opening_reason &&
                                                                    errors.account_opening_reason
                                                                }
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'account_opening_reason',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                required
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
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
