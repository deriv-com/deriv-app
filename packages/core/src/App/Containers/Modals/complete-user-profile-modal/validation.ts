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
