import { Context } from 'Utils/mocks/mocks';

export default function mock_statement(context: Context) {
    if ('statement' in context.request && context.request.statement === 1) {
        context.response = {
            echo_req: context.request,
            statement: {
                count: 0,
                transactions: [],
            },
            msg_type: 'statement',
            req_id: context.req_id,
        };
    }
}
