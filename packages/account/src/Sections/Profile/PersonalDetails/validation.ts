import { localize } from '@deriv/translations';
import * as Yup from 'yup';
import { address_permitted_special_characters_message } from '@deriv/shared';

export const PersonalDetailSchema = Yup.object().shape({
    first_name: Yup.string()
        .required(localize('First name is required.'))
        .min(2, localize('You should enter 2-50 characters.'))
        .max(50, localize('You should enter 2-50 characters.'))
        .matches(/^(?!.*\s{2,})[\p{L}\s'.-]{2,50}$/u, localize('Letters, spaces, periods, hyphens, apostrophes only.')),
    last_name: Yup.string()
        .required(localize('Last name is required.'))
        .min(2, localize('You should enter 2-50 characters.'))
        .max(50, localize('You should enter 2-50 characters.'))
        .matches(/^(?!.*\s{2,})[\p{L}\s'.-]{2,50}$/u, localize('Letters, spaces, periods, hyphens, apostrophes only.')),
    phone: Yup.string()
        .required(localize('Phone is required.'))
        .min(9, localize('You should enter 9-35 numbers.'))
        .max(35, localize('You should enter 9-35 characters.'))
        .matches(/^\+?([0-9-]+\s)*[0-9-]+$/, localize('Please enter a valid phone number (e.g. +15417541234).')),
    address_line_1: Yup.string()
        .trim()
        .required(localize('First line of address is required.'))
        .max(70, localize('Should be less than 70.'))
        .matches(
            /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
            localize('Use only the following special characters: {{permitted_characters}}', {
                permitted_characters: address_permitted_special_characters_message,
                interpolation: { escapeValue: false },
            })
        ),
    address_line_2: Yup.string()
        .trim()
        .max(70, localize('Should be less than 70.'))
        .matches(
            /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
            localize('Use only the following special characters: {{permitted_characters}}', {
                permitted_characters: address_permitted_special_characters_message,
                interpolation: { escapeValue: false },
            })
        ),
    tax_identification_number: Yup.string()
        .max(25, localize("Tax Identification Number can't be longer than 25 characters."))
        .matches(
            /^(?!^$|\s+)[A-Za-z0-9./\s-]{0,25}$/,
            localize('Only letters, numbers, space, hyphen, period, and forward slash are allowed.')
        )
        .matches(
            /^[a-zA-Z0-9].*$/,
            localize('Should start with letter or number and may contain a hyphen, period and slash.')
        ),
    address_city: Yup.string()
        .required(localize('Town/City is required.'))
        .matches(
            /^[A-Za-z]+([a-zA-Z.' -])*[a-zA-Z.' -]+$/,
            localize('Only letters, space, hyphen, period, and apostrophe are allowed.')
        ),
    tax_residence: Yup.string().required(localize('Tax residence is required.')),
    employment_status: Yup.string().required(localize('Employment status is required.')),
    citizen: Yup.string().required(localize('Citizen is required.')),
});
