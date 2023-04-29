import { localize } from '@deriv/translations';
import {
    generateValidationFunction,
    getDefaultFields,
    getErrorMessages,
    regex_checks,
    address_permitted_special_characters_message,
    TSchema,
} from '@deriv/shared';
import { TUpgradeInfo } from 'Types';
import { GetSettings } from '@deriv/api-types';

type TAddressDetailsConfigProps = {
    upgrade_info: TUpgradeInfo;
    real_account_signup_target: string;
    residence: string;
    account_settings: GetSettings;
};

const address_details_config: ({
    account_settings,
    is_svg,
}: {
    account_settings: GetSettings;
    is_svg: boolean;
}) => TSchema = ({ account_settings, is_svg }) => {
    const is_gb = account_settings.country_code === 'gb';
    if (!account_settings) {
        return {};
    }

    const base_case = {
        address_line_1: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_line_1 ?? '',
            rules: [
                ['req', localize('First line of address is required')],
                ['length', localize('Only {{max}} characters, please.', { max: 70 }), { max: 70 }],
                [
                    'regular',
                    localize('Use only the following special characters: {{permitted_characters}}', {
                        permitted_characters: address_permitted_special_characters_message,
                        interpolation: { escapeValue: false },
                    }),
                    {
                        regex: regex_checks.address_details.address_line_1,
                    },
                ],
                ['po_box', getErrorMessages().po_box()],
            ].filter(x => (is_svg ? x.indexOf('po_box') !== 0 : x)),
        },
        address_line_2: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_line_2 ?? '',
            rules: [
                ['length', localize('Only {{max}} characters, please.', { max: 70 }), { max: 70 }],
                [
                    'regular',
                    localize('Use only the following special characters: {{permitted_characters}}', {
                        permitted_characters: address_permitted_special_characters_message,
                        interpolation: { escapeValue: false },
                    }),
                    {
                        regex: regex_checks.address_details.address_line_2,
                    },
                ],
                ['po_box', getErrorMessages().po_box()],
            ].filter(x => (is_svg ? x.indexOf('po_box') !== 0 : x)),
        },
        address_city: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_city ?? '',
            rules: [
                ['req', localize('City is required')],
                ['length', localize('Only {{max}} characters, please.', { max: 99 }), { max: 99 }],
                [
                    'regular',
                    localize('Only letters, periods, hyphens, apostrophes, and spaces, please.'),
                    {
                        regex: regex_checks.address_details.address_city,
                    },
                ],
            ],
        },
        address_state: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_state ?? '',
            rules: [
                ['req', localize('State is required')],
                [
                    'regular',
                    localize('State is not in a proper format'),
                    {
                        regex: regex_checks.address_details.address_state,
                    },
                ],
            ],
        },
        address_postcode: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_postcode ?? '',
            rules: [
                [
                    'length',
                    localize('Please enter a {{field_name}} under {{max_number}} characters.', {
                        field_name: localize('postal/ZIP code'),
                        max_number: 20,
                        interpolation: { escapeValue: false },
                    }),
                    { min: 0, max: 20 },
                ],
                [
                    'regular',
                    localize('Letters, numbers, spaces, hyphens only'),
                    {
                        regex: regex_checks.address_details.address_postcode,
                    },
                ],
            ],
        },
    };

    if (is_gb) {
        const gb_case = {
            ...base_case,
            address_postcode: {
                supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
                default_value: account_settings.address_postcode ?? '',
                rules: [
                    [
                        'length',
                        localize('Please enter a {{field_name}} under {{max_number}} characters.', {
                            field_name: localize('postal/ZIP code'),
                            max_number: 20,
                            interpolation: { escapeValue: false },
                        }),
                        { min: 0, max: 20 },
                    ],
                    [
                        'regular',
                        localize('Letters, numbers, spaces, hyphens only'),
                        {
                            regex: regex_checks.address_details.address_postcode,
                        },
                    ],
                    [
                        'regular',
                        localize('Our accounts and services are unavailable for the Jersey postal code.'),
                        {
                            regex: regex_checks.address_details.non_jersey_postcode,
                        },
                    ],
                ],
            },
        };
        return gb_case;
    }
    return base_case;
};

const addressDetailsConfig = (
    { upgrade_info, real_account_signup_target, residence, account_settings }: TAddressDetailsConfigProps,
    AddressDetails: React.Component,
    is_appstore: boolean
) => {
    const is_svg = upgrade_info?.can_upgrade_to === 'svg';
    const config = address_details_config({ account_settings, is_svg });
    const disabled_items = account_settings.immutable_fields;
    const is_mf = real_account_signup_target === 'maltainvest';

    return {
        header: {
            active_title: is_appstore ? localize('Where do you live?') : localize('Complete your address details'),
            title: is_appstore ? localize('ADDRESS') : localize('Address'),
        },
        body: AddressDetails,
        form_value: getDefaultFields(real_account_signup_target, config),
        props: {
            validate: generateValidationFunction(
                real_account_signup_target,
                transformConfig(transformForResidence(config, residence), real_account_signup_target)
            ),
            is_svg,
            disabled_items,
            is_mf,
        },
        passthrough: ['residence_list', 'is_fully_authenticated', 'has_real_account'],
        icon: 'IcDashboardAddress',
    };
};

/**
 * Transform general rules based on residence
 *
 * @param {object} rules - Original rules
 * @param {string} residence - Client's residence
 * @return {object} rules - Transformed rules
 */
const transformForResidence = (rules: TSchema, residence: string) => {
    // Isle of Man Clients do not need to fill out state since API states_list is empty.
    if (residence === 'im') {
        rules.address_state.rules?.shift();
    }
    // GB residence are required to fill in the post code.
    if (/^(im|gb)$/.test(residence)) {
        rules.address_postcode.rules?.splice(0, 0, ['req', localize('Postal/ZIP code is required')]);
    }
    return rules;
};

const transformConfig = (config: TSchema, real_account_signup_target: string) => {
    // Remove required rule for svg clients
    if (!real_account_signup_target || real_account_signup_target === 'svg') {
        config.address_state.rules?.shift();
    }

    return config;
};

export default addressDetailsConfig;
