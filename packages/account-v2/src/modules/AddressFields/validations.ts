import * as Yup from 'yup';

const regexChecks = {
    address_details: {
        address_city: /^\p{L}[\p{L}\s'.-]{0,99}$/u,
        address_line_1: /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{1,70}$/u,
        address_line_2: /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
        address_postcode: /^[a-zA-Z0-9\s-]{0,20}$/,
        address_state: /^[\w\s'.;,-]{0,99}$/,
        non_jersey_postcode: /^(?!\s*je.*)[a-z0-9\s-]*/i,
    },
};

export const addressPermittedSpecialCharactersMessage = ". , ' : ; ( ) ° @ # / -";

export const addressDetailValidations = (countryCode: string, isSvg: boolean) => ({
    addressCity: Yup.string()
        .required('City is required')
        .max(99, 'Only 99 characters, please.')
        .matches(
            regexChecks.address_details.address_city,
            'Only letters, periods, hyphens, apostrophes, and spaces, please.'
        ),
    addressLine1: Yup.string()
        .required('First line of address is required')
        .max(70, 'Only 70 characters, please.')
        .matches(
            regexChecks.address_details.address_line_1,
            `Use only the following special characters: ${addressPermittedSpecialCharactersMessage}`
        )
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
        .matches(
            regexChecks.address_details.address_line_2,
            `Use only the following special characters: ${addressPermittedSpecialCharactersMessage}`
        )
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
        .matches(regexChecks.address_details.address_postcode, 'Only letters, numbers, space and hyphen are allowed.')
        .when({
            is: () => countryCode === 'gb',
            then: Yup.string().matches(
                regexChecks.address_details.non_jersey_postcode,
                'Our accounts and services are unavailable for the Jersey postal code.'
            ),
        }),
    addressState: Yup.string()
        .required('State is required')
        .matches(regexChecks.address_details.address_state, 'State is not in a proper format'),
});
