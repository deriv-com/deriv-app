import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    Div100vhContainer,
    Dropdown,
    FormSubmitButton,
    FormSubmitErrorMessage,
    Input,
    Loading,
    MobileWrapper,
    Modal,
    SelectNative,
    ThemedScrollbars,
    Text,
} from '@deriv/components';
import { FormSubHeader } from '@deriv/account';
import { isDeepEqual, isDesktop, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

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

export const InputField = ({ maxLength, name, optional = false, ...props }) => (
    <Field name={name}>
        {({ field, form: { errors, touched } }) => (
            <Input
                type='text'
                required={!optional}
                name={name}
                autoComplete='off'
                maxLength={maxLength || '30'}
                error={touched[field.name] && errors[field.name]}
                {...field}
                {...props}
            />
        )}
    </Field>
);

const validatePersonalDetails = ({ values, residence_list, account_opening_reason, is_tin_required }) => {
    const [tax_residence_obj] = residence_list.filter(res => res.text === values.tax_residence && res.tin_format);
    const [tin_format] = tax_residence_obj?.tin_format ?? [];
    const tin_regex = tin_format || '^[A-Za-z0-9./s-]{0,25}$'; // fallback to API's default rule check

    const validations = {
        citizen: [v => !!v, v => residence_list.map(i => i.text).includes(v)],
        tax_residence: [v => !!v, v => residence_list.map(i => i.text).includes(v)],
        tax_identification_number: [
            v => ((!values.tax_residence && is_tin_required) || tin_format ? !!v : true),
            v => (tin_regex ? v.match(tin_regex) : true),
        ],
        account_opening_reason: [v => !!v, v => account_opening_reason.map(i => i.value).includes(v)],
    };
    const mappedKey = {
        citizen: localize('Citizenship'),
        tax_residence: localize('Tax residence'),
        tax_identification_number: localize('Tax identification number'),
        account_opening_reason: localize('Account opening reason'),
    };

    const field_error_messages = field_name => [
        localize('{{field_name}} is required', { field_name }),
        localize('{{field_name}} is not properly formatted.', { field_name }),
    ];

    const errors = {};

    Object.entries(validations).forEach(([key, rules]) => {
        const error_index = rules.findIndex(v => !v(values[key]));
        if (error_index !== -1) {
            errors[key] = <React.Fragment>{field_error_messages(mappedKey[key])[error_index]}</React.Fragment>;
        }
    });

    return errors;
};

const findDefaultValuesInResidenceList = (citizen_text, tax_residence_text, residence_list) => {
    let citizen, tax_residence;
    residence_list.forEach(item => {
        if (item.text === citizen_text) {
            citizen = item;
        }
        if (item.text === tax_residence_text) {
            tax_residence = item;
        }
    });
    return { citizen, tax_residence };
};

const submitForm = (values, actions, idx, onSubmitFn, is_dirty, residence_list) => {
    const { citizen: citizen_text, tax_residence: tax_residence_text, ...restOfValues } = values;
    const { citizen, tax_residence } = findDefaultValuesInResidenceList(
        citizen_text,
        tax_residence_text,
        residence_list
    );

    const payload = {
        citizen: typeof citizen !== 'undefined' ? citizen.value : '',
        tax_residence: typeof tax_residence !== 'undefined' ? tax_residence.value : '',
        ...restOfValues,
    };
    onSubmitFn(idx, payload, actions.setSubmitting, is_dirty);
};

const MT5PersonalDetailsForm = ({
    onSave,
    is_fully_authenticated,
    is_loading,
    landing_company,
    residence_list,
    onCancel,
    onSubmit,
    value,
    index,
    form_error,
}) => {
    const account_opening_reason = getAccountOpeningReasonList();
    const is_tin_required = landing_company?.config?.tax_details_required ?? false;

    const handleCancel = values => {
        onSave(index, values);
        onCancel();
    };

    const onSubmitForm = (values, actions) =>
        submitForm(values, actions, index, onSubmit, !isDeepEqual(value, values), residence_list);

    if (residence_list.length === 0) return <Loading is_fullscreen={false} />;
    if (is_loading) return <Loading is_fullscreen={false} />;

    return (
        <Formik
            initialValues={{
                citizen: value.citizen,
                tax_residence: value.tax_residence,
                tax_identification_number: value.tax_identification_number,
                account_opening_reason: value.account_opening_reason,
            }}
            validateOnMount
            validateOnChange
            validateOnBlur
            validate={values =>
                validatePersonalDetails({
                    values,
                    residence_list,
                    account_opening_reason,
                    is_tin_required,
                })
            }
            onSubmit={onSubmitForm}
        >
            {({
                handleSubmit,
                isSubmitting,
                handleChange,
                handleBlur,
                errors,
                touched,
                values,
                setFieldValue,
                isValid,
            }) => (
                <AutoHeightWrapper default_height={200} height_offset={isDesktop() ? 148 : null}>
                    {({ height, setRef }) => (
                        <form
                            className='mt5-financial-stp-modal__form'
                            ref={setRef}
                            onSubmit={handleSubmit}
                            autoComplete='off'
                        >
                            <Div100vhContainer
                                className='details-form'
                                max_autoheight_offset='179px'
                                is_disabled={isDesktop()}
                            >
                                <Text as='p' size='xxxs' align='center' className='details-form__description'>
                                    <Localize
                                        i18n_default_text={
                                            'Any information you provide is confidential and will be used for verification purposes only.'
                                        }
                                    />
                                </Text>
                                <ThemedScrollbars height={height} is_bypassed={isMobile()}>
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
                                                            list_portal_id='modal_root'
                                                            required
                                                        />
                                                    )}
                                                </Field>
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <SelectNative
                                                    placeholder={localize('Please select')}
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
                                                            list_portal_id='modal_root'
                                                            {...field}
                                                        />
                                                    )}
                                                </Field>
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <SelectNative
                                                    placeholder={localize('Please select')}
                                                    label={localize('Tax residence')}
                                                    value={values.tax_residence}
                                                    error={touched.tax_residence && errors.tax_residence}
                                                    disabled={value.tax_residence && is_fully_authenticated}
                                                    list_items={residence_list}
                                                    use_text={true}
                                                    onChange={e => setFieldValue('tax_residence', e.target.value, true)}
                                                    required
                                                />
                                            </MobileWrapper>
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <InputField
                                                id='real_mt5_tax_identification_number'
                                                name='tax_identification_number'
                                                label={localize('Tax identification number')}
                                                placeholder={localize('Tax identification number')}
                                                value={values.tax_identification_number}
                                                onBlur={handleBlur}
                                                optional
                                            />
                                        </fieldset>
                                        <FormSubHeader title={localize('Account opening reason')} />
                                        <Field name='account_opening_reason'>
                                            {({ field }) => (
                                                <React.Fragment>
                                                    <DesktopWrapper>
                                                        <Dropdown
                                                            placeholder={localize('Account opening reason')}
                                                            is_align_text_left
                                                            name={field.name}
                                                            list={account_opening_reason}
                                                            value={values.account_opening_reason}
                                                            onChange={handleChange}
                                                            handleBlur={handleBlur}
                                                            error={
                                                                touched.account_opening_reason &&
                                                                errors.account_opening_reason
                                                            }
                                                            list_portal_id='modal_root'
                                                            {...field}
                                                        />
                                                    </DesktopWrapper>
                                                    <MobileWrapper>
                                                        <SelectNative
                                                            placeholder={localize('Please select')}
                                                            name={field.name}
                                                            label={localize('Account opening reason')}
                                                            list_items={account_opening_reason}
                                                            value={values.account_opening_reason}
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
                                                        />
                                                    </MobileWrapper>
                                                </React.Fragment>
                                            )}
                                        </Field>
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer is_bypassed={isMobile()}>
                                {form_error && <FormSubmitErrorMessage message={form_error} />}
                                <FormSubmitButton
                                    cancel_label={localize('Previous')}
                                    is_disabled={isSubmitting || !isValid}
                                    is_absolute={isMobile()}
                                    label={localize('Next')}
                                    onCancel={() => handleCancel(values)}
                                />
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

MT5PersonalDetailsForm.propTypes = {
    is_fully_authenticated: PropTypes.bool,
    is_loading: PropTypes.bool,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onSubmit: PropTypes.func,
    residence_list: PropTypes.array,
    value: PropTypes.object,
    landing_company: PropTypes.object.isRequired,
};

export default MT5PersonalDetailsForm;
