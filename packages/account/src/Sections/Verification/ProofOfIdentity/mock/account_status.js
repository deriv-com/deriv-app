// TODO: Mock data only for testing.
export const reference_account_status = {
    authentication: {
        document: {
            status: 'pending',
        },
        identity: {
            services: {
                idv: {
                    // last_rejected: [],
                    reported_properties: {},
                    status: 'rejected',
                    submissions_left: 2,
                },
                manual: {
                    status: 'none',
                },
                onfido: {
                    // country_code: 'GBR',
                    documents_supported: [
                        'Asylum Registration Card',
                        'Certificate of Naturalisation',
                        'Driving Licence',
                        'Home Office Letter',
                        'Immigration Status Document',
                        'Passport',
                        'Residence Permit',
                        'Visa',
                    ],
                    // is_country_supported: 1,
                    // last_rejected: [
                    //     'The document you provided is not supported for your country. Please provide a supported document for your country.',
                    //     "Your selfie isn't clear. Please take a clearer photo and try again. Ensure that there's enough light where you are and that your entire face is in the frame.",
                    // ],
                    reported_properties: {},
                    status: 'none',
                    submissions_left: 3,
                },
            },
            attempts: {
                latest: {
                    id: 1,
                    service: 'idv',
                    country_code: 'za',
                    time: 166321,
                },
                count: 1,
            },
            status: 'rejected',
        },
        needs_verification: ['identity'],
    },
    cashier_validation: ['ASK_SELF_EXCLUSION_MAX_TURNOVER_SET', 'ASK_UK_FUNDS_PROTECTION', 'unwelcome_status'],
    currency_config: {
        GBP: {
            is_deposit_suspended: 0,
            is_withdrawal_suspended: 0,
        },
    },
    prompt_client_to_authenticate: 1,
    risk_classification: 'low',
    status: [
        'allow_document_upload',
        'cashier_locked',
        'document_under_review',
        'financial_information_not_complete',
        'max_turnover_limit_not_set',
        'trading_experience_not_complete',
        'trading_password_required',
        'unwelcome',
    ],
};

// idv_none - Initial document verification for idv supported country
// idv_none_poa - Initial document verification for idv supported country that needs POA
// idv_result_pass - Idv verification pass
// idv_result_pass_poa - Idv verification pass and needs POA
// idv_result_expired - Idv verification expired
// idv_result_rejected - Idv verification rejected have submissions left
// idv_result_rejected_limited - Idv verification rejected but no submissions left
// Usage Guide:
// const account_status = figmaAccountStatus('idv_result_rejected_limited');
export const figmaAccountStatus = type => {
    switch (type) {
        case 'idv_none': {
            return {
                authentication: {
                    document: {
                        status: 'pending',
                    },
                    identity: {
                        services: {
                            idv: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        attempts: {
                            latest: null,
                            count: 0,
                        },
                        status: 'none',
                    },
                    needs_verification: ['identity'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_none_poa': {
            return {
                authentication: {
                    document: {
                        status: 'none',
                    },
                    identity: {
                        services: {
                            idv: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        attempts: {
                            latest: null,
                            count: 0,
                        },
                        status: 'none',
                    },
                    needs_verification: ['identity', 'document'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_result_pass': {
            return {
                authentication: {
                    document: {
                        status: 'none',
                    },
                    identity: {
                        services: {
                            idv: {
                                reported_properties: {},
                                status: 'verified',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        attempts: {
                            latest: {
                                id: 1,
                                service: 'idv',
                                country_code: 'za',
                                time: 166321,
                            },
                            count: 0,
                        },
                        status: 'verified',
                    },
                    needs_verification: ['identity'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_result_pass_poa': {
            return {
                authentication: {
                    document: {
                        status: 'none',
                    },
                    identity: {
                        services: {
                            idv: {
                                reported_properties: {},
                                status: 'verified',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        attempts: {
                            latest: {
                                id: 1,
                                service: 'idv',
                                country_code: 'za',
                                time: 166321,
                            },
                            count: 0,
                        },
                        status: 'verified',
                    },
                    needs_verification: ['identity', 'document'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_result_expired': {
            return {
                authentication: {
                    document: {
                        status: 'none',
                    },
                    identity: {
                        services: {
                            idv: {
                                reported_properties: {},
                                status: 'expired',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        attempts: {
                            latest: {
                                id: 1,
                                service: 'idv',
                                country_code: 'za',
                                time: 166321,
                            },
                            count: 0,
                        },
                        status: 'expired',
                    },
                    needs_verification: ['identity'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_result_rejected': {
            return {
                authentication: {
                    document: {
                        status: 'pending',
                    },
                    identity: {
                        services: {
                            idv: {
                                last_rejected: [],
                                reported_properties: {},
                                status: 'rejected',
                                submissions_left: 2,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                // last_rejected: [
                                //     'The document you provided is not supported for your country. Please provide a supported document for your country.',
                                //     "Your selfie isn't clear. Please take a clearer photo and try again. Ensure that there's enough light where you are and that your entire face is in the frame.",
                                // ],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        attempts: {
                            latest: {
                                id: 1,
                                service: 'idv',
                                country_code: 'za',
                                time: 166321,
                            },
                            count: 1,
                        },
                        status: 'rejected',
                    },
                    needs_verification: ['identity'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_result_rejected_limited': {
            return {
                authentication: {
                    document: {
                        status: 'pending',
                    },
                    identity: {
                        services: {
                            idv: {
                                last_rejected: [],
                                reported_properties: {},
                                status: 'rejected',
                                submissions_left: 0,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                // last_rejected: [
                                //     'The document you provided is not supported for your country. Please provide a supported document for your country.',
                                //     "Your selfie isn't clear. Please take a clearer photo and try again. Ensure that there's enough light where you are and that your entire face is in the frame.",
                                // ],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        attempts: {
                            latest: {
                                id: 1,
                                service: 'idv',
                                country_code: 'za',
                                time: 166321,
                            },
                            count: 1,
                        },
                        status: 'rejected',
                    },
                    needs_verification: ['identity'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        default:
            return {};
    }
};

export const getAccountStatus = (service_type, status, last_attempt, submissions_left, last_rejected) => {
    let updated_service = {};
    switch (service_type) {
        case 'idv':
            updated_service = {
                services: {
                    idv: {
                        last_rejected,
                        reported_properties: {},
                        status,
                        submissions_left,
                    },
                    manual: {
                        status: 'none',
                    },
                    onfido: {
                        status: 'none',
                    },
                },
                status,
            };
            break;
        case 'onfido':
            updated_service = {
                services: {
                    idv: {
                        status: 'none',
                    },
                    manual: {
                        status: 'none',
                    },
                    onfido: {
                        country_code: 'GBR',
                        documents_supported: [
                            'Asylum Registration Card',
                            'Certificate of Naturalisation',
                            'Driving Licence',
                            'Home Office Letter',
                            'Immigration Status Document',
                            'Passport',
                            'Residence Permit',
                            'Visa',
                        ],
                        is_country_supported: 1,
                        last_rejected,
                        reported_properties: {},
                        status,
                        submissions_left,
                    },
                },
                status,
            };
            break;
        // defaults to manual
        default:
            updated_service = {
                services: {
                    idv: {
                        status: 'none',
                    },
                    manual: {
                        status,
                    },
                    onfido: {
                        status: 'none',
                    },
                },
                status,
            };
    }

    const new_status = {
        authentication: {
            identity: {
                attempts: {
                    ...last_attempt,
                },
                ...updated_service,
            },
            needs_verification: ['identiy'],
        },
        cashier_validation: ['ASK_SELF_EXCLUSION_MAX_TURNOVER_SET', 'ASK_UK_FUNDS_PROTECTION', 'unwelcome_status'],
        currency_config: {
            GBP: {
                is_deposit_suspended: 0,
                is_withdrawal_suspended: 0,
            },
        },
        prompt_client_to_authenticate: 1,
        risk_classification: 'low',
        status: [
            'allow_document_upload',
            'cashier_locked',
            'document_under_review',
            'financial_information_not_complete',
            'max_turnover_limit_not_set',
            'trading_experience_not_complete',
            'trading_password_required',
            'unwelcome',
        ],
    };

    return new_status;
};

export const getAccountResidence = country => {
    let residence = {};

    switch (country) {
        case 'ghana':
            residence = {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {
                                drivers_license: {
                                    display_name: 'Drivers License',
                                    format: '^[A-Z0-9]{6,10}$',
                                },
                                national_id: {
                                    display_name: 'National ID',
                                    format: '^GHA-[A-Z0-9]{9}-[A-Z0-9]{1}$',
                                },
                                passport: {
                                    display_name: 'Passport',
                                    format: '^G[A-Z0-9]{7,9}$',
                                },
                                ssnit: {
                                    display_name: 'SSNIT',
                                    format: '^[A-Z]{1}[A-Z0-9]{12,14}$',
                                },
                                voter_id: {
                                    display_name: 'Voter ID',
                                    format: '^[0-9]{10,12}$',
                                },
                            },
                            has_visual_sample: 0,
                            is_country_supported: 1,
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
                phone_idd: '233',
                text: 'Ghana',
                tin_format: ['^[A-Za-z]d{10}$'],
                value: 'gh',
            };
            break;
        case 'nigeria':
            residence = {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {
                                bvn: {
                                    display_name: 'BVN',
                                    format: '^[0-9]{11}$',
                                },
                                cac: {
                                    display_name: 'CAC',
                                    format: '^(RC)?[0-9]{5,8}$',
                                },
                                drivers_license: {
                                    display_name: 'Drivers License',
                                    format: '^(?=.*[0-9])(?=.*[A-Z])[A-Z0-9]{3}([ -]{1})?[A-Z0-9]{6,12}$',
                                },
                                nin: {
                                    display_name: 'NIN',
                                    format: '^[0-9]{11}$',
                                },
                                nin_slip: {
                                    display_name: 'NIN Slip',
                                    format: '^[0-9]{11}$',
                                },
                                tin: {
                                    display_name: 'TIN',
                                    format: '^[0-9]{8,}-[0-9]{4,}$',
                                },
                                voter_id: {
                                    display_name: 'Voter ID',
                                    format: '^([A-Z0-9]{19}|[A-Z0-9]{9})$',
                                },
                            },
                            has_visual_sample: 1,
                            is_country_supported: 1,
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
                                voter_id: {
                                    display_name: 'Voter Id',
                                },
                            },
                            is_country_supported: 1,
                        },
                    },
                },
                phone_idd: '234',
                text: 'Nigeria',
                tin_format: ['^d{10}$', '^d{8}$', '^[A-Za-z]d{4,8}$', '^d{11}$'],
                value: 'ng',
            };
            break;
        case 'kenya':
            residence = {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {
                                alien_card: {
                                    display_name: 'Alien Card',
                                    format: '^[0-9]{6,9}$',
                                },
                                national_id: {
                                    display_name: 'National ID',
                                    format: '^[0-9]{1,9}$',
                                },
                                passport: {
                                    display_name: 'Passport',
                                    format: '^[A-Z0-9]{7,9}$',
                                },
                            },
                            has_visual_sample: 1,
                            is_country_supported: 1,
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
                phone_idd: '254',
                text: 'Kenya',
                value: 'ke',
            };
            break;
        default:
            residence = {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {},
                            has_visual_sample: 0,
                            is_country_supported: 0,
                        },
                        onfido: {
                            documents_supported: {
                                asylum_registration_card: {
                                    display_name: 'Asylum Registration Card',
                                },
                                certificate_of_naturalisation: {
                                    display_name: 'Certificate of Naturalisation',
                                },
                                driving_licence: {
                                    display_name: 'Driving Licence',
                                },
                                home_office_letter: {
                                    display_name: 'Home Office Letter',
                                },
                                immigration_status_document: {
                                    display_name: 'Immigration Status Document',
                                },
                                passport: {
                                    display_name: 'Passport',
                                },
                                residence_permit: {
                                    display_name: 'Residence Permit',
                                },
                                visa: {
                                    display_name: 'Visa',
                                },
                            },
                            is_country_supported: 1,
                        },
                    },
                },
                phone_idd: '44',
                text: 'United Kingdom',
                tin_format: ['^d{10}$', '^[A-Za-z]{2}d{6}[A-Za-z]$'],
                value: 'gb',
            };
    }
    return residence;
};
