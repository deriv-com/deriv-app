import { render, screen } from '@testing-library/react';
import React from 'react';
import { CFDRealAccountDisplay } from '../cfd-real-account-display';

describe('<CFDRealAccountDisplay />', () => {
    const dummy_standard_company = {
        address: null,
        changeable_fields: {},
        country: 'Saint Vincent and the Grenadines',
        currency_config: {},
        has_reality_check: 0,
        legal_allowed_contract_categories: {},
        legal_allowed_currencies: {},
        legal_allowed_markets: {},
        legal_default_currency: 'USD',
        name: 'Deriv (SVG) LLC',
        requirements: {},
        shortcode: 'svg',
        support_professional_client: 0,
    };

    const props = {
        has_real_account: true,
        is_accounts_switcher_on: false,
        is_eu: false,
        is_eu_country: false, // client IP address matters
        has_malta_account: false,
        has_maltainvest_account: false,
        has_cfd_account_error: false,
        is_fully_authenticated: false,
        is_pending_authentication: false,
        is_virtual: false,
        isSyntheticCardVisible: jest.fn(),
        isFinancialCardVisible: jest.fn(),
        isFinancialStpCardVisible: jest.fn(),
        landing_companies: {
            config: {
                tax_details_required: 1,
                tin_format: ['^\\d{15}$'],
                tin_format_description: '999999999999999',
            },
            dxtrade_financial_company: {
                standard: dummy_standard_company,
            },
            dxtrade_gaming_company: {
                standard: dummy_standard_company,
            },
            financial_company: dummy_standard_company,
            gaming_company: dummy_standard_company,
            id: 'id',
            minimum_age: 18,
            mt_financial_company: {
                financial: dummy_standard_company,
                financial_stp: {
                    address: ['Labuan Times Square', 'Jalan Merdeka', '87000 Federal Territory of Labuan', 'Malaysia'],
                    changeable_fields: {},
                    country: 'Malaysia',
                    currency_config: {},
                    has_reality_check: 0,
                    legal_allowed_contract_categories: {},
                    legal_allowed_currencies: {},
                    legal_allowed_markets: {},
                    legal_default_currency: 'USD',
                    name: 'Deriv (FX) Ltd',
                    requirements: {},
                    shortcode: 'labuan',
                    support_professional_client: 0,
                },
            },
            mt_gaming_company: {
                financial: dummy_standard_company,
            },
            name: 'Indonesia',
            virtual_company: 'virtual',
        },
        onSelectAccount: jest.fn(),
        openAccountTransfer: jest.fn(),
        openPasswordModal: jest.fn(),
        isAccountOfTypeDisabled: jest.fn(),
        current_list: {
            'dxtrade.demo.synthetic@synthetic': {
                account_id: 'DXD1127981',
                account_type: 'demo',
                balance: 10000,
                currency: 'USD',
                display_balance: '10000.00',
                enabled: 1,
                landing_company_short: 'svg',
                login: '9562965',
                market_type: 'synthetic',
                platform: 'dxtrade',
                display_login: 'DXD1127981',
            },
            'mt5.demo.synthetic@p01_ts02': {
                account_type: 'demo',
                balance: 10000,
                country: 'id',
                currency: 'USD',
                display_balance: '10000.00',
                email: 'maryia+146@deriv.com',
                group: 'demo\\p01_ts02\\synthetic\\svg_std_usd',
                landing_company_short: 'svg',
                leverage: 500,
                login: 'MTD20774393',
                market_type: 'synthetic',
                name: 'Marghfdg Stgfdhg',
                server: 'p01_ts02',
                server_info: {
                    environment: 'Deriv-Demo',
                    geolocation: {
                        group: 'all',
                        location: 'N. Virginia',
                        region: 'US East',
                        sequence: 1,
                    },
                    id: 'p01_ts02',
                },
                sub_account_type: 'financial',
                display_login: '20774393',
            },
        },
        has_cfd_account: false,
        openPasswordManager: jest.fn(),
        account_settings: {
            account_opening_reason: 'Income Earning',
            address_city: 'Jakarta',
            address_line_1: 'test',
            address_line_2: 'test',
            address_postcode: '11111',
            address_state: 'BA',
            allow_copiers: 0,
            citizen: 'id',
            client_tnc_status: 'Version 4.2.0 2020-08-07',
            country: 'Indonesia',
            country_code: 'id',
            date_of_birth: -178416000,
            email: 'maryia+146@deriv.com',
            email_consent: 1,
            feature_flag: {
                wallet: 0,
            },
            first_name: 'Maryia',
            has_secret_answer: 1,
            immutable_fields: ['residence'],
            is_authenticated_payment_agent: 0,
            last_name: 'Stgfdhg',
            non_pep_declaration: 1,
            phone: '04546575786',
            place_of_birth: null,
            preferred_language: 'EN',
            request_professional_status: 0,
            residence: 'Indonesia',
            salutation: '',
            tax_identification_number: '121241413236757',
            tax_residence: 'id',
            user_hash: '4f284ce90658a122e8d1cdafaf34564a7c4510f3fd73486029671fa62c46ccb6',
        },
        openAccountNeededModal: jest.fn(),
        platform: 'mt5',
        standpoint: {
            financial_company: 'svg',
            gaming_company: 'svg',
            iom: false,
            malta: false,
            maltainvest: false,
            svg: true,
        },
        is_logged_in: true,
        toggleAccountsDialog: jest.fn(),
        toggleShouldShowRealAccountsList: jest.fn(),
        can_have_more_real_synthetic_mt5: false,
        residence: 'id',
        residence_list: [
            {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {},
                            has_visual_sample: 0,
                            is_country_supported: 0,
                        },
                        onfido: {
                            documents_supported: {
                                driving_licence: {
                                    display_name: 'Driving Licence',
                                },
                                national_identity_card: {
                                    display_name: 'National Identity Card',
                                },
                                passport: {
                                    display_name: 'Passport',
                                },
                            },
                            is_country_supported: 1,
                        },
                    },
                },
                phone_idd: '62',
                text: 'Indonesia',
                tin_format: ['^\\d{15}$'],
                value: 'id',
            },
            {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {},
                            has_visual_sample: 0,
                            is_country_supported: 0,
                        },
                        onfido: {
                            documents_supported: {},
                            is_country_supported: 0,
                        },
                    },
                },
                phone_idd: '35818',
                text: 'Aland Islands',
                value: 'ax',
            },
        ],
    };

    it('should render properly', () => {
        render(<CFDRealAccountDisplay {...props} />);

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
    });
});
