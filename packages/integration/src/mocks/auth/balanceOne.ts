import { Context } from '../../utils/mocks/mocks';

export default function mockBalanceOne(context: Context) {
    if ('balance' in context.request && context.request.balance === 1 && context.request.account === 'CR5712715') {
        context.response = {
            balance: {
                balance: 0,
                currency: 'USD',
                id: 'e5247f39-666e-9938-87d6-76415da2ffb4',
                loginid: 'CR5712715',
            },
            echo_req: {
                account: 'CR5712715',
                balance: 1,
                req_id: context.req_id,
                subscribe: 1,
            },
            msg_type: 'balance',
            req_id: context.req_id,
            subscription: {
                id: 'e5247f39-666e-9938-87d6-76415da2ffb4',
            },
        };
    }
}
