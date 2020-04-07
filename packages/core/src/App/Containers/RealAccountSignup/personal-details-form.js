import React from 'react';
import { toMoment } from '@deriv/trader/src/Utils/Date';
import { localize } from '@deriv/translations';
import PersonalDetails from 'App/Containers/RealAccountSignup/personal-details.jsx';
import { generateValidationFunction, getDefaultFields } from './form-validations';

const personal_details_config = {
    account_opening_reason: {
        supported_in: ['iom'],
        default_value: '',
        rules: [['req', localize('Account opening reason is required')]],
    },
    salutation: {
        supported_in: ['iom'],
        default_value: '',
        rules: [['req', localize('Salutation is required')]],
    },
    first_name: {
        supported_in: ['svg', 'iom'],
        default_value: '',
        rules: [
            ['req', localize('First Name is required')],
            ['length', localize('First name should be between 2 and 30 characters.'), { min: 2, max: 30 }],
        ],
    },
    last_name: {
        supported_in: ['svg', 'iom'],
        default_value: '',
        rules: [
            ['req', localize('Last Name is required')],
            ['length', localize('Last name should be between 2 and 30 characters.'), { min: 2, max: 30 }],
        ],
    },
    date_of_birth: {
        supported_in: ['svg', 'iom'],
        default_value: '',
        rules: [
            ['req', localize('Date of birth is required')],
            [
                v => toMoment(v).isValid() && toMoment(v).isBefore(toMoment().subtract(18, 'years')),
                localize('Date of birth is not in a proper format'),
            ],
        ],
    },
    place_of_birth: {
        supported_in: ['iom'],
        default_value: '',
        rules: [['req', localize('Place of birth is required')]],
    },
    citizen: {
        supported_in: ['iom'],
        default_value: '',
        rules: [['req', localize('Citizenship is required')]],
    },
    phone: {
        supported_in: ['svg', 'iom'],
        default_value: '',
        rules: [
            ['req', localize('Phone is required')],
            ['phone', localize('Phone is not in a correct format.')],
        ],
    },
};

export const personalDetailsConfig = ({ can_upgrade_to }) => {
    return {
        header: {
            active_title: localize('Complete your personal details'),
            title: localize('Personal details'),
        },
        body: PersonalDetails,
        form_value: getDefaultFields(can_upgrade_to, personal_details_config),
        props: {
            validate: generateValidationFunction(can_upgrade_to, personal_details_config),
            account_opening_reason_list: [localize('Income earning'), localize('Speculative'), localize('Hedging')],
            salutation_list: [localize('Mr'), localize('Ms'), localize('Mrs'), localize('Miss')],
        },
        passthrough: ['residence_list', 'is_fully_authenticated'],
    };
};
