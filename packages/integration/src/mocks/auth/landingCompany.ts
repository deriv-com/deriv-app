import { Context } from '../../utils/mocks/mocks';

export default function mockLandingCompany(context: Context) {
    if ('landing_company' in context.request) {
        context.response = {
            echo_req: {
                landing_company: 'svg',
                req_id: context.req_id,
            },
            landing_company: {
                all_company: 'svg',
                config: {},
                ctrader: {
                    all: {
                        standard: 'svg',
                    },
                },
                dxtrade_all_company: {
                    standard: {
                        address: null,
                        changeable_fields: {
                            only_before_auth: [
                                'salutation',
                                'first_name',
                                'last_name',
                                'date_of_birth',
                                'citizen',
                                'account_opening_reason',
                                'tax_residence',
                                'tax_identification_number',
                            ],
                            personal_details_not_locked: [
                                'first_name',
                                'last_name',
                                'date_of_birth',
                                'citizen',
                                'place_of_birth',
                            ],
                        },
                        country: 'Saint Vincent and the Grenadines',
                        currency_config: {
                            commodities: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            cryptocurrency: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            forex: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            indices: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            synthetic_index: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.5,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.000013,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0002,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.3,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.3,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.004,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.35,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                            },
                        },
                        has_reality_check: 0,
                        legal_allowed_contract_categories: [
                            'asian',
                            'callput',
                            'callputequal',
                            'callputspread',
                            'digits',
                            'endsinout',
                            'highlowticks',
                            'lookback',
                            'multiplier',
                            'reset',
                            'runs',
                            'staysinout',
                            'touchnotouch',
                        ],
                        legal_allowed_currencies: [
                            'AUD',
                            'BTC',
                            'ETH',
                            'EUR',
                            'GBP',
                            'LTC',
                            'USD',
                            'USDC',
                            'UST',
                            'eUSDT',
                            'tUSDT',
                        ],
                        legal_allowed_markets: ['commodities', 'cryptocurrency', 'forex', 'indices', 'synthetic_index'],
                        legal_default_currency: 'USD',
                        name: 'Deriv (SVG) LLC',
                        requirements: {
                            signup: ['first_name', 'last_name', 'residence', 'date_of_birth'],
                            withdrawal: ['address_city', 'address_line_1'],
                        },
                        shortcode: 'svg',
                        support_professional_client: 0,
                        tin_not_mandatory: 0,
                    },
                },
                financial_company: {
                    address: null,
                    changeable_fields: {
                        only_before_auth: [
                            'salutation',
                            'first_name',
                            'last_name',
                            'date_of_birth',
                            'citizen',
                            'account_opening_reason',
                            'tax_residence',
                            'tax_identification_number',
                        ],
                        personal_details_not_locked: [
                            'first_name',
                            'last_name',
                            'date_of_birth',
                            'citizen',
                            'place_of_birth',
                        ],
                    },
                    country: 'Saint Vincent and the Grenadines',
                    currency_config: {
                        commodities: {
                            AUD: {
                                max_payout: 70000,
                                min_stake: 0.7,
                            },
                            BTC: {
                                max_payout: 2,
                                min_stake: 0.00002,
                            },
                            ETH: {
                                max_payout: 30,
                                min_stake: 0.0003,
                            },
                            EUR: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            GBP: {
                                max_payout: 40000,
                                min_stake: 0.4,
                            },
                            LTC: {
                                max_payout: 600,
                                min_stake: 0.006,
                            },
                            USD: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            USDC: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            UST: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            eUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            tUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                        },
                        cryptocurrency: {
                            AUD: {
                                max_payout: 70000,
                                min_stake: 0.7,
                            },
                            BTC: {
                                max_payout: 2,
                                min_stake: 0.00002,
                            },
                            ETH: {
                                max_payout: 30,
                                min_stake: 0.0003,
                            },
                            EUR: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            GBP: {
                                max_payout: 40000,
                                min_stake: 0.4,
                            },
                            LTC: {
                                max_payout: 600,
                                min_stake: 0.006,
                            },
                            USD: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            USDC: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            UST: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            eUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            tUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                        },
                        forex: {
                            AUD: {
                                max_payout: 70000,
                                min_stake: 0.7,
                            },
                            BTC: {
                                max_payout: 2,
                                min_stake: 0.00002,
                            },
                            ETH: {
                                max_payout: 30,
                                min_stake: 0.0003,
                            },
                            EUR: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            GBP: {
                                max_payout: 40000,
                                min_stake: 0.4,
                            },
                            LTC: {
                                max_payout: 600,
                                min_stake: 0.006,
                            },
                            USD: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            USDC: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            UST: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            eUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            tUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                        },
                        indices: {
                            AUD: {
                                max_payout: 70000,
                                min_stake: 0.7,
                            },
                            BTC: {
                                max_payout: 2,
                                min_stake: 0.00002,
                            },
                            ETH: {
                                max_payout: 30,
                                min_stake: 0.0003,
                            },
                            EUR: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            GBP: {
                                max_payout: 40000,
                                min_stake: 0.4,
                            },
                            LTC: {
                                max_payout: 600,
                                min_stake: 0.006,
                            },
                            USD: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            USDC: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            UST: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            eUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            tUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                        },
                        synthetic_index: {
                            AUD: {
                                max_payout: 70000,
                                min_stake: 0.5,
                            },
                            BTC: {
                                max_payout: 2,
                                min_stake: 0.000013,
                            },
                            ETH: {
                                max_payout: 30,
                                min_stake: 0.0002,
                            },
                            EUR: {
                                max_payout: 50000,
                                min_stake: 0.3,
                            },
                            GBP: {
                                max_payout: 40000,
                                min_stake: 0.3,
                            },
                            LTC: {
                                max_payout: 600,
                                min_stake: 0.004,
                            },
                            USD: {
                                max_payout: 50000,
                                min_stake: 0.35,
                            },
                            USDC: {
                                max_payout: 5000,
                                min_stake: 0.3,
                            },
                            UST: {
                                max_payout: 5000,
                                min_stake: 0.3,
                            },
                            eUSDT: {
                                max_payout: 5000,
                                min_stake: 0.3,
                            },
                            tUSDT: {
                                max_payout: 5000,
                                min_stake: 0.3,
                            },
                        },
                    },
                    has_reality_check: 0,
                    legal_allowed_contract_categories: [
                        'asian',
                        'callput',
                        'callputequal',
                        'callputspread',
                        'digits',
                        'endsinout',
                        'highlowticks',
                        'lookback',
                        'multiplier',
                        'reset',
                        'runs',
                        'staysinout',
                        'touchnotouch',
                    ],
                    legal_allowed_currencies: [
                        'AUD',
                        'BTC',
                        'ETH',
                        'EUR',
                        'GBP',
                        'LTC',
                        'USD',
                        'USDC',
                        'UST',
                        'eUSDT',
                        'tUSDT',
                    ],
                    legal_allowed_markets: ['commodities', 'cryptocurrency', 'forex', 'indices', 'synthetic_index'],
                    legal_default_currency: 'USD',
                    name: 'Deriv (SVG) LLC',
                    requirements: {
                        signup: ['first_name', 'last_name', 'residence', 'date_of_birth'],
                        withdrawal: ['address_city', 'address_line_1'],
                    },
                    shortcode: 'svg',
                    support_professional_client: 0,
                    tin_not_mandatory: 0,
                },
                gaming_company: {
                    address: null,
                    changeable_fields: {
                        only_before_auth: [
                            'salutation',
                            'first_name',
                            'last_name',
                            'date_of_birth',
                            'citizen',
                            'account_opening_reason',
                            'tax_residence',
                            'tax_identification_number',
                        ],
                        personal_details_not_locked: [
                            'first_name',
                            'last_name',
                            'date_of_birth',
                            'citizen',
                            'place_of_birth',
                        ],
                    },
                    country: 'Saint Vincent and the Grenadines',
                    currency_config: {
                        commodities: {
                            AUD: {
                                max_payout: 70000,
                                min_stake: 0.7,
                            },
                            BTC: {
                                max_payout: 2,
                                min_stake: 0.00002,
                            },
                            ETH: {
                                max_payout: 30,
                                min_stake: 0.0003,
                            },
                            EUR: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            GBP: {
                                max_payout: 40000,
                                min_stake: 0.4,
                            },
                            LTC: {
                                max_payout: 600,
                                min_stake: 0.006,
                            },
                            USD: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            USDC: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            UST: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            eUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            tUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                        },
                        cryptocurrency: {
                            AUD: {
                                max_payout: 70000,
                                min_stake: 0.7,
                            },
                            BTC: {
                                max_payout: 2,
                                min_stake: 0.00002,
                            },
                            ETH: {
                                max_payout: 30,
                                min_stake: 0.0003,
                            },
                            EUR: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            GBP: {
                                max_payout: 40000,
                                min_stake: 0.4,
                            },
                            LTC: {
                                max_payout: 600,
                                min_stake: 0.006,
                            },
                            USD: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            USDC: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            UST: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            eUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            tUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                        },
                        forex: {
                            AUD: {
                                max_payout: 70000,
                                min_stake: 0.7,
                            },
                            BTC: {
                                max_payout: 2,
                                min_stake: 0.00002,
                            },
                            ETH: {
                                max_payout: 30,
                                min_stake: 0.0003,
                            },
                            EUR: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            GBP: {
                                max_payout: 40000,
                                min_stake: 0.4,
                            },
                            LTC: {
                                max_payout: 600,
                                min_stake: 0.006,
                            },
                            USD: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            USDC: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            UST: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            eUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            tUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                        },
                        indices: {
                            AUD: {
                                max_payout: 70000,
                                min_stake: 0.7,
                            },
                            BTC: {
                                max_payout: 2,
                                min_stake: 0.00002,
                            },
                            ETH: {
                                max_payout: 30,
                                min_stake: 0.0003,
                            },
                            EUR: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            GBP: {
                                max_payout: 40000,
                                min_stake: 0.4,
                            },
                            LTC: {
                                max_payout: 600,
                                min_stake: 0.006,
                            },
                            USD: {
                                max_payout: 50000,
                                min_stake: 0.5,
                            },
                            USDC: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            UST: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            eUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                            tUSDT: {
                                max_payout: 5000,
                                min_stake: 0.5,
                            },
                        },
                        synthetic_index: {
                            AUD: {
                                max_payout: 70000,
                                min_stake: 0.5,
                            },
                            BTC: {
                                max_payout: 2,
                                min_stake: 0.000013,
                            },
                            ETH: {
                                max_payout: 30,
                                min_stake: 0.0002,
                            },
                            EUR: {
                                max_payout: 50000,
                                min_stake: 0.3,
                            },
                            GBP: {
                                max_payout: 40000,
                                min_stake: 0.3,
                            },
                            LTC: {
                                max_payout: 600,
                                min_stake: 0.004,
                            },
                            USD: {
                                max_payout: 50000,
                                min_stake: 0.35,
                            },
                            USDC: {
                                max_payout: 5000,
                                min_stake: 0.3,
                            },
                            UST: {
                                max_payout: 5000,
                                min_stake: 0.3,
                            },
                            eUSDT: {
                                max_payout: 5000,
                                min_stake: 0.3,
                            },
                            tUSDT: {
                                max_payout: 5000,
                                min_stake: 0.3,
                            },
                        },
                    },
                    has_reality_check: 0,
                    legal_allowed_contract_categories: [
                        'asian',
                        'callput',
                        'callputequal',
                        'callputspread',
                        'digits',
                        'endsinout',
                        'highlowticks',
                        'lookback',
                        'multiplier',
                        'reset',
                        'runs',
                        'staysinout',
                        'touchnotouch',
                    ],
                    legal_allowed_currencies: [
                        'AUD',
                        'BTC',
                        'ETH',
                        'EUR',
                        'GBP',
                        'LTC',
                        'USD',
                        'USDC',
                        'UST',
                        'eUSDT',
                        'tUSDT',
                    ],
                    legal_allowed_markets: ['commodities', 'cryptocurrency', 'forex', 'indices', 'synthetic_index'],
                    legal_default_currency: 'USD',
                    name: 'Deriv (SVG) LLC',
                    requirements: {
                        signup: ['first_name', 'last_name', 'residence', 'date_of_birth'],
                        withdrawal: ['address_city', 'address_line_1'],
                    },
                    shortcode: 'svg',
                    support_professional_client: 0,
                    tin_not_mandatory: 0,
                },
                id: 'th',
                minimum_age: 18,
                mt_all_company: {
                    swap_free: {
                        address: null,
                        changeable_fields: {
                            only_before_auth: [
                                'salutation',
                                'first_name',
                                'last_name',
                                'date_of_birth',
                                'citizen',
                                'account_opening_reason',
                                'tax_residence',
                                'tax_identification_number',
                            ],
                            personal_details_not_locked: [
                                'first_name',
                                'last_name',
                                'date_of_birth',
                                'citizen',
                                'place_of_birth',
                            ],
                        },
                        country: 'Saint Vincent and the Grenadines',
                        currency_config: {
                            commodities: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            cryptocurrency: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            forex: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            indices: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            synthetic_index: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.5,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.000013,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0002,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.3,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.3,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.004,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.35,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                            },
                        },
                        has_reality_check: 0,
                        legal_allowed_contract_categories: [
                            'asian',
                            'callput',
                            'callputequal',
                            'callputspread',
                            'digits',
                            'endsinout',
                            'highlowticks',
                            'lookback',
                            'multiplier',
                            'reset',
                            'runs',
                            'staysinout',
                            'touchnotouch',
                        ],
                        legal_allowed_currencies: [
                            'AUD',
                            'BTC',
                            'ETH',
                            'EUR',
                            'GBP',
                            'LTC',
                            'USD',
                            'USDC',
                            'UST',
                            'eUSDT',
                            'tUSDT',
                        ],
                        legal_allowed_markets: ['commodities', 'cryptocurrency', 'forex', 'indices', 'synthetic_index'],
                        legal_default_currency: 'USD',
                        name: 'Deriv (SVG) LLC',
                        requirements: {
                            signup: ['first_name', 'last_name', 'residence', 'date_of_birth'],
                            withdrawal: ['address_city', 'address_line_1'],
                        },
                        shortcode: 'svg',
                        support_professional_client: 0,
                        tin_not_mandatory: 0,
                    },
                },
                mt_financial_company: {
                    financial: {
                        address: null,
                        changeable_fields: {
                            only_before_auth: [
                                'salutation',
                                'first_name',
                                'last_name',
                                'date_of_birth',
                                'citizen',
                                'account_opening_reason',
                                'tax_residence',
                                'tax_identification_number',
                            ],
                            personal_details_not_locked: [
                                'first_name',
                                'last_name',
                                'date_of_birth',
                                'citizen',
                                'place_of_birth',
                            ],
                        },
                        country: 'Saint Vincent and the Grenadines',
                        currency_config: {
                            commodities: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            cryptocurrency: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            forex: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            indices: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            synthetic_index: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.5,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.000013,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0002,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.3,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.3,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.004,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.35,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                            },
                        },
                        has_reality_check: 0,
                        legal_allowed_contract_categories: [
                            'asian',
                            'callput',
                            'callputequal',
                            'callputspread',
                            'digits',
                            'endsinout',
                            'highlowticks',
                            'lookback',
                            'multiplier',
                            'reset',
                            'runs',
                            'staysinout',
                            'touchnotouch',
                        ],
                        legal_allowed_currencies: [
                            'AUD',
                            'BTC',
                            'ETH',
                            'EUR',
                            'GBP',
                            'LTC',
                            'USD',
                            'USDC',
                            'UST',
                            'eUSDT',
                            'tUSDT',
                        ],
                        legal_allowed_markets: ['commodities', 'cryptocurrency', 'forex', 'indices', 'synthetic_index'],
                        legal_default_currency: 'USD',
                        name: 'Deriv (SVG) LLC',
                        requirements: {
                            signup: ['first_name', 'last_name', 'residence', 'date_of_birth'],
                            withdrawal: ['address_city', 'address_line_1'],
                        },
                        shortcode: 'svg',
                        support_professional_client: 0,
                        tin_not_mandatory: 0,
                    },
                    financial_stp: {
                        address: [
                            'Labuan Times Square',
                            'Jalan Merdeka',
                            '87000 Federal Territory of Labuan',
                            'Malaysia',
                        ],
                        changeable_fields: {},
                        country: 'Malaysia',
                        currency_config: {
                            forex: {
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                            },
                        },
                        has_reality_check: 0,
                        legal_allowed_contract_categories: ['callput'],
                        legal_allowed_currencies: ['USD'],
                        legal_allowed_markets: [],
                        legal_default_currency: 'USD',
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
                        support_professional_client: 0,
                        tin_not_mandatory: 0,
                    },
                },
                mt_gaming_company: {
                    financial: {
                        address: null,
                        changeable_fields: {
                            only_before_auth: [
                                'salutation',
                                'first_name',
                                'last_name',
                                'date_of_birth',
                                'citizen',
                                'account_opening_reason',
                                'tax_residence',
                                'tax_identification_number',
                            ],
                            personal_details_not_locked: [
                                'first_name',
                                'last_name',
                                'date_of_birth',
                                'citizen',
                                'place_of_birth',
                            ],
                        },
                        country: 'Saint Vincent and the Grenadines',
                        currency_config: {
                            commodities: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            cryptocurrency: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            forex: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            indices: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.7,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.00002,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0003,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.4,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.006,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.5,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.5,
                                },
                            },
                            synthetic_index: {
                                AUD: {
                                    max_payout: 70000,
                                    min_stake: 0.5,
                                },
                                BTC: {
                                    max_payout: 2,
                                    min_stake: 0.000013,
                                },
                                ETH: {
                                    max_payout: 30,
                                    min_stake: 0.0002,
                                },
                                EUR: {
                                    max_payout: 50000,
                                    min_stake: 0.3,
                                },
                                GBP: {
                                    max_payout: 40000,
                                    min_stake: 0.3,
                                },
                                LTC: {
                                    max_payout: 600,
                                    min_stake: 0.004,
                                },
                                USD: {
                                    max_payout: 50000,
                                    min_stake: 0.35,
                                },
                                USDC: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                UST: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                eUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                                tUSDT: {
                                    max_payout: 5000,
                                    min_stake: 0.3,
                                },
                            },
                        },
                        has_reality_check: 0,
                        legal_allowed_contract_categories: [
                            'asian',
                            'callput',
                            'callputequal',
                            'callputspread',
                            'digits',
                            'endsinout',
                            'highlowticks',
                            'lookback',
                            'multiplier',
                            'reset',
                            'runs',
                            'staysinout',
                            'touchnotouch',
                        ],
                        legal_allowed_currencies: [
                            'AUD',
                            'BTC',
                            'ETH',
                            'EUR',
                            'GBP',
                            'LTC',
                            'USD',
                            'USDC',
                            'UST',
                            'eUSDT',
                            'tUSDT',
                        ],
                        legal_allowed_markets: ['commodities', 'cryptocurrency', 'forex', 'indices', 'synthetic_index'],
                        legal_default_currency: 'USD',
                        name: 'Deriv (SVG) LLC',
                        requirements: {
                            signup: ['first_name', 'last_name', 'residence', 'date_of_birth'],
                            withdrawal: ['address_city', 'address_line_1'],
                        },
                        shortcode: 'svg',
                        support_professional_client: 0,
                        tin_not_mandatory: 0,
                    },
                },
                name: 'Thailand',
                virtual_company: 'virtual',
            },
            msg_type: 'landing_company',
            req_id: context.req_id,
        };
    }
}
