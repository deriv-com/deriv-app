import { Context } from '@deriv/integration/src/utils/mocks/mocks';

const TEMP_DATA = {
    accounts: {
        CR90000243: {
            balance: 0.0,
            converted_amount: 0.0,
            currency: 'USD',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        CR90000256: {
            balance: 0,
            converted_amount: 0,
            currency: 'BTC',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        CRW1003: {
            balance: 0.0,
            converted_amount: 0.0,
            currency: 'USD',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        CRW1017: {
            balance: 0,
            converted_amount: 0,
            currency: 'BTC',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        CRW1036: {
            balance: 0,
            converted_amount: 0,
            currency: 'ETH',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        VRTC90000115: {
            balance: 0,
            converted_amount: 0,
            currency: 'USD',
            demo_account: 1,
            status: 1,
            type: 'deriv',
        },
        VRW1004: {
            balance: 0,
            converted_amount: 0,
            currency: 'USD',
            demo_account: 1,
            status: 1,
            type: 'deriv',
        },
    },
    balance: 0.0,
    currency: 'USD',
    id: '88790cc1-7281-6a55-936e-c3de3d67c022',
    loginid: 'CR90000243',
    total: {
        deriv: {
            amount: 0,
            currency: 'USD',
        },
        deriv_demo: {
            amount: 0,
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
};

export function mockWalletsBalances(context: Context) {
    if (!('balance' in context.request)) {
        return;
    }

    if (!context.request.account) {
        return;
    }

    if (context.request.account === 'all') {
        context.response = {
            balance: TEMP_DATA,
            echo_req: context.request,
            msg_type: 'balance',
            req_id: context.req_id,
        };
        return;
    }

    context.response = {
        balance: TEMP_DATA.accounts[context.request.account],
        echo_req: context.request,
        msg_type: 'balance',
        req_id: context.req_id,
    };
}
