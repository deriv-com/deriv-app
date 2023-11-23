import { Context } from '../../utils/mocks/mocks';

export default function mockMt5LoginList(context: Context) {
    if ('mt5_login_list' in context.request && context.request.mt5_login_list === 1) {
        context.response = {
            echo_req: {
                mt5_login_list: 1,
                req_id: context.req_id,
            },
            msg_type: 'mt5_login_list',
            mt5_login_list: [],
            req_id: context.req_id,
        };
    }
}
