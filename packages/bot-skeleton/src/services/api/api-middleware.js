const getRequestType = request => {
    const req_types = [
        'authorize',
        'balance',
        'active_symbols',
        'transaction',
        'ticks_history',
        'forget',
        'proposal_open_contract',
        'proposal',
        'buy',
    ];
    let req_type;
    req_types.forEach(type => {
        if (type in request && !req_type) req_type = type;
    });

    return req_type;
};

class APIMiddleware {
    constructor(config) {
        this.config = config;
        this.debounced_calls = {};
    }

    sendIsCalled = ({ response_promise, args: [request] }) => {
        const req_type = getRequestType(request);
        if (req_type) performance.mark(`${req_type}_start`);
        response_promise.then(res => {
            const res_type = getRequestType(res);
            if (res_type) {
                performance.mark(`${res_type}_end`);
                performance.measure(`${res_type}`, `${res_type}_start`, `${res_type}_end`);
                //eslint-disable-next-line
                console.log(performance.getEntriesByName(res_type));
            }
        });
        return response_promise;
    };
}

export default APIMiddleware;
