import { Context } from 'Utils/mocks/mocks';

export default function mock_mt5_login_list(context: Context) {
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
