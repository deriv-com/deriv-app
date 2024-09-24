import { localize } from '@deriv-com/translations';
import * as Yup from 'yup';
import { ValidationConstants } from '@deriv-com/utils';
import dayjs from 'dayjs';
import { TinValidations } from '@deriv/api/types';

const {
    taxIdentificationNumber,
    address,
    addressCity,
    addressState,
    postalCode,
    phoneNumber,
    name,
    postalOfficeBoxNumber,
} = ValidationConstants.patterns;
const { addressPermittedSpecialCharacters } = ValidationConstants.messagesHints;

type TINDepdendents = {
    is_mf?: boolean;
    is_real?: boolean;
    tin_skipped?: boolean;
};

const makeTinOptional = (
    tin_config: TinValidations,
    employment_status: string,
    { is_mf, is_real, tin_skipped }: TINDepdendents
) => {
    const should_not_bypass_tin = !tin_config?.tin_employment_status_bypass?.includes(employment_status);
    return tin_skipped || !is_mf || !(is_real && should_not_bypass_tin);
};

export const getEmploymentAndTaxValidationSchema = (tin_config: TinValidations, is_mf = false, is_real = false) => {
    return Yup.object({
        employment_status: Yup.string().required(localize('Employment status is required.')),
        tax_residence: Yup.string().when('is_mf', {
            is: () => is_mf,
            then: Yup.string().required(localize('Tax residence is required.')),
            otherwise: Yup.string().notRequired(),
        }),
        tin_skipped: Yup.number().oneOf([0, 1]).default(0),
        tax_identification_confirm: Yup.bool().when(['tax_identification_number', 'tax_residence', 'tin_skipped'], {
            is: (tax_identification_number: string, tax_residence: string, tin_skipped: boolean) =>
                tax_identification_number && tax_residence && !tin_skipped,
            then: Yup.bool().required().oneOf([true]),
            otherwise: Yup.bool().notRequired(),
        }),
        tax_identification_number: Yup.string()
            .when(['tin_skipped', 'is_mf', 'is_real', 'employment_status'], {
                is: (tin_skipped: boolean, employment_status: string) =>
                    makeTinOptional(tin_config, employment_status, { is_mf, is_real, tin_skipped }),
                then: Yup.string().notRequired(),
                otherwise: Yup.string().required(localize('Tax identification number is required.')),
            })
            .max(25, localize("Tax identification number can't be longer than 25 characters."))
            .matches(taxIdentificationNumber, {
                excludeEmptyString: true,
                message: localize('Only letters, numbers, space, hyphen, period, and forward slash are allowed.'),
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
    });
};

export const getAddressDetailValidationSchema = (is_svg: boolean) =>
    Yup.object({
        address_city: Yup.string()
            .required(localize('City is required'))
            .max(99, localize('Only 99 characters, please.'))
            .matches(addressCity, localize('Only letters, periods, hyphens, apostrophes, and spaces, please.')),
        address_line_1: Yup.string()
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
        address_line_2: Yup.string()
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
        address_postcode: Yup.string()
            .max(20, localize('Please enter a postal/ZIP code under 20 characters.'))
            .matches(postalCode, localize('Only letters, numbers, space and hyphen are allowed.')),
        address_state: Yup.string().matches(addressState, localize('State is not in a proper format')),
    });

export const getPersonalDetailsBaseValidationSchema = (broker_code?: string) =>
    Yup.object({
        salutation: Yup.string().when({
            is: () => broker_code === 'maltainvest',
            then: Yup.string().required(localize('Salutation is required.')),
        }),
        account_opening_reason: Yup.string().required(localize('Account opening reason is required.')),
        first_name: Yup.string()
            .required(localize('First name is required.'))
            .max(50, localize('Enter no more than 50 characters.'))
            .matches(name, localize('Letters, spaces, periods, hyphens, apostrophes only.')),
        last_name: Yup.string()
            .required(localize('Last name is required.'))
            .max(50, localize('Enter no more than 50 characters.'))
            .matches(name, localize('Letters, spaces, periods, hyphens, apostrophes only.')),
        date_of_birth: Yup.string()
            .required('Date of birth is required.')
            .test({
                name: 'validate_dob',
                test: value => dayjs(value).isValid() && dayjs(value).isBefore(dayjs().subtract(18, 'years')),
                message: localize('You must be 18 years old and above.'),
            }),
        phone: Yup.string()
            .required(localize('Phone is required.'))
            .min(9, localize('You should enter 9-35 numbers.'))
            .max(35, localize('You should enter 9-35 characters.'))
            .matches(phoneNumber, localize('Please enter a valid phone number (e.g. +15417541234).')),
        place_of_birth: Yup.string().required(localize('Place of birth is required.')),
        citizen: Yup.string().when({
            is: () => broker_code === 'maltainvest',
            then: Yup.string().required(localize('Citizenship is required.')),
        }),
    });
