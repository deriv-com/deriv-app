// TODO: Mock data only for testing.
export const reference_account_status = {
    authentication: {
        attempts: {
            latest: {
                id: 1,
                service: 'idv',
                country_code: 'za',
                time: 166321,
            },
            count: 1,
        },
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
                    attempts: {
                        latest: null,
                        count: 0,
                    },
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
                    attempts: {
                        latest: null,
                        count: 0,
                    },
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
                    attempts: {
                        latest: {
                            id: 1,
                            service: 'idv',
                            country_code: 'za',
                            time: 166321,
                        },
                        count: 0,
                    },
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
                    attempts: {
                        latest: {
                            id: 1,
                            service: 'idv',
                            country_code: 'za',
                            time: 166321,
                        },
                        count: 0,
                    },
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
                    attempts: {
                        latest: {
                            id: 1,
                            service: 'idv',
                            country_code: 'za',
                            time: 166321,
                        },
                        count: 0,
                    },
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
                    attempts: {
                        latest: {
                            id: 1,
                            service: 'idv',
                            country_code: 'za',
                            time: 166321,
                        },
                        count: 1,
                    },
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
                    attempts: {
                        latest: {
                            id: 1,
                            service: 'idv',
                            country_code: 'za',
                            time: 166321,
                        },
                        count: 1,
                    },
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
