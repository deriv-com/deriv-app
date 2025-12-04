import dayjs from 'dayjs';
import * as Yup from 'yup';

import { localize } from '@deriv/translations';
import { ValidationConstants } from '@deriv-com/utils';

const { address, addressCity, postalCode, postalOfficeBoxNumber } = ValidationConstants.patterns;
const { addressPermittedSpecialCharacters } = ValidationConstants.messagesHints;

export const ValidationSchema = (is_svg: boolean, account_settings?: Record<string, unknown>, noCurrency?: boolean) =>
    Yup.object({
        currency: Yup.string().when([], {
            is: () => noCurrency,
            then: schema => schema.required(),
            otherwise: schema => schema,
        }),
        date_of_birth: Yup.string().when([], {
            is: () => !account_settings?.date_of_birth,
            then: schema =>
                schema.required('Date of birth is required.').test({
                    name: 'validate_dob',
                    test: value => dayjs(value).isValid() && dayjs(value).isBefore(dayjs().subtract(18, 'years')),
                    message: localize('You must be 18 years old and above.'),
                }),
            otherwise: schema => schema,
        }),
        citizen: Yup.string().when([], {
            is: () => !account_settings?.citizen,
            then: schema => schema.required(localize('Citizenship is required.')),
            otherwise: schema => schema,
        }),
        address_city: Yup.string().when([], {
            is: () => !account_settings?.address_city,
            then: schema =>
                schema
                    .required(localize('City is required'))
                    .max(99, localize('Only 99 characters, please.'))
                    .matches(addressCity, localize('Only letters, periods, hyphens, apostrophes, and spaces, please.')),
            otherwise: schema => schema,
        }),
        address_line_1: Yup.string().when([], {
            is: () => !account_settings?.address_line_1,
            then: schema =>
                schema
                    .required(localize('First line of address is required'))
                    .max(70, localize('Only 70 characters, please.'))
                    .matches(
                        address,
                        `${localize('Use only the following special characters:')} ${addressPermittedSpecialCharacters}`
                    )
                    .when({
                        is: () => is_svg,
                        then: Yup.string().test(
                            'po_box',
                            localize('P.O. Box is not accepted in address'),
                            value => !postalOfficeBoxNumber.test(value ?? '')
                        ),
                    }),
            otherwise: schema => schema,
        }),
        address_line_2: Yup.string().when([], {
            is: () => !account_settings?.address_line_2,
            then: schema =>
                schema
                    .max(70, localize('Only 70 characters, please.'))
                    .matches(
                        address,
                        `${localize('Use only the following special characters:')} ${addressPermittedSpecialCharacters}`
                    )
                    .when({
                        is: () => is_svg,
                        then: Yup.string().test(
                            'po_box',
                            localize('P.O. Box is not accepted in address'),
                            value => !postalOfficeBoxNumber.test(value ?? '')
                        ),
                    }),
            otherwise: schema => schema,
        }),
        address_postcode: Yup.string().when([], {
            is: () => !account_settings?.address_postcode,
            then: schema =>
                schema
                    .max(20, localize('Please enter a postal/ZIP code under 20 characters.'))
                    .matches(postalCode, localize('Only letters, numbers, space and hyphen are allowed.')),
            otherwise: schema => schema,
        }),
        address_state: Yup.string().when([], {
            is: () => !account_settings?.address_state,
            then: schema => schema.matches(/^[\w\s\W'.;,-]{0,99}$/, localize('State is not in a proper format')),
            otherwise: schema => schema,
        }),
    });

type TFinancialInformationValidationParams = {
    current_step: number;
    isFieldDisabled: (name: string) => boolean;
    shouldShowFinancialField: (fieldName: string) => boolean;
    shouldHideByFinancialQuestions: (question_id: string, form_values: Record<string, unknown>) => boolean;
    tin_validation_config?: Record<string, unknown>;
    financial_questions?: {
        questions?: Record<
            string,
            {
                answers?: Array<{ key: string; value: string }>;
                hide_if?: string[];
                type: string;
            }
        >;
    };
};

export const FinancialInformationValidationSchema = ({
    current_step,
    isFieldDisabled,
    shouldShowFinancialField,
    shouldHideByFinancialQuestions,
    tin_validation_config,
    financial_questions,
}: TFinancialInformationValidationParams) => {
    const has_tin_config = tin_validation_config && Object.keys(tin_validation_config).length > 0;
    const tin_format_description =
        has_tin_config && 'tin_format_description' in tin_validation_config
            ? (tin_validation_config as Record<string, string>).tin_format_description
            : undefined;
    const is_tin_mandatory = has_tin_config
        ? (tin_validation_config as { is_tin_mandatory?: number | boolean })?.is_tin_mandatory
        : 0;
    // Convert to number if boolean (true = 1, false = 0)
    let is_tin_mandatory_num = 0;
    if (is_tin_mandatory === true) {
        is_tin_mandatory_num = 1;
    } else if (is_tin_mandatory === false) {
        is_tin_mandatory_num = 0;
    } else {
        is_tin_mandatory_num = is_tin_mandatory ?? 0;
    }
    const invalid_patterns = has_tin_config
        ? (tin_validation_config as { invalid_patterns?: string[] })?.invalid_patterns
        : undefined;
    const tin_format = has_tin_config ? (tin_validation_config as { tin_format?: string[] })?.tin_format : undefined;
    const tin_employment_status_bypass = has_tin_config
        ? (tin_validation_config as { tin_employment_status_bypass?: string[] })?.tin_employment_status_bypass
        : undefined;

    // Helper function to convert employment_status key to display text
    const getEmploymentStatusText = (employment_status_key: string | undefined): string => {
        if (!employment_status_key || !financial_questions?.questions?.employment_status?.answers) return '';
        const matched = financial_questions.questions.employment_status.answers.find(
            a => a.key === employment_status_key
        );
        return matched?.value ?? '';
    };

    // Helper function to check if employment_status is in bypass list
    const isEmploymentStatusBypassed = (employment_status_key: string | undefined): boolean => {
        if (!employment_status_key || !tin_employment_status_bypass?.length) return false;
        const employment_status_text = getEmploymentStatusText(employment_status_key);
        return tin_employment_status_bypass.includes(employment_status_text);
    };

    const isOccupationFreeText = financial_questions?.questions?.occupation?.type === 'free_text';

    return Yup.object().shape({
        // Step 1 fields
        employment_status: Yup.string().test('employment_status', function (value) {
            if (current_step === 1 && !isFieldDisabled('employment_status') && !value) {
                return this.createError({ message: localize('This field is required') });
            }
            return true;
        }),
        account_opening_reason: Yup.string().test('account_opening_reason', function (value) {
            if (current_step === 1 && !isFieldDisabled('account_opening_reason') && !value) {
                return this.createError({ message: localize('This field is required') });
            }
            return true;
        }),
        tax_residence: Yup.string().when(['no_tax_information'], {
            is: (no_tax_information: boolean) => !no_tax_information,
            then: schema =>
                schema.test('tax_residence', function (value) {
                    if (
                        current_step === 1 &&
                        !isFieldDisabled('tax_residence') &&
                        !this.parent.no_tax_information &&
                        !value
                    ) {
                        return this.createError({ message: localize('This field is required') });
                    }
                    return true;
                }),
            otherwise: schema => schema,
        }),
        tax_identification_number: Yup.string()
            .when(['no_tax_information', 'tax_residence', 'employment_status'], {
                is: (no_tax_information: boolean, tax_residence: string) => !no_tax_information && !!tax_residence,
                then: schema =>
                    schema.test('tax_identification_number', function (value) {
                        if (
                            current_step === 1 &&
                            !isFieldDisabled('tax_identification_number') &&
                            !this.parent.no_tax_information &&
                            this.parent.tax_residence
                        ) {
                            // New requirement: If tax_identification_confirm is false (0), require TIN regardless of employment_status
                            const is_confirm_false =
                                this.parent.tax_identification_confirm === false ||
                                this.parent.tax_identification_confirm === 0;
                            if (is_confirm_false) {
                                if (!value) {
                                    return this.createError({
                                        message: localize('This is required.'),
                                    });
                                }
                                // Continue with format validation if TIN is provided
                                // Check if employment_status is in bypass list - skip all validation if bypassed
                                if (isEmploymentStatusBypassed(this.parent.employment_status)) {
                                    return true; // Skip validation if bypassed
                                }
                            } else if (isEmploymentStatusBypassed(this.parent.employment_status)) {
                                // Check if employment_status is in bypass list - skip all validation if bypassed
                                return true; // Skip validation if bypassed
                            }

                            if (has_tin_config) {
                                // Check if TIN is mandatory (1 = mandatory, 0 = optional)
                                if (is_tin_mandatory_num === 1 && !value && !is_confirm_false) {
                                    return this.createError({
                                        message: localize('This is required.'),
                                    });
                                }
                                // If TIN is provided, validate format
                                if (value) {
                                    const tin_value = value as string;

                                    // Check maximum length (25 characters)
                                    if (tin_value.length > 25) {
                                        return this.createError({
                                            message: localize(
                                                "Tax identification number can't be longer than 25 characters."
                                            ),
                                        });
                                    }

                                    // Check allowed special characters (letters, numbers, spaces, hyphens, periods, forward slashes, apostrophes)
                                    const allowedCharactersPattern = /^[A-Za-z0-9\s\-./']+$/;
                                    if (!allowedCharactersPattern.test(tin_value)) {
                                        return this.createError({
                                            message: localize('Letters, spaces, periods, hyphens, apostrophes only.'),
                                        });
                                    }

                                    // Check invalid patterns
                                    if (invalid_patterns?.length) {
                                        const matches_invalid = invalid_patterns.some(invalid_pattern =>
                                            new RegExp(invalid_pattern).test(tin_value)
                                        );
                                        if (matches_invalid) {
                                            return this.createError({
                                                message: localize('Tax identification number format is incorrect.'),
                                            });
                                        }
                                    }

                                    // Check valid format patterns
                                    if (tin_format?.length) {
                                        const matches_valid = tin_format.some(tin_regex =>
                                            new RegExp(tin_regex).test(tin_value)
                                        );
                                        if (!matches_valid) {
                                            return this.createError({
                                                message: localize('Tax identification number format is incorrect.'),
                                            });
                                        }
                                    }
                                }
                            } else if (!value && !is_confirm_false) {
                                return this.createError({ message: localize('This is required') });
                            }
                        }
                        return true;
                    }),
                otherwise: schema => schema,
            })
            .nullable(),
        tax_identification_confirm: Yup.boolean().when(
            ['no_tax_information', 'employment_status', 'tax_identification_number'],
            {
                is: (no_tax_information: boolean) => !no_tax_information,
                then: schema =>
                    schema.test('tax_identification_confirm', function (value) {
                        if (current_step === 1 && !this.parent.no_tax_information && this.parent.tax_residence) {
                            // New requirement: If tax_identification_confirm is false (0), require it to be true
                            // regardless of employment_status bypass
                            const is_confirm_false = value === false || (typeof value === 'number' && value === 0);
                            if (is_confirm_false) {
                                return this.createError({ message: localize('This field is required') });
                            }

                            // Skip validation if employment_status is in bypass list
                            if (isEmploymentStatusBypassed(this.parent.employment_status)) {
                                return true;
                            }
                            // Require confirmation if:
                            // 1. TIN is mandatory (is_tin_mandatory === 1), OR
                            // 2. User is filling up TIN (tax_identification_number has a value)
                            const is_tin_provided = !!this.parent.tax_identification_number;
                            const should_require_confirmation = is_tin_mandatory_num === 1 || is_tin_provided;
                            if (should_require_confirmation && !value) {
                                return this.createError({ message: localize('This field is required') });
                            }
                        }
                        return true;
                    }),
                otherwise: schema => schema,
            }
        ),
        no_tax_information: Yup.boolean(),

        // Step 2 fields
        employment_industry: Yup.string().test('employment_industry', function (value) {
            const formValues = this.parent;
            if (
                current_step === 2 &&
                shouldShowFinancialField('employment_industry') &&
                !shouldHideByFinancialQuestions('employment_industry', formValues) &&
                !value
            ) {
                return this.createError({ message: localize('This field is required') });
            }
            return true;
        }),
        ...(isOccupationFreeText && {
            company: Yup.string().test('company', function (value) {
                const formValues = this.parent;
                if (
                    current_step === 2 &&
                    shouldShowFinancialField('occupation') &&
                    !shouldHideByFinancialQuestions('occupation', formValues) &&
                    !value
                ) {
                    return this.createError({ message: localize('This field is required') });
                }
                return true;
            }),
            position: Yup.string().test('position', function (value) {
                const formValues = this.parent;
                if (
                    current_step === 2 &&
                    shouldShowFinancialField('occupation') &&
                    !shouldHideByFinancialQuestions('occupation', formValues) &&
                    !value
                ) {
                    return this.createError({ message: localize('This field is required') });
                }
                return true;
            }),
        }),
        ...(!isOccupationFreeText && {
            occupation: Yup.string().test('occupation', function (value) {
                const formValues = this.parent;
                if (
                    current_step === 2 &&
                    shouldShowFinancialField('occupation') &&
                    !shouldHideByFinancialQuestions('occupation', formValues) &&
                    !value
                ) {
                    return this.createError({ message: localize('This field is required') });
                }
                return true;
            }),
        }),
        income_source: Yup.string().test('income_source', function (value) {
            if (current_step === 2 && shouldShowFinancialField('income_source') && !value) {
                return this.createError({ message: localize('This field is required') });
            }
            return true;
        }),
        net_income: Yup.string().test('net_income', function (value) {
            if (current_step === 2 && shouldShowFinancialField('net_income') && !value) {
                return this.createError({ message: localize('This field is required') });
            }
            return true;
        }),
        estimated_worth: Yup.string().test('estimated_worth', function (value) {
            if (current_step === 2 && shouldShowFinancialField('estimated_worth') && !value) {
                return this.createError({ message: localize('This field is required') });
            }
            return true;
        }),
        investment_intention: Yup.string().test('investment_intention', function (value) {
            if (current_step === 2 && shouldShowFinancialField('investment_intention') && !value) {
                return this.createError({ message: localize('This field is required') });
            }
            return true;
        }),

        // Step 3 fields
        source_of_wealth: Yup.string().test('source_of_wealth', function (value) {
            if (current_step === 3 && shouldShowFinancialField('source_of_wealth')) {
                if (!value) {
                    return this.createError({ message: localize('Please select at least one source of wealth') });
                }
                const selected_values = (value as string).split(';').filter(Boolean);
                if (selected_values.length === 0) {
                    return this.createError({ message: localize('Please select at least one source of wealth') });
                }
                if (selected_values.length > 2) {
                    return this.createError({ message: localize('Please select up to 2 sources') });
                }
            }
            return true;
        }),
    });
};
