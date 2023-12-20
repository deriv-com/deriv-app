import { localize } from '@deriv/translations';

export const getAddressDetailsFields = () => ({
    address_line_1: localize('First line of address'),
    address_line_2: localize('Second line of address'),
    address_city: localize('Town/City'),
    address_state: localize('State/Province'),
    address_postcode: localize('Postal/ZIP code'),
});

export const getPersonalDetailsFields = () => ({
    salutation: localize('Title and name'),
    first_name: localize('First name'),
    last_name: localize('Last name'),
    date_of_birth: localize('Date of birth'),
    place_of_birth: localize('Place of birth'),
    phone: localize('Phone number'),
    citizen: localize('Citizenship'),
    residence: localize('Country of residence'),
    tax_identification_number: localize('Tax identification number'),
    tax_residence: localize('Tax residence'),
    account_opening_reason: localize('Account opening reason'),
    employment_status: localize('Employment status'),
});

export const getSignupFormFields = () => ({ ...getPersonalDetailsFields(), ...getAddressDetailsFields() });
