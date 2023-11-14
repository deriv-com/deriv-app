import { Context } from '../../utils/mocks/mocks';

export default function mockTime(context: Context) {
    if ('time' in context.request && context.request.time === 1) {
        context.response = {
            echo_req: {
                req_id: context.req_id,
                time: 1,
            },
            req_id: context.req_id,
            msg_type: 'time',
            time: parseInt((Date.now() / 1000).toFixed(0)),
        };
    }
}
