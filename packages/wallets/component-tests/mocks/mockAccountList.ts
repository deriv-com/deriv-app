import { Context } from '@deriv/integration/src/utils/mocks/mocks';

const TEMP_ACCOUNT_LIST = [
    {
        account_category: 'trading',
        account_type: 'standard',
        broker: 'CR',
        created_at: 1720591930,
        currency: 'USD',
        currency_type: 'fiat',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [
            {
                loginid: 'CRW1003',
                platform: 'dwallet',
            },
        ],
        loginid: 'CR90000243',
    },
    {
        account_category: 'wallet',
        account_type: 'doughflow',
        broker: 'CRW',
        created_at: 1720591899,
        currency: 'USD',
        currency_type: 'fiat',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [
            {
                loginid: 'CR90000243',
                platform: 'dtrade',
            },
        ],
        loginid: 'CRW1003',
    },
    {
        account_category: 'wallet',
        account_type: 'virtual',
        broker: 'VRW',
        created_at: 1720591899,
        currency: 'USD',
        currency_type: 'fiat',
        is_disabled: 0,
        is_virtual: 1,
        landing_company_name: 'virtual',
        linked_to: [],
        loginid: 'VRW1004',
    },
];

export function mockAccountList(context: Context) {
    if (!('account_list' in context.request)) {
        return;
    }

    context.response = {
        account_list: TEMP_ACCOUNT_LIST,
        echo_req: context.request,
        msg_type: 'account_list',
        req_id: context.req_id,
    };
}
