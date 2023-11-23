import { Context } from '../../utils/mocks/mocks';

export default function mockGetSelfExclusion(context: Context) {
    if ('get_self_exclusion' in context.request && context.request.get_self_exclusion === 1) {
        context.response = {
            echo_req: {
                get_self_exclusion: 1,
                req_id: context.req_id,
            },
            get_self_exclusion: {},
            msg_type: 'get_self_exclusion',
            req_id: context.req_id,
        };
    }
}
