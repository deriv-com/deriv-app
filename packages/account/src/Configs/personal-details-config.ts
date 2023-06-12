import {
    TSchema,
    generateValidationFunction,
    getDefaultFields,
    getErrorMessages,
    toMoment,
    validLength,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { shouldShowIdentityInformation } from 'Helpers/utils';
import { TResidenseList, TUpgradeInfo } from 'Types';
import { GetAccountStatus, GetSettings } from '@deriv/api-types';

type TPersonalDetailsConfig = {
    upgrade_info?: TUpgradeInfo;
    real_account_signup_target: string;
    residence_list: TResidenseList[];
    account_settings: GetSettings & {
        document_type: string;
        document_number: string;
    };
    is_appstore?: boolean;
    residence: string;
    account_status: GetAccountStatus;
};

const personal_details_config = ({
    residence_list,
    account_settings,
    is_appstore,
    real_account_signup_target,
}: TPersonalDetailsConfig) => {
    if (!residence_list || !account_settings) {
        return {};
    }

    // minimum characters required is 9 numbers (excluding +- signs or space)
    const min_phone_number = 9;
    const max_phone_number = 35;

    const config = {
        account_opening_reason: {
            supported_in: ['iom', 'malta', 'maltainvest'],
            default_value: account_settings.account_opening_reason ?? '',
            rules: [['req', localize('Account opening reason is required.')]],
        },
        salutation: {
            supported_in: ['iom', 'malta', 'maltainvest'],
            default_value: account_settings.salutation ?? '',
            rules: [['req', localize('Salutation is required.')]],
        },
        first_name: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.first_name ?? '',
            rules: [
                ['req', localize('First name is required.')],
                ['length', localize('First name should be between 2 and 50 characters.'), { min: 2, max: 50 }],
                ['name', getErrorMessages().name()],
            ],
        },
        last_name: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.last_name ?? '',
            rules: [
                ['req', localize('Last name is required.')],
                ['length', localize('Last name should be between 2 and 50 characters.'), { min: 2, max: 50 }],
                ['name', getErrorMessages().name()],
            ],
        },
        date_of_birth: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.date_of_birth
                ? toMoment(account_settings.date_of_birth).format('YYYY-MM-DD')
                : '',
            rules: [
                ['req', localize('Date of birth is required.')],
                [
                    (v: string) => toMoment(v).isValid() && toMoment(v).isBefore(toMoment().subtract(18, 'years')),
                    localize('You must be 18 years old and above.'),
                ],
            ],
        },
        place_of_birth: {
            supported_in: ['maltainvest', 'iom', 'malta'],
            default_value: account_settings.place_of_birth
                ? residence_list.find(item => item.value === account_settings.place_of_birth)?.text
                : '',
            rules: [['req', localize('Place of birth is required.')]],
        },
        citizen: {
            supported_in: ['iom', 'malta', 'maltainvest'],
            default_value: account_settings.citizen
                ? residence_list.find(item => item.value === account_settings.citizen)?.text
                : '',
            rules: [['req', localize('Citizenship is required')]],
        },
        phone: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.phone ?? '',
            rules: [
                ['req', localize('Phone is required.')],
                ['phone', localize('Phone is not in a proper format.')],
                [
                    (value: string) => {
                        // phone_trim uses regex that trims non-digits
                        const phone_trim = value.replace(/\D/g, '');
                        return validLength(phone_trim, { min: min_phone_number, max: max_phone_number });
                    },
                    localize('You should enter {{min}}-{{max}} numbers.', {
                        min: min_phone_number,
                        max: max_phone_number,
                    }),
                ],
            ],
        },
        tax_residence: {
            default_value:
                real_account_signup_target === 'maltainvest'
                    ? account_settings.residence
                    : residence_list.find(item => item.value === account_settings.tax_residence)?.text || '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Tax residence is required.')]],
        },
        tax_identification_number: {
            default_value: account_settings.tax_identification_number ?? '',
            supported_in: ['maltainvest'],
            rules: [
                ['req', localize('Tax Identification Number is required.')],
                [
                    'length',
                    localize("Tax Identification Number can't be longer than 25 characters."),
                    { min: 0, max: 25 },
                ],
                [
                    'regular',
                    localize('Letters, numbers, spaces, periods, hyphens and forward slashes only.'),
                    {
                        regex: /^(?!^$|\s+)[A-Za-z0-9./\s-]{0,25}$/,
                    },
                ],
                [
                    (value: string, options: Record<string, unknown>, { tax_residence }: { tax_residence: string }) => {
                        return !!tax_residence;
                    },
                    localize('Please fill in Tax residence.'),
                ],
                [
                    (value: string, options: Record<string, unknown>, { tax_residence }: { tax_residence: string }) => {
                        const from_list = residence_list.filter(res => res.text === tax_residence && res.tin_format);
                        const tax_regex = from_list[0]?.tin_format?.[0];
                        return tax_regex ? new RegExp(tax_regex).test(value) : true;
                    },
                    [
                        'warn',
                        localize(
                            'This Tax Identification Number (TIN) is invalid. You may continue with account creation, but to facilitate future payment processes, valid tax information will be required.'
                        ),
                    ],
                ],
            ],
        },
        employment_status: {
            default_value: account_settings.employment_status ?? '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Employment status is required.')]],
        },
        tax_identification_confirm: {
            default_value: false,
            supported_in: ['maltainvest'],
            rules: [['confirm', localize('Please confirm your tax information.')]],
        },
        document_type: {
            default_value: account_settings.document_type ?? {
                id: '',
                text: '',
                value: '',
                example_format: '',
                sample_image: '',
            },
            supported_in: ['svg'],
            rules: [],
        },
        document_number: {
            default_value: account_settings.document_number ?? '',
            supported_in: ['svg'],
            rules: [],
        },
    };

    const getConfig = () => {
        if (is_appstore) {
            const allowed_fields = ['first_name', 'last_name', 'date_of_birth', 'phone'];
            return Object.keys(config).reduce((new_config, key) => {
                if (allowed_fields.includes(key)) {
                    new_config[key] = config[key];
                }
                return new_config;
            }, {});
        }
        return config;
    };

    return [getConfig()];
};

const personalDetailsConfig = <T>(
    {
        upgrade_info,
        real_account_signup_target,
        residence_list,
        account_settings,
        account_status,
        residence,
    }: TPersonalDetailsConfig,
    PersonalDetails: T,
    is_appstore = false
) => {
    const [config] = personal_details_config({
        residence_list,
        account_settings,
        is_appstore,
        real_account_signup_target,
        residence,
        account_status,
    });
    const disabled_items = account_settings.immutable_fields;
    return {
        header: {
            active_title: is_appstore ? localize('A few personal details') : localize('Complete your personal details'),
            title: is_appstore ? localize('PERSONAL') : localize('Personal details'),
        },
        body: PersonalDetails,
        form_value: getDefaultFields(real_account_signup_target, config),
        props: {
            validate: generateValidationFunction(
                real_account_signup_target,
                transformConfig(config, {
                    real_account_signup_target,
                    residence_list,
                    account_settings,
                    account_status,
                    residence,
                })
            ),
            is_svg: upgrade_info?.can_upgrade_to === 'svg',
            is_mf: real_account_signup_target === 'maltainvest',
            account_opening_reason_list: [
                {
                    text: localize('Hedging'),
                    value: 'Hedging',
                },
                {
                    text: localize('Income Earning'),
                    value: 'Income Earning',
                },
                {
                    text: localize('Speculative'),
                    value: 'Speculative',
                },
            ],
            salutation_list: [
                {
                    label: localize('Mr'),
                    value: 'Mr',
                },

                {
                    label: localize('Ms'),
                    value: 'Ms',
                },
            ],
            disabled_items,
            account_status,
            residence,
            account_settings,
            real_account_signup_target,
        },
        passthrough: ['residence_list', 'is_fully_authenticated', 'has_real_account'],
        icon: 'IcDashboardPersonalDetails',
    };
};

const transformConfig = (
    config: TSchema,
    { real_account_signup_target, residence_list, account_settings, account_status, residence }: TPersonalDetailsConfig
) => {
    // Remove required rule for malta and iom
    if (['malta', 'iom'].includes(real_account_signup_target) && config.tax_residence) {
        config?.tax_residence?.rules?.shift();
    }
    // Remove IDV for non supporting SVG countries
    if (
        !shouldShowIdentityInformation({
            account_status,
            account_settings,
            residence,
            residence_list,
            real_account_signup_target,
        })
    ) {
        delete config.document_type;
        delete config.document_number;
    }
    return config;
};

export default personalDetailsConfig;
