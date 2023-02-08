import merge from 'lodash.merge';
import type { TRootStore } from '../types';

const mock = (): TRootStore => {
    return {
        client: {
            is_crypto: false,
            accounts: {
                loginid: {
                    account_type: 'trading',
                    created_at: 1674633682,
                    currency: 'USD',
                    is_disabled: 0,
                    is_virtual: 0,
                    trading: {},
                    excluded_until: 0,
                    landing_company_name: 'svg',
                },
            },
            active_account_landing_company: '',
            account_limits: {
                daily_transfers: {
                    dxtrade: {
                        allowed: false,
                        available: false,
                    },
                    internal: {
                        allowed: false,
                        available: false,
                    },
                    mt5: {
                        allowed: false,
                        available: false,
                    },
                },
            },
            account_status: {
                authentication: {
                    attempts: {
                        count: 1,
                        history: [
                            {
                                country_code: 'id',
                                id: '8919',
                                service: 'manual',
                                status: 'verified',
                                timestamp: 1674633681,
                            },
                        ],
                        latest: {
                            country_code: 'id',
                            id: '8919',
                            service: 'manual',
                            status: 'verified',
                            timestamp: 1674633681,
                        },
                    },
                    document: {
                        status: 'verified',
                    },
                    identity: {
                        services: {
                            idv: {
                                last_rejected: [],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'verified',
                            },
                            onfido: {
                                country_code: 'IDN',
                                documents_supported: [
                                    'Driving Licence',
                                    'National Identity Card',
                                    'Passport',
                                    'Residence Permit',
                                ],
                                is_country_supported: 1,
                                last_rejected: [],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        status: 'verified',
                    },
                    income: {
                        status: 'none',
                    },
                    needs_verification: [],
                    ownership: {
                        requests: [],
                        status: 'none',
                    },
                },
                currency_config: {
                    USD: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 0,
                risk_classification: 'low',
                status: [
                    'age_verification',
                    'allow_document_upload',
                    'authenticated',
                    'dxtrade_password_not_set',
                    'financial_information_not_complete',
                    'idv_disallowed',
                    'mt5_password_not_set',
                    'trading_experience_not_complete',
                ],
            },
            balance: '',
            can_change_fiat_currency: false,
            currency: '',
            current_currency_type: '',
            current_fiat_currency: '',
            getLimits: jest.fn(),
            is_account_setting_loaded: false,
            is_eu: false,
            is_deposit_lock: false,
            is_dxtrade_allowed: false,
            is_financial_account: false,
            is_financial_information_incomplete: false,
            is_trading_experience_incomplete: false,
            is_identity_verification_needed: false,
            is_logged_in: false,
            is_logging_in: false,
            is_pre_appstore: false,
            is_switching: false,
            is_tnc_needed: false,
            is_virtual: false,
            is_withdrawal_lock: false,
            landing_company_shortcode: '',
            local_currency_config: {
                currency: '',
                decimal_places: 0,
            },
            loginid: '',
            residence: '',
            standpoint: {
                iom: '',
            },
            switchAccount: jest.fn(),
            verification_code: {
                payment_agent_withdraw: '',
                payment_withdraw: '',
                request_email: '',
                reset_password: '',
                signup: '',
                system_email_change: '',
                trading_platform_dxtrade_password_reset: '',
                trading_platform_mt5_password_reset: '',
            },
            email: '',
            setVerificationCode: jest.fn(),
            updateAccountStatus: jest.fn(),
            is_authentication_needed: false,
            authentication_status: {
                document_status: '',
                identity_status: '',
            },
            mt5_login_list: [],
            is_risky_client: false,
            logout: jest.fn(),
            should_allow_authentication: false,
            is_landing_company_loaded: false,
        },
        common: {
            error: {
                app_routing_history: [],
                header: '',
                message: '',
                type: '',
                redirect_label: '',
                redirect_to: '',
                should_clear_error_on_click: false,
                should_show_refresh: false,
                redirectOnClick: jest.fn(),
                setError: jest.fn(),
            },
            is_from_derivgo: false,
            has_error: false,
            platform: '',
            routeBackInApp: jest.fn(),
            routeTo: jest.fn(),
            changeCurrentLanguage: jest.fn(),
        },
        ui: {
            current_focus: null,
            is_cashier_visible: false,
            is_dark_mode_on: false,
            is_mobile: false,
            disableApp: jest.fn(),
            enableApp: jest.fn(),
            setCurrentFocus: jest.fn(),
            toggleAccountsDialog: jest.fn(),
            toggleCashier: jest.fn(),
            setDarkMode: jest.fn(),
        },
        traders_hub: {
            closeModal: jest.fn(),
            openModal: jest.fn(),
            content_flag: '',
        },
        modules: {},
    };
};

const mockStore = (override: DeepPartial<TRootStore>): TRootStore => merge(mock(), override);

export { mockStore };
