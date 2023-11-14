import { Context } from '../../utils/mocks/mocks';

export default function mockGetAccountStatus(context: Context) {
    if ('get_account_status' in context.request && context.request.get_account_status === 1) {
        context.response = {
            echo_req: {
                get_account_status: 1,
                req_id: context.req_id,
            },
            get_account_status: {
                authentication: {
                    attempts: {
                        count: 0,
                        history: [],
                        latest: null,
                    },
                    document: {
                        status: 'none',
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
                                status: 'none',
                            },
                            onfido: {
                                country_code: 'THA',
                                documents_supported: ['Driving Licence', 'National Identity Card', 'Passport'],
                                is_country_supported: 1,
                                last_rejected: [],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 2,
                            },
                        },
                        status: 'none',
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
                p2p_status: 'active',
                prompt_client_to_authenticate: 0,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'deposit_attempt',
                    'dxtrade_password_not_set',
                    'financial_information_not_complete',
                    'mt5_password_not_set',
                    'trading_experience_not_complete',
                ],
            },
            msg_type: 'get_account_status',
            req_id: context.req_id,
        };
    }
}
