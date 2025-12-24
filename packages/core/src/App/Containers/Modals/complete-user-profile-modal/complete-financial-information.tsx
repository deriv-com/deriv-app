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
    AutoHeightWrapper,
    Checkbox,
    Dropdown,
    FormSubmitButton,
    Loading,
    Modal,
    SelectNative,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useFinancialAssessmentQuestions, useTinValidations } from '@deriv/hooks';
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
import { FinancialInformationValidationSchema } from './validation';

type TCompleteFinancialAssessment = {
    account_settings: GetSettings;
    residenceList: ResidenceList;
    onClose: () => void;
};

type TFinancialInformationForm = Omit<SetFinancialAssessmentRequest, 'set_financial_assessment'> &
    Partial<GetSettings> & {
        no_tax_information: boolean;
        tax_identification_confirm: boolean;
        investment_intention: string;
    };

const CompleteFinancialAssessment = observer(
    ({ account_settings, residenceList, onClose }: TCompleteFinancialAssessment) => {
        const { client, notifications } = useStore();
        const { setFinancialAndTradingAssessment } = client;
        const { isDesktop } = useDevice();
        const { refreshNotifications, removeNotificationByKey } = notifications;
        const { data: financial_questions, isLoading: is_questions_loading } = useFinancialAssessmentQuestions();
        const { tin_validation_config, mutate } = useTinValidations();

        const [is_loading, setIsLoading] = React.useState(true);
        const [financial_assessment_information, setFinancialAssessmentInformation] = React.useState<
            Partial<GetFinancialAssessment>
        >({});
        const [initial_form_values, setInitialFormValues] = React.useState<Partial<TFinancialInformationForm>>({});
        const [financial_information_version, setFinancialInformationVersion] = React.useState('');
        const [current_step, setCurrentStep] = React.useState(1);
        const [tax_residence_to_display, setTaxResidenceToDisplay] = React.useState('');

        const {
            tax_residence,
            tax_identification_number,
            account_opening_reason,
            employment_status,
            immutable_fields,
            tin_skipped,
        } = account_settings;

        const filter_tax_identification_number =
            tax_identification_number?.toLowerCase() === 'approved000' ? '' : tax_identification_number;

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

        // Normalize string for flexible comparison (lowercase, trim, normalize spaces and hyphens)
        const normalizeStringForComparison = (str: string): string => {
            return str.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[-_]/g, '');
        };

        // Convert display text to stored key from WS questions with flexible case-insensitive matching
        const getKeyFromText = (
            question_id: keyof NonNullable<typeof financial_questions>['questions'],
            text?: string
        ) => {
            const answers = financial_questions?.questions?.[question_id]?.answers;
            if (!answers || !text) return text || '';

            // First try exact match
            const exactMatch = answers.find(a => a.value === text);
            if (exactMatch) return exactMatch.key;

            // Then try case-insensitive match with normalized comparison
            const normalizedText = normalizeStringForComparison(text);
            const flexibleMatch = answers.find(a => normalizeStringForComparison(a.value) === normalizedText);
            if (flexibleMatch) return flexibleMatch.key;
            if (question_id === 'employment_status') return '';

            // If not found, assume it's already a key and return as-is
            return text;
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
                // Find tax_residence display text from residenceList
                const tax_residence_item = tax_residence
                    ? residenceList.find(item => item.value === tax_residence)
                    : undefined;
                if (tax_residence_item) {
                    setTaxResidenceToDisplay(tax_residence_item.text);
                }

                if (data?.get_financial_assessment) {
                    // @ts-expect-error - 'financial_information_version' is not typed in the API types
                    const version = data.get_financial_assessment?.financial_information_version;
                    setFinancialInformationVersion(version);

                    // Use the version from API response directly, not from state
                    const financial_data = version === 'v1' ? {} : data.get_financial_assessment;
                    setFinancialAssessmentInformation(financial_data);

                    // Prioritize account_settings values over financial assessment data
                    setInitialFormValues({
                        ...financial_data,
                        employment_status,
                        account_opening_reason,
                        tax_residence: tax_residence_item?.text || '',
                        tax_identification_number: filter_tax_identification_number,
                        no_tax_information: tin_skipped === 1 && tax_identification_number === 'Approved000',
                        tax_identification_confirm: !!filter_tax_identification_number,
                    });
                } else {
                    // If no financial assessment data, initialize with account_settings values
                    setFinancialAssessmentInformation({});
                    setInitialFormValues({
                        tax_residence: tax_residence_item?.text || '',
                        tax_identification_number: filter_tax_identification_number,
                        account_opening_reason,
                        no_tax_information: tin_skipped === 1 && filter_tax_identification_number === '',
                        tax_identification_confirm: !!filter_tax_identification_number,
                    });
                    setFinancialInformationVersion('');
                }
                setIsLoading(false);
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // Trigger TIN validation when tax_residence is initially set
        React.useEffect(() => {
            if (tax_residence) {
                mutate(tax_residence);
            }
        }, [tax_residence]);

        const taxResidenceItem = (value: string) =>
            value ? residenceList.find(item => item.text === value) : undefined;

        const onSubmit = async (
            values: Partial<TFinancialInformationForm>,
            helpers: FormikHelpers<Partial<TFinancialInformationForm>>
        ) => {
            try {
                const settings_payload = {
                    account_opening_reason: values.account_opening_reason,
                    tax_residence: taxResidenceItem(values.tax_residence)?.value || values.tax_residence,
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

                const eu_occupation = [values.company, values.position].filter(Boolean).join(' - ');

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
                        occupation:
                            getOccupationList({ financial_questions }).length < 1
                                ? eu_occupation
                                : getTextFromKey('occupation', values.occupation as string),
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
                removeNotificationByKey({
                    key: 'notify_financial_assessment',
                    should_show_again: false,
                });
                refreshNotifications();
                onClose();
            } catch (_error) {
                // Handle unexpected errors
                helpers.setStatus({ msg: 'An unexpected error occurred. Please try again.' });
                helpers.setSubmitting(false);
            }
        };

        const validationSchema = React.useMemo(
            () =>
                FinancialInformationValidationSchema({
                    current_step,
                    isFieldDisabled: (name: string) => isFieldDisabled(name as keyof GetSettings),
                    shouldShowFinancialField: (fieldName: string) =>
                        shouldShowFinancialField(fieldName as keyof GetFinancialAssessment),
                    shouldHideByFinancialQuestions: (question_id: string, form_values: Record<string, unknown>) =>
                        shouldHideByFinancialQuestions(
                            question_id as keyof NonNullable<typeof financial_questions>['questions'],
                            form_values as Partial<TFinancialInformationForm>
                        ),
                    tin_validation_config,
                    financial_questions,
                }),
            [
                current_step,
                tin_validation_config,
                immutable_fields,
                financial_assessment_information,
                financial_information_version,
                isFieldDisabled,
                shouldShowFinancialField,
                shouldHideByFinancialQuestions,
                financial_questions,
            ]
        );

        const isCurrentStepValid = (values: Partial<TFinancialInformationForm>): boolean => {
            if (current_step === 1) {
                // Step 1 required fields
                if (!isFieldDisabled('employment_status') && !values.employment_status) {
                    return false;
                }
                if (!isFieldDisabled('account_opening_reason') && !values.account_opening_reason) {
                    return false;
                }
                // Tax residence is required if no_tax_information is false
                if (!values.no_tax_information && !isFieldDisabled('tax_residence') && !values.tax_residence) {
                    return false;
                }
                // Tax identification number validation (complex conditional logic)
                if (
                    !values.no_tax_information &&
                    values.tax_residence &&
                    !isFieldDisabled('tax_identification_number')
                ) {
                    const is_confirm_false =
                        values.tax_identification_confirm === false || values.tax_identification_confirm === 0;
                    if (is_confirm_false && !values.tax_identification_number) {
                        return false;
                    }
                    if (tin_validation_config && Object.keys(tin_validation_config).length > 0) {
                        const is_tin_mandatory =
                            (tin_validation_config as { is_tin_mandatory?: number | boolean })?.is_tin_mandatory ===
                                1 ||
                            (tin_validation_config as { is_tin_mandatory?: number | boolean })?.is_tin_mandatory ===
                                true;
                        if (is_tin_mandatory && !values.tax_identification_number && !is_confirm_false) {
                            return false;
                        }
                    }
                }
                return true;
            } else if (current_step === 2) {
                // Step 2 required fields (only if they should be shown)
                if (
                    shouldShowFinancialField('employment_industry') &&
                    !shouldHideByFinancialQuestions('employment_industry', values) &&
                    !values.employment_industry
                ) {
                    return false;
                }
                if (shouldShowFinancialField('occupation') && !shouldHideByFinancialQuestions('occupation', values)) {
                    const is_occupation_free_text = financial_questions?.questions?.occupation?.type === 'free_text';
                    if (is_occupation_free_text) {
                        if (!values.company || !values.position) {
                            return false;
                        }
                    } else if (!values.occupation) {
                        return false;
                    }
                }
                if (shouldShowFinancialField('income_source') && !values.income_source) {
                    return false;
                }
                if (shouldShowFinancialField('net_income') && !values.net_income) {
                    return false;
                }
                if (shouldShowFinancialField('estimated_worth') && !values.estimated_worth) {
                    return false;
                }
                if (shouldShowFinancialField('investment_intention') && !values.investment_intention) {
                    return false;
                }
                return true;
            } else if (current_step === 3) {
                // Step 3 required fields
                if (shouldShowFinancialField('source_of_wealth') && !values.source_of_wealth) {
                    return false;
                }
                return true;
            }
            return true;
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

        const setInitialFormData = (): Partial<TFinancialInformationForm> => {
            // Use initial_form_values which already contains merged data from account_settings and financial_assessment_information
            const form_data: Partial<TFinancialInformationForm> = {
                ...initial_form_values,
            };

            if (financial_questions?.questions?.occupation?.type === 'free_text' && form_data.occupation) {
                const [company = '', position = ''] = form_data.occupation.split(' - ').map(part => part.trim());
                form_data.company = company;
                form_data.position = position;
            }
            // Convert employment_status from account_settings display text to key format if financial_questions is available
            // Handle case where employment_status might be in form_data or directly from account_settings
            const employment_status_to_convert = form_data.employment_status || employment_status;
            if (employment_status_to_convert && financial_questions?.questions?.employment_status) {
                const employment_status_key = getKeyFromText('employment_status', employment_status_to_convert);
                if (employment_status_key) {
                    form_data.employment_status = employment_status_key;
                } else {
                    delete form_data.employment_status;
                }
            }
            /**
             * Validate account_opening_reason value against available list items
             * If the value doesn't match any list item, set it to empty
             */
            if (form_data.account_opening_reason) {
                const account_opening_reason_list = getAccountOpeningReasonList();
                const is_valid_value = account_opening_reason_list.some(
                    item => item.value === form_data.account_opening_reason
                );
                if (!is_valid_value) {
                    form_data.account_opening_reason = '';
                }
            }
            /**
             * Remove hidden fields determined by WS rules
             */
            if (shouldHideByFinancialQuestions('occupation', form_data)) {
                delete form_data.occupation;
            }
            if (shouldHideByFinancialQuestions('employment_industry', form_data)) {
                delete form_data.employment_industry;
            }
            return form_data;
        };

        return (
            <AutoHeightWrapper default_height={isDesktop ? 625 : 500}>
                {({ height }) => (
                    <ThemedScrollbars autohide={false} height={height}>
                        <Formik<Partial<TFinancialInformationForm>>
                            initialValues={setInitialFormData()}
                            enableReinitialize
                            validationSchema={validationSchema}
                            onSubmit={handleNext}
                            validateOnChange={true}
                            validateOnBlur={true}
                            validateOnMount={true}
                        >
                            {({
                                handleSubmit,
                                isSubmitting,
                                values,
                                setFieldValue,
                                handleChange,
                                isValid,
                                setFieldTouched,
                                validateForm,
                                setFieldError,
                            }) => {
                                // Trigger validation when TIN config loads or changes and TIN has a value
                                const prev_tin_config_ref = React.useRef(tin_validation_config);
                                const prev_tax_residence_ref = React.useRef(values.tax_residence);
                                React.useEffect(() => {
                                    const has_tin_config =
                                        tin_validation_config && Object.keys(tin_validation_config).length > 0;
                                    const had_tin_config =
                                        prev_tin_config_ref.current &&
                                        Object.keys(prev_tin_config_ref.current).length > 0;

                                    // Check if config changed by comparing serialized version
                                    const config_changed =
                                        JSON.stringify(prev_tin_config_ref.current) !==
                                        JSON.stringify(tin_validation_config);
                                    const tax_residence_changed =
                                        prev_tax_residence_ref.current !== values.tax_residence;

                                    // Trigger validation if:
                                    // 1. Config just became available (not empty), OR
                                    // 2. Config changed (switching between countries), OR
                                    // 3. Tax residence changed and config is now available
                                    if (
                                        current_step === 1 &&
                                        values.tax_identification_number &&
                                        values.tax_residence &&
                                        has_tin_config &&
                                        ((!had_tin_config && has_tin_config) ||
                                            (config_changed && has_tin_config) ||
                                            (tax_residence_changed && has_tin_config))
                                    ) {
                                        setFieldTouched('tax_identification_number');
                                        validateForm();
                                    }

                                    prev_tin_config_ref.current = tin_validation_config;
                                    prev_tax_residence_ref.current = values.tax_residence;
                                }, [
                                    tin_validation_config,
                                    values.tax_residence,
                                    current_step,
                                    setFieldTouched,
                                    validateForm,
                                    setFieldError,
                                ]);
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
                                                                        list={getEmploymentStatusList({
                                                                            financial_questions,
                                                                        })}
                                                                        value={field.value}
                                                                        onChange={(
                                                                            e: React.ChangeEvent<HTMLSelectElement>
                                                                        ) => {
                                                                            setFieldValue(field.name, e.target?.name);
                                                                            setFieldValue(
                                                                                'no_tax_information',
                                                                                false,
                                                                                false
                                                                            );
                                                                            handleChange(e);
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
                                                                        onChange={(
                                                                            e: React.ChangeEvent<HTMLSelectElement>
                                                                        ) => {
                                                                            setFieldValue(field.name, e.target?.name);
                                                                            setFieldValue(
                                                                                'no_tax_information',
                                                                                false,
                                                                                false
                                                                            );
                                                                            handleChange(e);
                                                                        }}
                                                                        disabled={isFieldDisabled('employment_status')}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                                {/* No tax information field */}
                                                {filter_tax_identification_number === '' &&
                                                    tin_skipped === 1 &&
                                                    shouldHideOccupationField(
                                                        getTextFromKey('employment_status', values?.employment_status)
                                                    ) && (
                                                        <div className='complete-user-profile-modal__bottom-margin'>
                                                            <Field name='no_tax_information'>
                                                                {({ field }: FieldProps) => (
                                                                    <Checkbox
                                                                        {...field}
                                                                        label={localize(
                                                                            'I do not have tax information.'
                                                                        )}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </div>
                                                    )}
                                                {/* Tax Residence Field */}
                                                {(!shouldHideOccupationField(
                                                    getTextFromKey('employment_status', values?.employment_status)
                                                ) ||
                                                    !values.no_tax_information) && (
                                                    <>
                                                        <div className='complete-user-profile-modal__bottom-margin'>
                                                            <Text
                                                                weight='bold'
                                                                className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                                                            >
                                                                <Localize i18n_default_text='Tax residence' />
                                                            </Text>
                                                            <Field name='tax_residence'>
                                                                {({
                                                                    field,
                                                                    form: { setFieldValue },
                                                                    meta,
                                                                }: FieldProps) => (
                                                                    <div className='complete-user-profile-modal__bottom-margin'>
                                                                        {isDesktop ? (
                                                                            <Autocomplete
                                                                                {...field}
                                                                                data-lpignore='true'
                                                                                autoComplete='off'
                                                                                label={localize('Tax residence')}
                                                                                error={
                                                                                    meta.touched
                                                                                        ? meta.error
                                                                                        : undefined
                                                                                }
                                                                                list_items={residenceList}
                                                                                onItemSelection={(item: TItem) => {
                                                                                    setFieldValue(
                                                                                        'tax_residence',
                                                                                        (item as ResidenceList[0]).value
                                                                                            ? (item as ResidenceList[0])
                                                                                                  .text
                                                                                            : '',
                                                                                        true
                                                                                    );
                                                                                    setFieldValue(
                                                                                        'tax_identification_confirm',
                                                                                        false,
                                                                                        false
                                                                                    );
                                                                                    setFieldError(
                                                                                        'tax_identification_number',
                                                                                        undefined
                                                                                    );
                                                                                    if (
                                                                                        (item as ResidenceList[0]).value
                                                                                    ) {
                                                                                        mutate(
                                                                                            (item as ResidenceList[0])
                                                                                                .value
                                                                                        );
                                                                                    }
                                                                                }}
                                                                                data-testid='tax_residence'
                                                                                disabled={isFieldDisabled(
                                                                                    'tax_residence'
                                                                                )}
                                                                            />
                                                                        ) : (
                                                                            <SelectNative
                                                                                {...field}
                                                                                placeholder={localize('Tax residence')}
                                                                                name={field.name}
                                                                                label={localize('Tax residence')}
                                                                                list_items={residenceList}
                                                                                value={
                                                                                    tax_residence_to_display ||
                                                                                    field.value
                                                                                }
                                                                                use_text
                                                                                error={meta.touched ? meta.error : ''}
                                                                                onChange={e => {
                                                                                    const selected_item =
                                                                                        residenceList.find(
                                                                                            item =>
                                                                                                item.text ===
                                                                                                e.target.value
                                                                                        );
                                                                                    const tax_residence_value =
                                                                                        selected_item?.value || '';
                                                                                    setTaxResidenceToDisplay(
                                                                                        selected_item?.text || ''
                                                                                    );
                                                                                    handleChange(e);
                                                                                    setFieldValue(
                                                                                        'tax_residence',
                                                                                        tax_residence_value,
                                                                                        false
                                                                                    );
                                                                                    setFieldValue(
                                                                                        'tax_identification_confirm',
                                                                                        false,
                                                                                        false
                                                                                    );
                                                                                    setFieldError(
                                                                                        'tax_identification_number',
                                                                                        undefined
                                                                                    );
                                                                                    if (tax_residence_value) {
                                                                                        mutate(tax_residence_value);
                                                                                    }
                                                                                }}
                                                                                data_testid='tax_residence_mobile'
                                                                                disabled={isFieldDisabled(
                                                                                    'tax_residence'
                                                                                )}
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
                                                            <FormInputField
                                                                name='tax_identification_number'
                                                                label={localize('Tax identification number')}
                                                                placeholder={localize('Tax identification number')}
                                                                data-testid='tax_identification_number'
                                                                disabled={isFieldDisabled('tax_identification_number')}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    setFieldValue(
                                                                        'tax_identification_number',
                                                                        e.target.value,
                                                                        false
                                                                    );
                                                                    setFieldValue(
                                                                        'tax_identification_confirm',
                                                                        false,
                                                                        false
                                                                    );
                                                                }}
                                                            />
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
                                                                        error={
                                                                            meta.touched && meta.error ? meta.error : ''
                                                                        }
                                                                        list_portal_id={'modal_root'}
                                                                        disabled={isFieldDisabled(
                                                                            'account_opening_reason'
                                                                        )}
                                                                    />
                                                                ) : (
                                                                    <SelectNative
                                                                        placeholder={localize('Please select')}
                                                                        {...field}
                                                                        label={localize('Account opening reason')}
                                                                        list_items={getAccountOpeningReasonList()}
                                                                        error={
                                                                            meta.touched && meta.error ? meta.error : ''
                                                                        }
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
                                                                        disabled={isFieldDisabled(
                                                                            'account_opening_reason'
                                                                        )}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                                {/* Tax Information Confirmation */}
                                                {!values.no_tax_information &&
                                                    tin_validation_config &&
                                                    Object.keys(tin_validation_config).length > 0 &&
                                                    (() => {
                                                        const is_tin_mandatory = (
                                                            tin_validation_config as {
                                                                is_tin_mandatory?: number | boolean;
                                                            }
                                                        ).is_tin_mandatory;
                                                        const is_mandatory =
                                                            is_tin_mandatory === 1 || is_tin_mandatory === true;
                                                        // Show confirmation if mandatory OR if user is filling up TIN
                                                        return is_mandatory || !!values.tax_identification_number;
                                                    })() && (
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
                                                                            placeholder={localize(
                                                                                'Industry of employment'
                                                                            )}
                                                                            {...field}
                                                                            is_align_text_left
                                                                            list={getEmploymentIndustryList({
                                                                                financial_questions,
                                                                            })} // Add your employment industry list here
                                                                            error={
                                                                                meta.touched && meta.error
                                                                                    ? meta.error
                                                                                    : ''
                                                                            }
                                                                            list_portal_id='modal_root'
                                                                        />
                                                                    ) : (
                                                                        <SelectNative
                                                                            placeholder={localize(
                                                                                'Industry of employment'
                                                                            )}
                                                                            {...field}
                                                                            label={localize('Industry of employment')}
                                                                            list_items={getEmploymentIndustryList({
                                                                                financial_questions,
                                                                            })} // Add your employment industry list here
                                                                            error={
                                                                                meta.touched && meta.error
                                                                                    ? meta.error
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Field>
                                                    )}

                                                {/* Occupation */}
                                                {shouldShowFinancialField('occupation') &&
                                                    !shouldHideByFinancialQuestions('occupation', values) &&
                                                    (getOccupationList({
                                                        financial_questions,
                                                    }).length < 1 ? (
                                                        <div className='complete-user-profile-modal__eu-company-occupation'>
                                                            <FormInputField
                                                                name='company'
                                                                label={localize('Company')}
                                                                placeholder={localize('Company')}
                                                                data-testid='company'
                                                                disabled={isFieldDisabled('occupation')}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    setFieldValue('company', e.target.value, false);
                                                                }}
                                                            />
                                                            -
                                                            <FormInputField
                                                                name='position'
                                                                label={localize('Position')}
                                                                placeholder={localize('Position')}
                                                                data-testid='position'
                                                                disabled={isFieldDisabled('occupation')}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    setFieldValue('position', e.target.value, false);
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Field name='occupation'>
                                                            {({ field, meta }: FieldProps) => (
                                                                <div className='complete-user-profile-modal__bottom-margin'>
                                                                    {isDesktop ? (
                                                                        <Dropdown
                                                                            placeholder={localize('Occupation')}
                                                                            {...field}
                                                                            is_align_text_left
                                                                            list={getOccupationList({
                                                                                financial_questions,
                                                                            })}
                                                                            error={
                                                                                meta.touched && meta.error
                                                                                    ? meta.error
                                                                                    : ''
                                                                            }
                                                                            list_portal_id='modal_root'
                                                                        />
                                                                    ) : (
                                                                        <SelectNative
                                                                            placeholder={localize('Occupation')}
                                                                            {...field}
                                                                            label={localize('Occupation')}
                                                                            list_items={getOccupationList({
                                                                                financial_questions,
                                                                            })}
                                                                            error={
                                                                                meta.touched && meta.error
                                                                                    ? meta.error
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Field>
                                                    ))}

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
                                                                        list={getIncomeSourceList({
                                                                            financial_questions,
                                                                        })} // Add your income source list here
                                                                        error={
                                                                            meta.touched && meta.error ? meta.error : ''
                                                                        }
                                                                        list_portal_id='modal_root'
                                                                    />
                                                                ) : (
                                                                    <SelectNative
                                                                        placeholder={localize('Income source')}
                                                                        {...field}
                                                                        label={localize('Income source')}
                                                                        list_items={getIncomeSourceList({
                                                                            financial_questions,
                                                                        })} // Add your income source list here
                                                                        error={
                                                                            meta.touched && meta.error ? meta.error : ''
                                                                        }
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
                                                                        error={
                                                                            meta.touched && meta.error ? meta.error : ''
                                                                        }
                                                                        list_portal_id='modal_root'
                                                                    />
                                                                ) : (
                                                                    <SelectNative
                                                                        placeholder={localize('Net annual income')}
                                                                        {...field}
                                                                        label={localize('Net annual income')}
                                                                        list_items={getNetIncomeList({
                                                                            financial_questions,
                                                                        })} // Add your net income list here
                                                                        error={
                                                                            meta.touched && meta.error ? meta.error : ''
                                                                        }
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
                                                                        list={getEstimatedWorthList({
                                                                            financial_questions,
                                                                        })} // Add your estimated worth list here
                                                                        error={
                                                                            meta.touched && meta.error ? meta.error : ''
                                                                        }
                                                                        list_portal_id='modal_root'
                                                                    />
                                                                ) : (
                                                                    <SelectNative
                                                                        placeholder={localize('Estimated net worth')}
                                                                        {...field}
                                                                        label={localize('Estimated net worth')}
                                                                        list_items={getEstimatedWorthList({
                                                                            financial_questions,
                                                                        })} // Add your estimated worth list here
                                                                        error={
                                                                            meta.touched && meta.error ? meta.error : ''
                                                                        }
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
                                                                        placeholder={localize(
                                                                            'How much will you invest yearly?'
                                                                        )}
                                                                        {...field}
                                                                        is_align_text_left
                                                                        list={getAccountTurnoverList({
                                                                            financial_questions,
                                                                        })} // Add your account turnover list here
                                                                        error={
                                                                            meta.touched && meta.error ? meta.error : ''
                                                                        }
                                                                        list_portal_id='modal_root'
                                                                    />
                                                                ) : (
                                                                    <SelectNative
                                                                        placeholder={localize(
                                                                            'How much will you invest yearly?'
                                                                        )}
                                                                        {...field}
                                                                        label={localize(
                                                                            'How much will you invest yearly?'
                                                                        )}
                                                                        list_items={getAccountTurnoverList({
                                                                            financial_questions,
                                                                        })} // Add your account turnover list here
                                                                        error={
                                                                            meta.touched && meta.error ? meta.error : ''
                                                                        }
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
                                                            // Split by semicolon only
                                                            const selected_values = current_value
                                                                ? current_value.split(';').filter(Boolean)
                                                                : [];
                                                            const is_selected =
                                                                selected_values.includes(checkbox_value);

                                                            if (is_selected) {
                                                                // Remove the value from the string
                                                                const updated_values = selected_values.filter(
                                                                    v => v.trim() !== checkbox_value
                                                                );
                                                                setFieldValue(
                                                                    'source_of_wealth',
                                                                    updated_values.join(';'),
                                                                    true
                                                                );
                                                                return;
                                                            }
                                                            // Check if we can add more (max 2)
                                                            if (selected_values.length < 2) {
                                                                // Add the value to the string
                                                                const updated_values = [
                                                                    ...selected_values,
                                                                    checkbox_value,
                                                                ];
                                                                setFieldValue(
                                                                    'source_of_wealth',
                                                                    updated_values.join(';'),
                                                                    true
                                                                );
                                                            }
                                                        };

                                                        return (
                                                            <>
                                                                {getSourceOfWealthList({ financial_questions }).map(
                                                                    item => {
                                                                        // Split by semicolon only
                                                                        const selected_values = current_value
                                                                            ? current_value.split(';').filter(Boolean)
                                                                            : [];
                                                                        const is_checked = selected_values.includes(
                                                                            item.text
                                                                        );
                                                                        const current_count = selected_values.length;
                                                                        const is_disabled =
                                                                            !is_checked && current_count >= 2;

                                                                        return (
                                                                            <div
                                                                                key={item.text}
                                                                                className='complete-user-profile-modal__bottom-margin'
                                                                            >
                                                                                <Checkbox
                                                                                    name={`source_of_wealth_${item.value}`}
                                                                                    label={item.text}
                                                                                    defaultChecked={is_checked}
                                                                                    onChange={() =>
                                                                                        handleCheckboxChange(item.text)
                                                                                    }
                                                                                    disabled={is_disabled}
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
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
                                                disabled={isSubmitting || !isValid || !isCurrentStepValid(values)}
                                                is_loading={isSubmitting}
                                                className='complete-user-profile-modal__submit-button'
                                            />
                                        </Modal.Footer>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </ThemedScrollbars>
                )}
            </AutoHeightWrapper>
        );
    }
);

export default CompleteFinancialAssessment;
