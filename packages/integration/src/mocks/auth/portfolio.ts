import { Context } from 'Utils/mocks/mocks';

export default function mock_portfolio(context: Context) {
    if ('portfolio' in context.request && context.request.portfolio === 1) {
        context.response = {
            echo_req: context.request,
            portfolio: {
                contracts: [],
            },
            msg_type: 'portfolio',
            req_id: context.req_id,
        };
    }
}
