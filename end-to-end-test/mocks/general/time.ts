export default function mock_time(context) {
    if (context.request.time === 1) {
        context.response = {
            echo_req: context.request,
            req_id: context.req_id,
            msg_type: 'time',
            time: (Date.now() / 1000).toFixed(0),
        };
    }
}
