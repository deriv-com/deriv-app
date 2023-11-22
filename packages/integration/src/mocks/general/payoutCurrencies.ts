import { Context } from '../../utils/mocks/mocks';

export default function mockPayoutCurrencies(context: Context) {
    if ('payout_currencies' in context.request && context.request.payout_currencies === 1) {
        context.response = {
            echo_req: {
                req_id: context.req_id,
                payout_currencies: 1,
            },
            req_id: context.req_id,
            msg_type: 'payout_currencies',
            payout_currencies: ['USD'],
        };
    }
}
