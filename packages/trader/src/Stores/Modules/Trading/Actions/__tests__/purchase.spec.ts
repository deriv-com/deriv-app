import { TBuyRequest } from 'Types';
import { processPurchase } from '../purchase';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        buy: jest.fn(async (request: TBuyRequest) => ({
            buy: {
                balance_after: 9032.86,
                buy_price: 10,
                contract_id: 227611790988,
                longcode:
                    'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 1 hour after contract start time.',
                payout: 19.61,
                purchase_time: 1703538801,
                shortcode: 'CALL_1HZ100V_19.61_1703538801_1703542401_S0P_0',
                start_time: 1703538801,
                transaction_id: 454112678728,
            },
            echo_req: {
                ...request,
                buy: request.proposal_id,
                req_id: 43,
            },
            msg_type: 'buy',
            req_id: 43,
        })),
    },
}));

describe('processPurchase', () => {
    const passthrough = { test_property: 'test' };
    const price = '10.00';
    const proposal_id = '173d576b-789b-517a-a7d5-a39ee9c76bf0';
    const req_id = 43;

    it('should return a Buy response reflecting request params in echo_req', async () => {
        const response = {
            buy: {
                balance_after: 9032.86,
                buy_price: 10,
                contract_id: 227611790988,
                longcode:
                    'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 1 hour after contract start time.',
                payout: 19.61,
                purchase_time: 1703538801,
                shortcode: 'CALL_1HZ100V_19.61_1703538801_1703542401_S0P_0',
                start_time: 1703538801,
                transaction_id: 454112678728,
            },
            echo_req: {
                buy: proposal_id,
                price,
                req_id,
            },
            msg_type: 'buy',
            req_id,
        };
        expect(await processPurchase(proposal_id, price)).toMatchObject(response);
    });
    it('should return a Buy response with passthrough object in echo_req', async () => {
        expect(await processPurchase(proposal_id, price, passthrough)).toEqual(
            expect.objectContaining({
                echo_req: expect.objectContaining({
                    buy: proposal_id,
                    passthrough,
                    price,
                    req_id,
                }),
            })
        );
    });
});
