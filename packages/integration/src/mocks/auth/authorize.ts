import { Context } from '../../utils/mocks/mocks';

export const DEFAULT_ACCOUNTS = [
    {
        id: 'CR5712715',
        account_category: 'trading',
        account_type: 'binary',
        created_at: 1688638657,
        currency: 'USD',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [],
        token: 'a1-x0000000000000000000000000001',
    },
    {
        id: 'CR5712710',
        account_category: 'trading',
        account_type: 'binary',
        created_at: 1688638635,
        currency: 'BTC',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [],
        token: 'a1-x0000000000000000000000000002',
    },
    {
        id: 'VRTC8420051',
        account_category: 'trading',
        account_type: 'binary',
        created_at: 1688638579,
        currency: 'USD',
        is_disabled: 0,
        is_virtual: 1,
        landing_company_name: 'virtual',
        linked_to: [],
        token: 'a1-x0000000000000000000000000003',
    },
];

export default function mockAuthorize(context: Context) {
    if ('authorize' in context.request) {
        context.response = {
            authorize: {
                account_list: [
                    {
                        account_category: 'trading',
                        account_type: 'binary',
                        created_at: 1688638657,
                        currency: 'USD',
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_name: 'svg',
                        linked_to: [],
                        loginid: 'CR5712715',
                    },
                    {
                        account_category: 'trading',
                        account_type: 'binary',
                        created_at: 1688638635,
                        currency: 'BTC',
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_name: 'svg',
                        linked_to: [],
                        loginid: 'CR5712710',
                    },
                    {
                        account_category: 'trading',
                        account_type: 'binary',
                        created_at: 1688638579,
                        currency: 'USD',
                        is_disabled: 0,
                        is_virtual: 1,
                        landing_company_name: 'virtual',
                        linked_to: [],
                        loginid: 'VRTC8420051',
                    },
                ],
                balance: 0,
                country: 'th',
                currency: 'USD',
                email: 'jane.smith@example.com',
                fullname: ' Jane Smith',
                is_virtual: 0,
                landing_company_fullname: 'Deriv (SVG) LLC',
                landing_company_name: 'svg',
                linked_to: [],
                local_currencies: {
                    THB: {
                        fractional_digits: 2,
                    },
                },
                loginid: 'CR5712715',
                preferred_language: 'EN',
                scopes: ['read', 'trade', 'trading_information', 'payments', 'admin'],
                upgradeable_landing_companies: ['svg'],
                user_id: 10000001,
            },
            echo_req: {
                authorize: '<not shown>',
                req_id: context.req_id,
            },
            req_id: context.req_id,
            msg_type: 'authorize',
        };
    }
}
