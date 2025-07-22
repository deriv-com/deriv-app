import dayjs from 'dayjs';
import * as Yup from 'yup';

import { localize } from '@deriv-com/translations';
import { ValidationConstants } from '@deriv-com/utils';

import { TEmployeeDetailsTinValidationConfig } from '../Types';

const { taxIdentificationNumber, address, addressCity, postalCode, phoneNumber, name, postalOfficeBoxNumber } =
    ValidationConstants.patterns;
const { addressPermittedSpecialCharacters } = ValidationConstants.messagesHints;

// Add PO Box pattern + other variations
const additionalPOBoxPatterns = new RegExp(
    [
        // English variations
        '\\b(?:p\\s*\\.?\\s*o\\s*\\.?|post\\s*office)\\s*box\\b',
        '\\bpo\\s*box\\b',
        '\\bpbox\\b',
        '\\bpbag\\b',
        '\\bprivate\\s*bag\\b',
        '\\bpost\\s*box\\b',
        '\\bpostal\\s*box\\b',

        // Spanish variations
        '\\bapartado\\s*postal\\b',
        '\\bcasilla\\s*postal\\b',
        '\\bcasilla\\s*de\\s*correo\\b',

        // Portuguese variations
        '\\bcaixa\\s*postal\\b',
        '\\bcaixa\\s*de\\s*correio\\b',
        '\\bcx\\s*postal\\b',

        // French variations
        '\\bbo[iî]te\\s*postale\\b',
        '\\bb\\s*\\.?\\s*p\\.?\\b',

        // German variations
        '\\bpostfach\\b',

        // Italian variations
        '\\bcasella\\s*postale\\b',
        '\\bc\\s*\\.?\\s*p\\.?\\b',

        // Dutch variations
        '\\bpostbus\\b',

        // Russian variations (no word boundaries for Cyrillic)
        'абонентский\\s*ящик',
        'а\\s*\\/?\\s*я',

        // Polish variations
        '\\bskrytka\\s*pocztowa\\b',

        // Swedish variations
        '\\bpostbox\\b',

        // Japanese variations (no word boundaries for CJK)
        '私書箱',

        // Chinese variations (no word boundaries for CJK)
        '邮政信箱',
    ].join('|'),
    'iu'
);

type TINDepdendents = {
    is_mf?: boolean;
    is_real?: boolean;
    tin_skipped?: boolean;
    /**
     * This flag indicates that tin was skipped before and was set by BE
     */
    is_tin_auto_set?: boolean;
    is_employment_status_tin_mandatory?: boolean;
    is_required_for_tax_residence?: boolean;
};

Yup.addMethod(Yup.string, 'validatePhoneNumberLength', function (message, isCountryCodeDropdownEnabled) {
    return this.test('is-valid-phone-number-length', message || localize('You should enter 9-20 numbers.'), value => {
        if (typeof value === 'string') {
            // Remove the leading '+' symbol before validation
            const phoneNumber = value.startsWith('+') ? value.slice(1) : value;
            return isCountryCodeDropdownEnabled ? /^[0-9]{5,15}$/.test(phoneNumber) : /^[0-9]{9,20}$/.test(phoneNumber);
        }
        return false;
    });
});

const tempPhoneNumberValidation = /^[0-9]{5,15}$/;

const makeTinOptional = ({
    is_mf,
    is_real,
    tin_skipped,
    is_tin_auto_set,
    is_employment_status_tin_mandatory,
    is_required_for_tax_residence,
}: TINDepdendents) => {
    const check_if_tin_skipped = tin_skipped && !is_tin_auto_set;
    if (is_real) {
        // Students and unemployed are not required to provide TIN to have a regulated MT5 jurisdiction
        if (is_tin_auto_set && !(is_employment_status_tin_mandatory && is_required_for_tax_residence)) {
            return true;
        }
        return check_if_tin_skipped || !(is_employment_status_tin_mandatory && is_required_for_tax_residence);
    }
    // Check For Virtual account
    if (is_mf) {
        return check_if_tin_skipped;
    }
    return true;
};

export const getEmploymentAndTaxValidationSchema = ({
    tin_config,
    is_mf = false,
    is_real = false,
    is_tin_auto_set = false,
    is_duplicate_account = false,
    is_employment_status_tin_mandatory = false,
    immutable_fields,
}: TEmployeeDetailsTinValidationConfig) => {
    return Yup.object({
        employment_status: Yup.string().when([], {
            is: () => !immutable_fields?.includes('employment_status'),
            then: schema =>
                schema.when('is_employment_status_tin_mandatory', {
                    is: () => is_employment_status_tin_mandatory,
                    then: Yup.string().required(localize('Employment status is required.')),
                    otherwise: Yup.string().notRequired(),
                }),
            otherwise: schema => schema.nullable().optional(),
        }),
        tax_residence: Yup.string().when([], {
            is: () => !immutable_fields?.includes('tax_residence'),
            then: schema =>
                schema.when('is_mf', {
                    is: () => is_mf,
                    then: Yup.string().required(localize('Tax residence is required.')),
                    otherwise: Yup.string().notRequired(),
                }),
            otherwise: schema => schema.nullable().optional(),
        }),
        tin_skipped: Yup.number().when([], {
            is: () => !immutable_fields?.includes('tin_skipped'),
            then: schema => schema.oneOf([0, 1]).default(0),
            otherwise: schema => schema.nullable().optional(),
        }),
        tax_identification_confirm: Yup.bool().when([], {
            is: () => !immutable_fields?.includes('tax_identification_confirm'),
            then: schema =>
                schema.when(['tax_identification_number', 'tax_residence', 'tin_skipped'], {
                    is: (tax_identification_number: string, tax_residence: string, tin_skipped: boolean) =>
                        tax_identification_number && tax_residence && !tin_skipped && !is_duplicate_account,
                    then: Yup.bool().required().oneOf([true]),
                    otherwise: Yup.bool().notRequired(),
                }),
            otherwise: schema => schema.nullable().optional(),
        }),
        tax_identification_number: Yup.string().when([], {
            is: () => !immutable_fields?.includes('tax_identification_number'),
            then: schema =>
                schema
                    .when(['tin_skipped'], {
                        is: (tin_skipped: boolean) =>
                            makeTinOptional({
                                is_mf,
                                is_real,
                                tin_skipped,
                                is_tin_auto_set,
                                is_employment_status_tin_mandatory,
                                is_required_for_tax_residence: Boolean(tin_config?.is_tin_mandatory),
                            }),
                        then: Yup.string().notRequired(),
                        otherwise: Yup.string().required(localize('Tax identification number is required.')),
                    })
                    .max(25, localize("Tax identification number can't be longer than 25 characters."))
                    .matches(taxIdentificationNumber, {
                        excludeEmptyString: true,
                        message: localize(
                            'Only letters, numbers, space, hyphen, period, and forward slash are allowed.'
                        ),
                    })
                    .test({
                        name: 'validate-tin',
                        test: (value, context) => {
                            const { tax_residence } = context.parent;
                            if (value && !tax_residence) {
                                return context.createError({ message: localize('Please fill in tax residence.') });
                            }

                            if (
                                value &&
                                tin_config?.tin_format?.length &&
                                !tin_config?.tin_format?.some(tax_regex => new RegExp(tax_regex).test(value as string))
                            ) {
                                return context.createError({
                                    message: localize('Tax identification number is not properly formatted.'),
                                });
                            }

                            if (
                                value &&
                                tin_config?.invalid_patterns?.length &&
                                tin_config?.invalid_patterns?.some(invalid_pattern =>
                                    new RegExp(invalid_pattern).test(value as string)
                                )
                            ) {
                                return context.createError({
                                    message: localize('Tax identification number is not properly formatted.'),
                                });
                            }
                            return true;
                        },
                    }),
            otherwise: schema => schema.nullable().optional(),
        }),
    });
};

export const getAddressDetailValidationSchema = (is_svg: boolean, immutable_fields?: string[]) =>
    Yup.object({
        address_city: Yup.string().when([], {
            is: () => !immutable_fields?.includes('address_city'),
            then: schema =>
                schema
                    .required(localize('City is required'))
                    .max(99, localize('Only 99 characters, please.'))
                    .matches(addressCity, localize('Only letters, periods, hyphens, apostrophes, and spaces, please.')),
            otherwise: schema => schema.nullable().optional(),
        }),
        address_line_1: Yup.string().when([], {
            is: () => !immutable_fields?.includes('address_line_1'),
            then: schema => {
                let validationSchema = schema
                    .required(localize('First line of address is required'))
                    .max(70, localize('Only 70 characters, please.'))
                    .matches(
                        address,
                        `${localize('Use only the following special characters:')} ${addressPermittedSpecialCharacters}`
                    );

                if (!is_svg) {
                    validationSchema = validationSchema.test(
                        'po_box',
                        localize('P.O. Box is not accepted in address'),
                        value => !postalOfficeBoxNumber.test(value ?? '') && !additionalPOBoxPatterns.test(value ?? '')
                    );
                }

                return validationSchema;
            },
            otherwise: schema => schema.nullable().optional(),
        }),
        address_line_2: Yup.string().when([], {
            is: () => !immutable_fields?.includes('address_line_2'),
            then: schema => {
                let validationSchema = schema
                    .max(70, localize('Only 70 characters, please.'))
                    .matches(
                        address,
                        `${localize('Use only the following special characters:')} ${addressPermittedSpecialCharacters}`
                    );

                if (!is_svg) {
                    validationSchema = validationSchema.test(
                        'po_box',
                        localize('P.O. Box is not accepted in address'),
                        value => !postalOfficeBoxNumber.test(value ?? '') && !additionalPOBoxPatterns.test(value ?? '')
                    );
                }

                return validationSchema;
            },
            otherwise: schema => schema.nullable().optional(),
        }),
        address_postcode: Yup.string().when([], {
            is: () => !immutable_fields?.includes('address_postcode'),
            then: schema =>
                schema
                    .max(20, localize('Please enter a postal/ZIP code under 20 characters.'))
                    .matches(postalCode, localize('Only letters, numbers, space and hyphen are allowed.')),
            otherwise: schema => schema.nullable().optional(),
        }),

        address_state: Yup.string().when([], {
            is: () => !immutable_fields?.includes('address_state'),
            then: schema => schema.matches(/^[\w\s\W'.;,-]{0,99}$/, localize('State is not in a proper format')),
            otherwise: schema => schema.nullable().optional(),
        }),
    });

export const getPersonalDetailsBaseValidationSchema = (
    broker_code?: string,
    isCountryCodeDropdownEnabled?: boolean,
    immutable_fields?: string[]
) =>
    Yup.object({
        salutation: Yup.string().when([], {
            is: () => !immutable_fields?.includes('salutation'),
            then: schema =>
                schema.when([], {
                    is: () => broker_code === 'maltainvest',
                    then: schema => schema.required(localize('Salutation is required.')),
                    otherwise: schema => schema.optional(),
                }),
            otherwise: schema => schema.nullable().optional(),
        }),
        account_opening_reason: Yup.string().when([], {
            is: () => !immutable_fields?.includes('account_opening_reason'),
            then: schema => schema.required(localize('Account opening reason is required.')),
            otherwise: schema => schema.nullable().optional(),
        }),
        first_name: Yup.string().when([], {
            is: () => !immutable_fields?.includes('first_name'),
            then: schema =>
                schema
                    .required(localize('First name is required.'))
                    .max(50, localize('Enter no more than 50 characters.'))
                    .matches(name, localize('Letters, spaces, periods, hyphens, apostrophes only.')),
            otherwise: schema => schema.nullable().optional(),
        }),
        last_name: Yup.string().when([], {
            is: () => !immutable_fields?.includes('last_name'),
            then: schema =>
                schema
                    .required(localize('Last name is required.'))
                    .max(50, localize('Enter no more than 50 characters.'))
                    .matches(name, localize('Letters, spaces, periods, hyphens, apostrophes only.')),
            otherwise: schema => schema.nullable().optional(),
        }),
        date_of_birth: Yup.string().when([], {
            is: () => !immutable_fields?.includes('date_of_birth'),
            then: schema =>
                schema.required('Date of birth is required.').test({
                    name: 'validate_dob',
                    test: value => dayjs(value).isValid() && dayjs(value).isBefore(dayjs().subtract(18, 'years')),
                    message: localize('You must be 18 years old and above.'),
                }),
            otherwise: schema => schema.nullable().optional(),
        }),
        phone: Yup.string().when([], {
            is: () => !immutable_fields?.includes('phone'),
            then: schema =>
                schema
                    .required(localize('Phone is required.'))
                    // @ts-expect-error yup validation giving type error
                    .validatePhoneNumberLength(
                        isCountryCodeDropdownEnabled
                            ? localize('You should enter 5-15 numbers.')
                            : localize('You should enter 9-20 numbers.'),
                        isCountryCodeDropdownEnabled
                    )
                    .matches(
                        isCountryCodeDropdownEnabled ? tempPhoneNumberValidation : phoneNumber,
                        localize('Please enter a valid phone number (e.g. +15417541234).')
                    ),
            otherwise: schema => schema.nullable().optional(),
        }),
        ...(isCountryCodeDropdownEnabled && {
            calling_country_code: Yup.string().when([], {
                is: () => !immutable_fields?.includes('calling_country_code'),
                then: schema => schema.required(localize('Code required.')),
                otherwise: schema => schema.nullable().optional(),
            }),
        }),
        place_of_birth: Yup.string().when([], {
            is: () => !immutable_fields?.includes('place_of_birth'),
            then: schema => schema.required(localize('Place of birth is required.')),
            otherwise: schema => schema.nullable().optional(),
        }),
        citizen: Yup.string().when([], {
            is: () => !immutable_fields?.includes('citizen'),
            then: schema =>
                broker_code
                    ? schema.when([], {
                          is: () => broker_code === 'maltainvest',
                          then: schema => schema.required(localize('Citizenship is required.')),
                          otherwise: schema => schema.optional(),
                      })
                    : schema.required(localize('Citizenship is required.')),
            otherwise: schema => schema.nullable().optional(),
        }),
    });
