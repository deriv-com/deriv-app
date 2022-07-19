import { Field, FieldProps, Formik, FormikHelpers as FormikActions, FormikProps } from 'formik';
import React from 'react';
import { FormSubHeader } from '@deriv/account';
import { LandingCompany, ResidenceList } from '@deriv/api-types';
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
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { isDeepEqual, isDesktop, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

type TCFDPersonalDetailsFormProps = {
    is_fully_authenticated: boolean;
    is_loading: boolean;
    landing_company: LandingCompany;
    residence_list: ResidenceList;
    onSubmit: TOnSubmit;
    value: TFormValues;
    index: number;
    form_error?: string;
};

type TValidatePersonalDetailsParams = {
    values: TFormValues;
    residence_list: ResidenceList;
    account_opening_reason: TAccountOpeningReasonList;
    is_tin_required: boolean;
};

type TFindDefaultValuesInResidenceList = (
    citizen_text: string,
    tax_residence_text: string,
    residence_list: ResidenceList
) => {
    citizen?: ResidenceList[0];
    tax_residence?: ResidenceList[0];
};

type TCFDInputFieldProps = {
    id?: string;
    value?: string;
    name: string;
    maxLength?: number;
    label: string;
    optional?: boolean;
    required?: boolean;
    placeholder: string;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

type TFormValues = {
    citizen: string;
    tax_residence: string;
    tax_identification_number: string;
    account_opening_reason: string;
};

type TOnSubmit = (
    index: number,
    value: TFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    is_dirty?: boolean
) => void;

type TSubmitForm = (
    values: TFormValues,
    actions: FormikActions<TFormValues>,
    idx: number,
    onSubmitFn: TOnSubmit,
    is_dirty: boolean,
    residence_list: ResidenceList
) => void;

type TAccountOpeningReasonList = {
    text: string;
    value: string;
}[];

const getAccountOpeningReasonList = (): TAccountOpeningReasonList => [
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

export const InputField = ({ maxLength, name, optional = false, ...props }: TCFDInputFieldProps) => (
    <Field name={name}>
        {({ field, form: { errors, touched } }: FieldProps<string, TFormValues>) => (
            <Input
                {...field}
                type='text'
                required={!optional}
                name={name}
                autoComplete='off'
                maxLength={maxLength || '30'}
                error={touched[field.name as keyof TFormValues] && errors[field.name as keyof TFormValues]}
                {...props}
            />
        )}
    </Field>
);

const validatePersonalDetails = ({
    values,
    residence_list,
    account_opening_reason,
    is_tin_required,
}: TValidatePersonalDetailsParams) => {
    const [tax_residence_obj] = residence_list.filter(res => res.text === values.tax_residence && res.tin_format);
    const [tin_format] = tax_residence_obj?.tin_format ?? [];
    const tin_regex = tin_format || '^[A-Za-z0-9./s-]{0,25}$'; // fallback to API's default rule check

    const validations = {
        citizen: [(v: string) => !!v, (v: string) => residence_list.map(i => i.text).includes(v)],
        tax_residence: [(v: string) => !!v, (v: string) => residence_list.map(i => i.text).includes(v)],
        tax_identification_number: [
            (v: string) => ((!values.tax_residence && is_tin_required) || tin_format ? !!v : true),
            (v: string) => (tin_regex ? v.match(tin_regex) : true),
        ],
        account_opening_reason: [
            (v: string) => !!v,
            (v: string) => account_opening_reason.map(i => i.value).includes(v),
        ],
    };
    const mappedKey: { [key: string]: string } = {
        citizen: localize('Citizenship'),
        tax_residence: localize('Tax residence'),
        tax_identification_number: localize('Tax identification number'),
        account_opening_reason: localize('Account opening reason'),
    };

    const field_error_messages = (field_name: string): string[] => [
        localize('{{field_name}} is required', { field_name }),
        localize('{{field_name}} is not properly formatted.', { field_name }),
    ];

    const errors: { [key: string]: React.ReactNode } = {};

    Object.entries(validations).forEach(([key, rules]) => {
        const error_index = rules.findIndex(v => !v(values[key as keyof TFormValues]));
        if (error_index !== -1) {
            errors[key] = field_error_messages(mappedKey[key])[error_index];
        }
    });

    return errors;
};

const findDefaultValuesInResidenceList: TFindDefaultValuesInResidenceList = (
    citizen_text,
    tax_residence_text,
    residence_list
) => {
    let citizen, tax_residence;
    residence_list.forEach((item: ResidenceList[0]) => {
        if (item.text === citizen_text) {
            citizen = item;
        }
        if (item.text === tax_residence_text) {
            tax_residence = item;
        }
    });
    return { citizen, tax_residence };
};

const submitForm: TSubmitForm = (values, actions, idx, onSubmitFn, is_dirty, residence_list) => {
    const { citizen: citizen_text, tax_residence: tax_residence_text, ...restOfValues } = values;
    const { citizen, tax_residence } = findDefaultValuesInResidenceList(
        citizen_text,
        tax_residence_text,
        residence_list
    );

    const payload = {
        citizen: citizen && citizen.value ? citizen.value : '',
        tax_residence: tax_residence && tax_residence.value ? tax_residence.value : '',
        ...restOfValues,
    };
    onSubmitFn(idx, payload, actions.setSubmitting, is_dirty);
};

const CFDPersonalDetailsForm = ({
    is_fully_authenticated,
    is_loading,
    landing_company,
    residence_list,
    onSubmit,
    value,
    index,
    form_error,
}: TCFDPersonalDetailsFormProps) => {
    const account_opening_reason = getAccountOpeningReasonList();
    const is_tin_required = !!(landing_company?.config?.tax_details_required ?? false);

    const onSubmitForm = (values: TFormValues, actions: FormikActions<TFormValues>) =>
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
            }: FormikProps<TFormValues>) => {
                const citizenship_error = touched.citizen && errors.citizen;
                const tax_residence_error = touched.tax_residence && errors.tax_residence;
                const account_opening_reason_error = touched.account_opening_reason && errors.account_opening_reason;
                const is_citizenship_disabled = !!(value.citizen && is_fully_authenticated);
                const is_tax_residence_disabled = !!(value.tax_residence && is_fully_authenticated);
                const handleItemSelection = (item: ResidenceList[0], _field: string) => {
                    const item_value = item.value ? item.text : '';
                    setFieldValue(_field, item_value, true);
                };

                return (
                    <AutoHeightWrapper default_height={200} height_offset={isDesktop() ? 148 : null}>
                        {({
                            height,
                            setRef,
                        }: {
                            height: number;
                            setRef: (instance: HTMLFormElement | null) => void;
                        }) => (
                            <form
                                className='cfd-financial-stp-modal__form'
                                ref={setRef}
                                onSubmit={handleSubmit}
                                autoComplete='off'
                            >
                                <Div100vhContainer
                                    className='details-form'
                                    max_autoheight_offset='179px'
                                    is_disabled={isDesktop()}
                                >
                                    <Text
                                        as='p'
                                        size='xxxs'
                                        align='center'
                                        className='details-form__description'
                                        data-testid='dt_cfd_details_form_description'
                                    >
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
                                                        {({ field }: FieldProps<string, TFormValues>) => (
                                                            <Autocomplete
                                                                {...field}
                                                                id='real_mt5_citizenship'
                                                                data-lpignore='true'
                                                                autoComplete='off'
                                                                type='text'
                                                                label={localize('Citizenship')}
                                                                error={citizenship_error}
                                                                disabled={is_citizenship_disabled}
                                                                list_items={residence_list}
                                                                onItemSelection={(item: ResidenceList[0]) =>
                                                                    handleItemSelection(item, 'citizen')
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
                                                        error={citizenship_error}
                                                        disabled={is_citizenship_disabled}
                                                        use_text={true}
                                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                            setFieldValue('citizen', e.target.value, true)
                                                        }
                                                        required
                                                        should_hide_disabled_options={false}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <FormSubHeader title={localize('Tax information')} />
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Field name='tax_residence'>
                                                        {({ field }: FieldProps<string, TFormValues>) => (
                                                            <Autocomplete
                                                                id='real_mt5_tax_residence'
                                                                data-lpignore='true'
                                                                type='text'
                                                                autoComplete='off'
                                                                label={localize('Tax residence')}
                                                                error={tax_residence_error}
                                                                disabled={is_tax_residence_disabled}
                                                                list_items={residence_list}
                                                                onItemSelection={(item: ResidenceList[0]) =>
                                                                    handleItemSelection(item, 'tax_residence')
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
                                                        error={tax_residence_error}
                                                        disabled={is_tax_residence_disabled}
                                                        list_items={residence_list}
                                                        use_text={true}
                                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                            setFieldValue('tax_residence', e.target.value, true)
                                                        }
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
                                                {({ field }: FieldProps<string, TFormValues>) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                {...field}
                                                                placeholder={localize('Account opening reason')}
                                                                is_align_text_left
                                                                name={field.name}
                                                                list={account_opening_reason}
                                                                value={values.account_opening_reason}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={account_opening_reason_error}
                                                                list_portal_id='modal_root'
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                {...field}
                                                                placeholder={localize('Please select')}
                                                                name={field.name}
                                                                label={localize('Account opening reason')}
                                                                list_items={account_opening_reason}
                                                                value={values.account_opening_reason}
                                                                error={account_opening_reason_error}
                                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'account_opening_reason',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
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
                                        is_disabled={isSubmitting || !isValid}
                                        is_absolute={isMobile()}
                                        label={localize('Next')}
                                    />
                                </Modal.Footer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                );
            }}
        </Formik>
    );
};

export default CFDPersonalDetailsForm;
