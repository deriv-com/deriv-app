import { Context } from '../../utils/mocks/mocks';

export default function mockBalanceAll(context: Context) {
    if ('balance' in context.request && context.request.balance === 1 && context.request.account === 'all') {
        context.response = {
            balance: {
                accounts: {
                    CR5712710: {
                        balance: 0,
                        converted_amount: 0,
                        currency: 'BTC',
                        demo_account: 0,
                        status: 1,
                        type: 'deriv',
                    },
                    CR5712715: {
                        balance: 0,
                        converted_amount: 0,
                        currency: 'USD',
                        demo_account: 0,
                        status: 1,
                        type: 'deriv',
                    },
                    VRTC8420051: {
                        balance: 10008.46,
                        converted_amount: 10008.46,
                        currency: 'USD',
                        demo_account: 1,
                        status: 1,
                        type: 'deriv',
                    },
                },
                balance: 0,
                currency: 'USD',
                id: 'd55abfb0-1f66-e9fc-b09d-9fc722186dee',
                loginid: 'CR5712715',
                total: {
                    deriv: {
                        amount: 0,
                        currency: 'USD',
                    },
                    deriv_demo: {
                        amount: 10008.46,
                        currency: 'USD',
                    },
                    mt5: {
                        amount: 0,
                        currency: 'USD',
                    },
                    mt5_demo: {
                        amount: 0,
                        currency: 'USD',
                    },
                },
            },
            echo_req: {
                account: 'all',
                balance: 1,
                req_id: context.req_id,
                subscribe: 1,
            },
            msg_type: 'balance',
            req_id: context.req_id,
            subscription: {
                id: 'd55abfb0-1f66-e9fc-b09d-9fc722186dee',
            },
        };
    }
}
