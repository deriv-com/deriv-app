export default function mock_payout_currencies(context) {
    if (context.request.payout_currencies === 1) {
        context.response = {
            echo_req: context.request,
            req_id: context.req_id,
            msg_type: 'payout_currencies',
            payout_currencies: ['USD'],
        };
    }
}
