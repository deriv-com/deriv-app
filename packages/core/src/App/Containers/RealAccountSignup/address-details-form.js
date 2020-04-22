import { localize } from '@deriv/translations';
import AddressDetails from 'App/Containers/RealAccountSignup/address-details.jsx';
import { generateValidationFunction, getDefaultFields } from './form-validations';

const address_details_config = {
    address_line_1: {
        supported_in: ['svg', 'iom', 'malta'],
        default_value: '',
        rules: [
            ['req', localize('Address line 1 is required')],
            ['address', localize('Address is not in a proper format')],
        ],
    },
    address_line_2: {
        supported_in: ['svg', 'iom', 'malta'],
        default_value: '',
        rules: [['length', localize('Address line 2 is not in a proper format'), { min: 0, max: 30 }]],
    },
    address_city: {
        supported_in: ['svg', 'iom', 'malta'],
        default_value: '',
        rules: [
            ['req', localize('City is required')],
            [
                'regular',
                localize('City field is not in a proper format'),
                {
                    regex: /^[a-zA-Z\s\W'.-]{1,35}$/,
                },
            ],
        ],
    },
    address_state: {
        supported_in: ['svg', 'iom', 'malta'],
        default_value: '',
        rules: [
            ['req', localize('State is required')],
            [
                'regular',
                localize('State is not in a proper format'),
                {
                    regex: /^[a-zA-Z\s\W'.-]{0,35}$/,
                },
            ],
        ],
    },
    address_postcode: {
        supported_in: ['svg', 'iom', 'malta'],
        default_value: '',
        rules: [
            ['req', localize('Postal/ZIP Code is required')],
            ['postcode', localize('Postal/ZIP Code is not in a proper format')],
        ],
    },
};

export const addressDetailsConfig = ({ can_upgrade_to, residence }) => {
    return {
        header: {
            active_title: localize('Complete your address details'),
            title: localize('Address details'),
        },
        body: AddressDetails,
        form_value: getDefaultFields(can_upgrade_to, address_details_config),
        props: {
            validate: generateValidationFunction(
                can_upgrade_to,
                transformForResidence(address_details_config, residence)
            ),
        },
        passthrough: ['residence_list', 'is_fully_authenticated'],
    };
};

/**
 * Transform general rules based on residence
 *
 * @param {object} rules - Original rules
 * @param {string} residence - Client's residence
 * @return {object} rules - Transformed rules
 */
const transformForResidence = (rules, residence) => {
    // IM Clients does not need to fill out state since API states_list is empty.
    if (residence === 'im') {
        rules.address_state.rules.shift();
    }

    return rules;
};
