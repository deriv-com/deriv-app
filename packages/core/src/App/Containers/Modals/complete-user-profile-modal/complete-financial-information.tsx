/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck [TODO] - Need to fix typescript errors

import React from 'react';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';

import {
    GetFinancialAssessment,
    GetFinancialAssessmentResponse,
    GetSettings,
    ResidenceList,
    SetFinancialAssessmentRequest,
} from '@deriv/api-types';
import {
    Autocomplete,
    Checkbox,
    Dropdown,
    FormSubmitButton,
    Loading,
    Modal,
    SelectNative,
    Text,
} from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useFinancialAssessmentQuestions } from '@deriv/hooks';
import { shouldHideOccupationField, WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

import {
    getAccountOpeningReasonList,
    getAccountTurnoverList,
    getEmploymentIndustryList,
    getEmploymentStatusList,
    getEstimatedWorthList,
    getIncomeSourceList,
    getNetIncomeList,
    getOccupationList,
    getSourceOfWealthList,
} from './financial-information-list';
import FormInputField from './form-input-field';

type TCompleteFinancialAssessment = {
    account_settings: GetSettings;
    residenceList: ResidenceList;
    onClose: () => void;
};

type TPersonalDetailsBaseForm = {
    account_opening_reason: string;
    tax_residence: string;
    tax_identification_number: string;
    tax_identification_confirm: boolean;
};

type TFinancialInformationForm = Omit<SetFinancialAssessmentRequest, 'set_financial_assessment'> &
    TPersonalDetailsBaseForm & { no_tax_information: boolean; tax_identification_confirm: boolean } & {
        investment_intention: string;
    };

const CompleteFinancialAssessment = observer(
    ({ account_settings, residenceList, onClose }: TCompleteFinancialAssessment) => {
        const { client, notifications } = useStore();
        const { setFinancialAndTradingAssessment, is_authentication_needed } = client;
        const { isMobile, isDesktop } = useDevice();
        const { refreshNotifications } = notifications;
        const { data: financial_questions, isLoading: is_questions_loading } = useFinancialAssessmentQuestions();

        const [is_loading, setIsLoading] = React.useState(true);
        const [financial_assessment_information, setFinancialAssessmentInformation] = React.useState<
            Partial<GetFinancialAssessment>
        >({});
        const [initial_form_values, setInitialFormValues] = React.useState<Partial<TFinancialInformationForm>>({});
        const [financial_information_version, setFinancialInformationVersion] = React.useState('');
        const [current_step, setCurrentStep] = React.useState(1);
        const [tax_residence_to_display, setTaxResidenceToDisplay] = React.useState('');

        const { tax_residence, tax_identification_number, account_opening_reason, immutable_fields } = account_settings;

        const isFieldDisabled = (name: keyof GetSettings): boolean => {
            return !!immutable_fields?.includes(name);
        };

        const shouldShowFinancialField = (fieldName: keyof GetFinancialAssessment): boolean => {
            if (financial_information_version === 'v1') return true;
            const fieldValue = financial_assessment_information?.[fieldName];
            return (
                fieldValue === undefined || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0)
            );
        };

        // Convert stored key to display text from WS questions
        const getTextFromKey = (
            question_id: keyof NonNullable<typeof financial_questions>['questions'],
            key?: string
        ) => {
            const answers = financial_questions?.questions?.[question_id]?.answers;
            if (!answers || !key) return '';
            const matched = answers.find(a => a.key === key);
            return matched?.value ?? '';
        };

        // Evaluate WS-driven hide_if rules for a target question using stored keys in form values
        const shouldHideByFinancialQuestions = (
            question_id: keyof NonNullable<typeof financial_questions>['questions'],
            form_values: Partial<TFinancialInformationForm>
        ): boolean => {
            const question = financial_questions?.questions?.[question_id];
            if (!question || !question.hide_if?.length) return false;

            return question.hide_if.some(rule => {
                // Rule format: "<ref_question>.answers.key.<key>"
                const parts = rule.split('.');
                const ref_question = parts[0] as keyof NonNullable<typeof financial_questions>['questions'];
                const expected_key = parts[parts.length - 1];
                const selected_key = form_values?.[ref_question as keyof typeof form_values];
                return selected_key === expected_key;
            });
        };

        React.useEffect(() => {
            WS.authorized.storage.getFinancialAssessment().then((data: GetFinancialAssessmentResponse) => {
                if (data?.get_financial_assessment) {
                    setFinancialInformationVersion(
                        data.get_financial_assessment?.financial_information_version ?? 'v2'
                    );

                    // For v1, treat as empty financial_assessment_information
                    if (financial_information_version === 'v1') {
                        setFinancialAssessmentInformation({});
                    } else {
                        setFinancialAssessmentInformation(data.get_financial_assessment);
                    }

                    setInitialFormValues({
                        ...(financial_information_version === 'v1' ? {} : financial_assessment_information),
                        account_opening_reason: account_opening_reason || '',
                        tax_residence: tax_residence || '',
                        tax_identification_number: tax_identification_number || '',
                        no_tax_information: false,
                        tax_identification_confirm: false,
                    });
                } else {
                    // If no financial assessment data, initialize with account_settings values
                    setFinancialAssessmentInformation({});
                    setInitialFormValues({
                        tax_residence: tax_residence || '',
                        tax_identification_number: tax_identification_number || '',
                        account_opening_reason: account_opening_reason || '',
                        no_tax_information: false,
                        tax_identification_confirm: false,
                    });
                    setFinancialInformationVersion('');
                }
                setIsLoading(false);
            });
        }, []);

        const onSubmit = async (
            values: Partial<TFinancialInformationForm>,
            helpers: FormikHelpers<Partial<TFinancialInformationForm>>
        ) => {
            try {
                const settings_payload = {
                    account_opening_reason: values.account_opening_reason,
                    tax_residence: values.tax_residence,
                    tax_identification_number: values.tax_identification_number,
                    tin_skipped: values.no_tax_information ? 1 : 0,
                };

                if (values.no_tax_information) {
                    delete settings_payload.tax_residence;
                    delete settings_payload.tax_identification_number;
                }

                if (isFieldDisabled('tax_residence')) {
                    delete settings_payload.tax_residence;
                }
                if (isFieldDisabled('tax_identification_number')) {
                    delete settings_payload.tax_identification_number;
                }
                if (isFieldDisabled('account_opening_reason')) {
                    delete settings_payload.account_opening_reason;
                }

                const settings_response = await WS.setSettings(settings_payload);

                if (settings_response?.error) {
                    helpers.setStatus({ error_message: settings_response.error?.code });
                    helpers.setSubmitting(false);
                    return;
                }

                const fa_payload = {
                    financial_information: {
                        employment_status: getTextFromKey('employment_status', values.employment_status as string),
                        income_source: getTextFromKey('income_source', values.income_source as string),
                        net_income: getTextFromKey('net_income', values.net_income as string),
                        estimated_worth: getTextFromKey('estimated_worth', values.estimated_worth as string),
                        investment_intention: getTextFromKey(
                            'investment_intention',
                            values.investment_intention as string
                        ),
                        source_of_wealth: (values.source_of_wealth || '').split(/[;,]/).filter(Boolean).join(';'),
                        occupation: getTextFromKey('occupation', values.occupation as string),
                        employment_industry: getTextFromKey(
                            'employment_industry',
                            values.employment_industry as string
                        ),
                    },
                    financial_information_version: 'v2',
                };

                Object.keys(fa_payload.financial_information).forEach(key => {
                    if (fa_payload.financial_information[key as keyof typeof fa_payload.financial_information] === '') {
                        delete fa_payload.financial_information[key as keyof typeof fa_payload.financial_information];
                    }
                });

                const fa_response = await setFinancialAndTradingAssessment(fa_payload);

                if (fa_response?.error) {
                    const error_message = fa_response.error?.message;
                    helpers.setStatus({ msg: error_message });
                    helpers.setSubmitting(false);
                    return;
                }

                // Success: Update local state and show success feedback
                helpers.setSubmitting(false);
                refreshNotifications();
                onClose();

                // Optionally update local state with the response data
                // You might want to refetch the financial assessment data here
            } catch (_error) {
                // Handle unexpected errors
                helpers.setStatus({ msg: 'An unexpected error occurred. Please try again.' });
                helpers.setSubmitting(false);
            }
        };

        const validateStep1 = (values: Partial<TFinancialInformationForm>) => {
            const errors: Record<string, string> = {};

            if (!isFieldDisabled('employment_status') && !values.employment_status) {
                errors.employment_status = localize('This field is required');
            }

            if (!isFieldDisabled('account_opening_reason') && !values.account_opening_reason) {
                errors.account_opening_reason = localize('This field is required');
            }

            if (!isFieldDisabled('tax_residence') && !values.tax_residence) {
                errors.tax_residence = localize('This field is required');
            }
            if (!isFieldDisabled('tax_identification_number') && !values.tax_identification_number) {
                errors.tax_identification_number = localize('This field is required');
            }

            if (!values.tax_identification_confirm) {
                errors.tax_identification_confirm = localize('This field is required');
            }

            if (values.no_tax_information) {
                delete errors.tax_residence;
                delete errors.tax_identification_number;
                delete errors.tax_identification_confirm;
            }

            return errors;
        };

        const validateStep2 = (values: Partial<TFinancialInformationForm>) => {
            const errors: Record<string, string> = {};
            const required_fields = [
                'employment_industry',
                'occupation',
                'income_source',
                'net_income',
                'estimated_worth',
                'investment_intention',
            ];

            // Only validate fields that should be shown and when user has tax information
            required_fields.forEach(field => {
                const fieldKey = field as keyof GetFinancialAssessment;
                if (shouldShowFinancialField(fieldKey) && !values[field as keyof TFinancialInformationForm]) {
                    errors[field] = localize('This field is required');
                }
            });

            // Skip validation for questions hidden by WS rules
            if (shouldHideByFinancialQuestions('occupation', values)) {
                delete errors.occupation;
            }
            if (shouldHideByFinancialQuestions('employment_industry', values)) {
                delete errors.employment_industry;
            }

            return errors;
        };

        const validateStep3 = (values: Partial<TFinancialInformationForm>) => {
            const errors: Record<string, string> = {};

            // Only validate if field should be shown and user has tax information
            if (shouldShowFinancialField('source_of_wealth')) {
                const selected_values = values.source_of_wealth
                    ? values.source_of_wealth.split(';').filter(Boolean)
                    : [];

                if (selected_values.length === 0) {
                    errors.source_of_wealth = localize('Please select at least one source of wealth');
                } else if (selected_values.length > 2) {
                    errors.source_of_wealth = localize('Please select up to 2 sources');
                }
            }

            return errors;
        };

        const validateCurrentStep = (values: Partial<TFinancialInformationForm>) => {
            switch (current_step) {
                case 1:
                    return validateStep1(values);
                case 2:
                    return validateStep2(values);
                case 3:
                    return validateStep3(values);
                default:
                    return {};
            }
        };

        const handleNext = (
            values: Partial<TFinancialInformationForm>,
            helpers: FormikHelpers<Partial<TFinancialInformationForm>>
        ) => {
            if (current_step < 3) {
                setCurrentStep(current_step + 1);
                helpers.setSubmitting(false);
            } else {
                onSubmit(values, helpers);
            }
        };

        if (is_loading || is_questions_loading)
            return <Loading is_fullscreen={false} className='account__initial-loader' />;
        if (isMobile && is_authentication_needed) onClose();

        const setInitialFormData = (): Partial<TFinancialInformationForm> => {
            // Use initial_form_values which already contains merged data from account_settings and financial_assessment_information
            let form_data: Partial<TFinancialInformationForm> = {
                ...initial_form_values,
            };
            /**
             * Remove hidden fields determined by WS rules
             */
            if (shouldHideByFinancialQuestions('occupation', form_data)) {
                delete form_data.occupation;
            }
            if (shouldHideByFinancialQuestions('employment_industry', form_data)) {
                delete form_data.employment_industry;
            }

            if (financial_information_version === 'v1') {
                // For v1, clear fields but retain values for disabled (immutable) fields
                form_data = {
                    ...form_data,
                    // Only clear account_opening_reason if it's not disabled
                    account_opening_reason: isFieldDisabled('account_opening_reason')
                        ? form_data.account_opening_reason
                        : undefined,
                    // Only clear tax_residence if it's not disabled
                    tax_residence: isFieldDisabled('tax_residence') ? form_data.tax_residence : undefined,
                    // Only clear tax_identification_number if it's not disabled
                    tax_identification_number: isFieldDisabled('tax_identification_number')
                        ? form_data.tax_identification_number
                        : undefined,
                };
            }

            return form_data;
        };

        return (
            <Formik<Partial<TFinancialInformationForm>>
                initialValues={setInitialFormData()}
                enableReinitialize
                validate={validateCurrentStep}
                onSubmit={handleNext}
            >
                {({ handleSubmit, isSubmitting, values, setFieldValue, isValid, handleChange }) => {
                    return (
                        <Form className='complete-user-profile-modal__form' onSubmit={handleSubmit}>
                            {current_step === 1 && (
                                <>
                                    {/* Employment Status */}
                                    <div className='complete-user-profile-modal__bottom-margin'>
                                        <Text
                                            weight='bold'
                                            className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                                        >
                                            <Localize i18n_default_text='Employment status' />
                                        </Text>
                                        <Field name='employment_status'>
                                            {({
                                                field,
                                                form: { setFieldValue, handleBlur, handleChange },
                                                meta,
                                            }: FieldProps) => (
                                                <div className='employment-status-field'>
                                                    {isDesktop ? (
                                                        <Dropdown
                                                            {...field}
                                                            placeholder={localize('Employment status')}
                                                            is_align_text_left
                                                            name={field.name}
                                                            list={getEmploymentStatusList({ financial_questions })}
                                                            value={field.value}
                                                            onChange={(e: {
                                                                target: { name: string; value: string };
                                                            }) => {
                                                                handleChange(e);
                                                                setFieldValue('no_tax_information', false);
                                                            }}
                                                            handleBlur={handleBlur}
                                                            error={meta.touched ? meta.error : undefined}
                                                            disabled={isFieldDisabled('employment_status')}
                                                        />
                                                    ) : (
                                                        <SelectNative
                                                            {...field}
                                                            placeholder={localize('Please select')}
                                                            name={field.name}
                                                            label={localize('Employment status')}
                                                            list_items={getEmploymentStatusList({
                                                                financial_questions,
                                                            })}
                                                            value={field.value}
                                                            error={meta.touched ? meta.error : undefined}
                                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                                setFieldValue(field.name, e.target?.name);
                                                                setFieldValue('no_tax_information', false);
                                                                handleChange(e);
                                                            }}
                                                            disabled={isFieldDisabled('employment_status')}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                    </div>
                                    {shouldHideOccupationField(
                                        getTextFromKey('employment_status', values?.employment_status)
                                    ) && (
                                        <div className='complete-user-profile-modal__bottom-margin'>
                                            <Field name='no_tax_information'>
                                                {({ field }: FieldProps) => (
                                                    <Checkbox
                                                        {...field}
                                                        label={localize('I do not have tax information.')}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                    )}
                                    {/* Tax Residence Field */}
                                    {!values.no_tax_information && (
                                        <>
                                            <div className='complete-user-profile-modal__bottom-margin'>
                                                <Text
                                                    weight='bold'
                                                    className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                                                >
                                                    <Localize i18n_default_text='Employment status' />
                                                </Text>
                                                <Field name='tax_residence'>
                                                    {({ field, form: { setFieldValue }, meta }: FieldProps) => (
                                                        <div className='complete-user-profile-modal__bottom-margin'>
                                                            {isDesktop ? (
                                                                <Autocomplete
                                                                    {...field}
                                                                    data-lpignore='true'
                                                                    autoComplete='off'
                                                                    label={localize('Tax residence')}
                                                                    error={meta.touched ? meta.error : undefined}
                                                                    value={tax_residence_to_display || field.value}
                                                                    list_items={residenceList}
                                                                    onItemSelection={(item: TItem) => {
                                                                        setFieldValue(
                                                                            'tax_residence',
                                                                            (item as ResidenceList[0]).value,
                                                                            true
                                                                        );
                                                                        setTaxResidenceToDisplay(
                                                                            (item as ResidenceList[0]).text || ''
                                                                        );
                                                                    }}
                                                                    data-testid='tax_residence'
                                                                    disabled={isFieldDisabled('tax_residence')}
                                                                />
                                                            ) : (
                                                                <SelectNative
                                                                    {...field}
                                                                    placeholder={localize('Tax residence')}
                                                                    name={field.name}
                                                                    label={localize('Tax residence')}
                                                                    list_items={residenceList}
                                                                    value={tax_residence_to_display || field.value}
                                                                    use_text
                                                                    error={meta.touched ? meta.error : ''}
                                                                    onChange={e => {
                                                                        const selected_item = residenceList.find(
                                                                            item => item.text === e.target.value
                                                                        );
                                                                        setTaxResidenceToDisplay(
                                                                            selected_item?.text || ''
                                                                        );
                                                                        handleChange(e);
                                                                        setFieldValue(
                                                                            'tax_residence',
                                                                            selected_item?.value || '',
                                                                            true
                                                                        );
                                                                    }}
                                                                    data_testid='tax_residence_mobile'
                                                                    disabled={isFieldDisabled('tax_residence')}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </Field>
                                            </div>
                                            {/* Tax Identification Number */}
                                            <div className='complete-user-profile-modal__bottom-margin'>
                                                <Text
                                                    weight='bold'
                                                    className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                                                >
                                                    <Localize i18n_default_text='Tax identification number' />
                                                </Text>
                                                <Field name='tax_identification_number'>
                                                    {({ field }: FieldProps) => (
                                                        <FormInputField
                                                            {...field}
                                                            name='tax_identification_number'
                                                            label={localize('Tax identification number')}
                                                            placeholder={localize('Tax identification number')}
                                                            data-testid='tax_identification_number'
                                                            disabled={isFieldDisabled('tax_identification_number')}
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                        </>
                                    )}
                                    {/* Account Opening Reason */}
                                    <div className='complete-user-profile-modal__bottom-margin'>
                                        <Text
                                            weight='bold'
                                            className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                                        >
                                            <Localize i18n_default_text='Account Opening Reason' />
                                        </Text>
                                        <Field name='account_opening_reason'>
                                            {({ field, meta }: FieldProps) => (
                                                <div className='complete-user-profile-modal__bottom-margin'>
                                                    {isDesktop ? (
                                                        <Dropdown
                                                            placeholder={localize('Account opening reason')}
                                                            {...field}
                                                            is_align_text_left
                                                            list={getAccountOpeningReasonList()}
                                                            error={meta.touched && meta.error ? meta.error : ''}
                                                            list_portal_id={'modal_root'}
                                                            disabled={isFieldDisabled('account_opening_reason')}
                                                        />
                                                    ) : (
                                                        <SelectNative
                                                            placeholder={localize('Please select')}
                                                            {...field}
                                                            label={localize('Account opening reason')}
                                                            list_items={getAccountOpeningReasonList()}
                                                            error={meta.touched && meta.error ? meta.error : ''}
                                                            onChange={e => {
                                                                field.onChange(e);
                                                                setFieldValue(
                                                                    'account_opening_reason',
                                                                    e.target.value,
                                                                    true
                                                                );
                                                            }}
                                                            required
                                                            data_testid='account_opening_reason_mobile'
                                                            disabled={isFieldDisabled('account_opening_reason')}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                    </div>
                                    {/* Tax Information Confirmation */}
                                    {!values.no_tax_information && (
                                        <div className='complete-user-profile-modal__bottom-margin'>
                                            <Field name='tax_identification_confirm'>
                                                {({ field }: FieldProps) => (
                                                    <Checkbox
                                                        {...field}
                                                        label={localize(
                                                            'I confirm that my tax information is accurate and complete.'
                                                        )}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                    )}
                                </>
                            )}
                            {current_step === 2 && (
                                <>
                                    {/* Employment Industry */}
                                    {shouldShowFinancialField('employment_industry') &&
                                        !shouldHideByFinancialQuestions('employment_industry', values) && (
                                            <Field name='employment_industry'>
                                                {({ field, meta }: FieldProps) => (
                                                    <div className='complete-user-profile-modal__bottom-margin'>
                                                        {isDesktop ? (
                                                            <Dropdown
                                                                placeholder={localize('Industry of employment')}
                                                                {...field}
                                                                is_align_text_left
                                                                list={getEmploymentIndustryList({
                                                                    financial_questions,
                                                                })} // Add your employment industry list here
                                                                error={meta.touched && meta.error ? meta.error : ''}
                                                                list_portal_id='modal_root'
                                                            />
                                                        ) : (
                                                            <SelectNative
                                                                placeholder={localize('Industry of employment')}
                                                                {...field}
                                                                label={localize('Industry of employment')}
                                                                list_items={getEmploymentIndustryList({
                                                                    financial_questions,
                                                                })} // Add your employment industry list here
                                                                error={meta.touched && meta.error ? meta.error : ''}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                        )}

                                    {/* Occupation */}
                                    {shouldShowFinancialField('occupation') &&
                                        !shouldHideByFinancialQuestions('occupation', values) && (
                                            <Field name='occupation'>
                                                {({ field, meta }: FieldProps) => (
                                                    <div className='complete-user-profile-modal__bottom-margin'>
                                                        {isDesktop ? (
                                                            <Dropdown
                                                                placeholder={localize('Occupation')}
                                                                {...field}
                                                                is_align_text_left
                                                                list={getOccupationList({ financial_questions })}
                                                                error={meta.touched && meta.error ? meta.error : ''}
                                                                list_portal_id='modal_root'
                                                            />
                                                        ) : (
                                                            <SelectNative
                                                                placeholder={localize('Occupation')}
                                                                {...field}
                                                                label={localize('Occupation')}
                                                                list_items={getOccupationList({ financial_questions })}
                                                                error={meta.touched && meta.error ? meta.error : ''}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                        )}

                                    {/* Income Source */}
                                    {shouldShowFinancialField('income_source') && (
                                        <Field name='income_source'>
                                            {({ field, meta }: FieldProps) => (
                                                <div className='complete-user-profile-modal__bottom-margin'>
                                                    {isDesktop ? (
                                                        <Dropdown
                                                            placeholder={localize('Income source')}
                                                            {...field}
                                                            is_align_text_left
                                                            list={getIncomeSourceList({ financial_questions })} // Add your income source list here
                                                            error={meta.touched && meta.error ? meta.error : ''}
                                                            list_portal_id='modal_root'
                                                        />
                                                    ) : (
                                                        <SelectNative
                                                            placeholder={localize('Income source')}
                                                            {...field}
                                                            label={localize('Income source')}
                                                            list_items={getIncomeSourceList({ financial_questions })} // Add your income source list here
                                                            error={meta.touched && meta.error ? meta.error : ''}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                    )}

                                    {/* Net Annual Income */}
                                    {shouldShowFinancialField('net_income') && (
                                        <Field name='net_income'>
                                            {({ field, meta }: FieldProps) => (
                                                <div className='complete-user-profile-modal__bottom-margin'>
                                                    {isDesktop ? (
                                                        <Dropdown
                                                            placeholder={localize('Net annual income')}
                                                            {...field}
                                                            is_align_text_left
                                                            list={getNetIncomeList({ financial_questions })} // Add your net income list here
                                                            error={meta.touched && meta.error ? meta.error : ''}
                                                            list_portal_id='modal_root'
                                                        />
                                                    ) : (
                                                        <SelectNative
                                                            placeholder={localize('Net annual income')}
                                                            {...field}
                                                            label={localize('Net annual income')}
                                                            list_items={getNetIncomeList({ financial_questions })} // Add your net income list here
                                                            error={meta.touched && meta.error ? meta.error : ''}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                    )}

                                    {/* Estimated Net Worth */}
                                    {shouldShowFinancialField('estimated_worth') && (
                                        <Field name='estimated_worth'>
                                            {({ field, meta }: FieldProps) => (
                                                <div className='complete-user-profile-modal__bottom-margin'>
                                                    {isDesktop ? (
                                                        <Dropdown
                                                            placeholder={localize('Estimated net worth')}
                                                            {...field}
                                                            is_align_text_left
                                                            list={getEstimatedWorthList({ financial_questions })} // Add your estimated worth list here
                                                            error={meta.touched && meta.error ? meta.error : ''}
                                                            list_portal_id='modal_root'
                                                        />
                                                    ) : (
                                                        <SelectNative
                                                            placeholder={localize('Estimated net worth')}
                                                            {...field}
                                                            label={localize('Estimated net worth')}
                                                            list_items={getEstimatedWorthList({ financial_questions })} // Add your estimated worth list here
                                                            error={meta.touched && meta.error ? meta.error : ''}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                    )}

                                    {/* Account Turnover */}
                                    {shouldShowFinancialField('investment_intention') && (
                                        <Field name='investment_intention'>
                                            {({ field, meta }: FieldProps) => (
                                                <div className='complete-user-profile-modal__bottom-margin'>
                                                    {isDesktop ? (
                                                        <Dropdown
                                                            placeholder={localize('How much will you invest yearly?')}
                                                            {...field}
                                                            is_align_text_left
                                                            list={getAccountTurnoverList({ financial_questions })} // Add your account turnover list here
                                                            error={meta.touched && meta.error ? meta.error : ''}
                                                            list_portal_id='modal_root'
                                                        />
                                                    ) : (
                                                        <SelectNative
                                                            placeholder={localize('How much will you invest yearly?')}
                                                            {...field}
                                                            label={localize('How much will you invest yearly?')}
                                                            list_items={getAccountTurnoverList({ financial_questions })} // Add your account turnover list here
                                                            error={meta.touched && meta.error ? meta.error : ''}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                    )}
                                </>
                            )}
                            {current_step === 3 && shouldShowFinancialField('source_of_wealth') && (
                                <>
                                    <div className='complete-user-profile-modal__bottom-margin'>
                                        <Text weight='bold'>
                                            <Localize i18n_default_text='Source of wealth' />
                                        </Text>{' '}
                                        <Text>
                                            <Localize i18n_default_text='(Select up to 2 sources)' />
                                        </Text>
                                    </div>
                                    <Field name='source_of_wealth'>
                                        {({ field, meta }: FieldProps) => {
                                            const current_value = field.value || '';

                                            const handleCheckboxChange = (checkbox_value: string) => {
                                                const is_selected = current_value.includes(checkbox_value);

                                                if (is_selected) {
                                                    // Remove the value from the string
                                                    const updated_value = current_value
                                                        .split(',')
                                                        .filter((v: string) => v.trim() !== checkbox_value)
                                                        .join(',');
                                                    setFieldValue('source_of_wealth', updated_value, true);
                                                } else {
                                                    // Check if we can add more (max 2)
                                                    const current_count = current_value
                                                        ? current_value.split(';').filter(Boolean).length
                                                        : 0;
                                                    if (current_count < 2) {
                                                        // Add the value to the string
                                                        const updated_value = current_value
                                                            ? `${current_value},${checkbox_value}`
                                                            : checkbox_value;
                                                        setFieldValue('source_of_wealth', updated_value, true);
                                                    }
                                                }
                                            };

                                            return (
                                                <>
                                                    {getSourceOfWealthList({ financial_questions }).map(item => {
                                                        const is_checked = current_value.includes(item.value);
                                                        const current_count = current_value
                                                            ? current_value.split(';').filter(Boolean).length
                                                            : 0;
                                                        const is_disabled = !is_checked && current_count >= 2;

                                                        return (
                                                            <div
                                                                key={item.text}
                                                                className='complete-user-profile-modal__bottom-margin'
                                                            >
                                                                <Checkbox
                                                                    name={`source_of_wealth_${item.text}`}
                                                                    label={item.text}
                                                                    defaultChecked={is_checked}
                                                                    onChange={() => handleCheckboxChange(item.text)}
                                                                    disabled={is_disabled}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                    {meta.touched && meta.error && (
                                                        <Text size='xs' color='loss-danger'>
                                                            {meta.error}
                                                        </Text>
                                                    )}
                                                </>
                                            );
                                        }}
                                    </Field>
                                </>
                            )}
                            <Modal.Footer className='complete-user-profile-modal__footer'>
                                <FormSubmitButton
                                    label={localize('Next')}
                                    disabled={isSubmitting || !isValid}
                                    is_loading={isSubmitting}
                                    className='complete-user-profile-modal__submit-button'
                                />
                            </Modal.Footer>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
);

export default CompleteFinancialAssessment;
