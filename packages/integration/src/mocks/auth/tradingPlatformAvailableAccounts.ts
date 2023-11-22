import { Context } from '../../utils/mocks/mocks';

export default function mockTradingPlatformAvailableAccounts(context: Context) {
    if (
        'trading_platform_available_accounts' in context.request &&
        context.request.trading_platform_available_accounts === 1
    ) {
        context.response = {
            echo_req: {
                platform: 'mt5',
                req_id: context.req_id,
                trading_platform_available_accounts: 1,
            },
            msg_type: 'transfer_between_accounts',
            req_id: context.req_id,
            trading_platform_available_accounts: [
                {
                    linkable_landing_companies: ['svg'],
                    market_type: 'all',
                    name: 'Deriv (SVG) LLC',
                    requirements: {
                        signup: ['first_name', 'last_name', 'residence', 'date_of_birth'],
                        withdrawal: ['address_city', 'address_line_1'],
                    },
                    shortcode: 'svg',
                    sub_account_type: 'swap_free',
                },
                {
                    linkable_landing_companies: ['svg'],
                    market_type: 'financial',
                    name: 'Deriv (SVG) LLC',
                    requirements: {
                        signup: ['first_name', 'last_name', 'residence', 'date_of_birth'],
                        withdrawal: ['address_city', 'address_line_1'],
                    },
                    shortcode: 'svg',
                    sub_account_type: 'standard',
                },
                {
                    linkable_landing_companies: ['svg'],
                    market_type: 'financial',
                    name: 'Deriv (BVI) Ltd',
                    requirements: {
                        after_first_deposit: {
                            financial_assessment: ['financial_information', 'trading_experience'],
                        },
                        compliance: {
                            mt5: ['fully_authenticated', 'expiration_check'],
                            tax_information: ['tax_residence', 'tax_identification_number'],
                        },
                        signup: ['phone', 'citizen', 'account_opening_reason'],
                    },
                    shortcode: 'bvi',
                    sub_account_type: 'standard',
                },
                {
                    linkable_landing_companies: ['svg'],
                    market_type: 'financial',
                    name: 'Deriv (V) Ltd',
                    requirements: {
                        after_first_deposit: {
                            financial_assessment: ['financial_information'],
                        },
                        compliance: {
                            mt5: ['fully_authenticated', 'expiration_check'],
                            tax_information: ['tax_residence', 'tax_identification_number'],
                        },
                        signup: [
                            'citizen',
                            'place_of_birth',
                            'tax_residence',
                            'tax_identification_number',
                            'account_opening_reason',
                        ],
                    },
                    shortcode: 'vanuatu',
                    sub_account_type: 'standard',
                },
                {
                    linkable_landing_companies: ['svg'],
                    market_type: 'financial',
                    name: 'Deriv (FX) Ltd',
                    requirements: {
                        after_first_deposit: {
                            financial_assessment: ['financial_information', 'trading_experience'],
                        },
                        compliance: {
                            mt5: ['fully_authenticated', 'expiration_check'],
                            tax_information: ['tax_residence', 'tax_identification_number'],
                        },
                        signup: ['phone', 'citizen', 'account_opening_reason'],
                    },
                    shortcode: 'labuan',
                    sub_account_type: 'stp',
                },
                {
                    linkable_landing_companies: ['svg'],
                    market_type: 'gaming',
                    name: 'Deriv (SVG) LLC',
                    requirements: {
                        signup: ['first_name', 'last_name', 'residence', 'date_of_birth'],
                        withdrawal: ['address_city', 'address_line_1'],
                    },
                    shortcode: 'svg',
                    sub_account_type: 'standard',
                },
                {
                    linkable_landing_companies: ['svg'],
                    market_type: 'gaming',
                    name: 'Deriv (BVI) Ltd',
                    requirements: {
                        after_first_deposit: {
                            financial_assessment: ['financial_information', 'trading_experience'],
                        },
                        compliance: {
                            mt5: ['fully_authenticated', 'expiration_check'],
                            tax_information: ['tax_residence', 'tax_identification_number'],
                        },
                        signup: ['phone', 'citizen', 'account_opening_reason'],
                    },
                    shortcode: 'bvi',
                    sub_account_type: 'standard',
                },
                {
                    linkable_landing_companies: ['svg'],
                    market_type: 'gaming',
                    name: 'Deriv (V) Ltd',
                    requirements: {
                        after_first_deposit: {
                            financial_assessment: ['financial_information'],
                        },
                        compliance: {
                            mt5: ['fully_authenticated', 'expiration_check'],
                            tax_information: ['tax_residence', 'tax_identification_number'],
                        },
                        signup: [
                            'citizen',
                            'place_of_birth',
                            'tax_residence',
                            'tax_identification_number',
                            'account_opening_reason',
                        ],
                    },
                    shortcode: 'vanuatu',
                    sub_account_type: 'standard',
                },
            ],
        };
    }
}
