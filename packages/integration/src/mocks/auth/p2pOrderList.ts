import { Context } from '../../utils/mocks/mocks';

export default function mockP2pOrderList(context: Context) {
    if ('p2p_order_list' in context.request && context.request.p2p_order_list === 1) {
        context.response = {
            echo_req: context.request,
            p2p_order_list: {
                list: [],
            },
            msg_type: 'p2p_order_list',
            req_id: context.req_id,
        };
    }
}
