import * as Yup from 'yup';
import { ValidationConstants } from '@deriv-com/utils';

const { messagesHints, patterns } = ValidationConstants;
const { addressPermittedSpecialCharacters } = messagesHints;
const { address, addressCity, addressState, postalCode } = patterns;

export const addressDetailValidations = (countryCode: string, isSvg: boolean) => ({
    addressCity: Yup.string()
        .required('City is required')
        .max(99, 'Only 99 characters, please.')
        .matches(addressCity, 'Only letters, periods, hyphens, apostrophes, and spaces, please.'),
    addressLine1: Yup.string()
        .required('First line of address is required')
        .max(70, 'Only 70 characters, please.')
        .matches(address, `Use only the following special characters: ${addressPermittedSpecialCharacters}`)
        .when({
            is: () => isSvg,
            then: Yup.string().test(
                'po_box',
                'P.O. Box is not accepted in address',
                value => !/p[.\s]+o[.\s]+box/i.test(value ?? '')
            ),
        }),
    addressLine2: Yup.string()
        .max(70, 'Only 70 characters, please.')
        .matches(address, `Use only the following special characters: ${addressPermittedSpecialCharacters}`)
        .when({
            is: () => isSvg,
            then: Yup.string().test(
                'po_box',
                'P.O. Box is not accepted in address',
                value => !/p[.\s]+o[.\s]+box/i.test(value ?? '')
            ),
        }),
    addressPostcode: Yup.string()
        .max(20, 'Please enter a postal/ZIP code under 20 characters.')
        .matches(postalCode, 'Only letters, numbers, space and hyphen are allowed.'),
    addressState: Yup.string().required('State is required').matches(addressState, 'State is not in a proper format'),
});
