import { Context } from '../../utils/mocks/mocks';

export default function mockTransaction(context: Context) {
    if ('transaction' in context.request && context.request.transaction === 1) {
        context.response = {
            echo_req: context.request,
            transaction: {
                id: 'ef96c343-ecab-1856-d70f-502bab3823f6',
            },
            subscription: {
                id: 'ef96c343-ecab-1856-d70f-502bab3823f6',
            },
            msg_type: 'transaction',
            req_id: context.req_id,
        };
    }
}
