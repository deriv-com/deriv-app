import { Context } from 'Utils/mocks/mocks';

export default function mock_account_security(context: Context) {
    if ('account_security' in context.request && context.request.account_security === 1) {
        context.response = {
            echo_req: context.request,
            account_security: {
                totp: {
                    is_enabled: 0,
                },
            },
            msg_type: 'account_security',
            req_id: context.req_id,
        };
    }
}
