const REQUESTS = [
    'authorize',
    'balance',
    'active_symbols',
    'transaction',
    'ticks_history',
    'forget',
    'proposal_open_contract',
    'proposal',
    'buy',
    'history', // only response, there is no `history` type but instead it is response type
];

const getRequestType = request => {
    let req_type;
    REQUESTS.forEach(type => {
        if (type in request && !req_type) req_type = type;
    });

    return req_type;
};

class APIMiddleware {
    constructor(config) {
        this.config = config;
        this.debounced_calls = {};
        this.addGlobalMethod();
    }

    sendIsCalled = ({ response_promise, args: [request] }) => {
        const req_type = getRequestType(request);
        if (req_type) performance.mark(`${req_type}_start`);
        response_promise.then(res => {
            const res_type = getRequestType(res);
            if (res_type) {
                if (res_type === 'history') {
                    performance.mark('ticks_history_end');
                    performance.measure('ticks_history', 'ticks_history_start', 'ticks_history_end');
                } else {
                    performance.mark(`${res_type}_end`);
                    performance.measure(`${res_type}`, `${res_type}_start`, `${res_type}_end`);
                }
            }
        });
        return response_promise;
    };

    printStats = () => {
        REQUESTS.forEach(req => {
            const measure = performance.getEntriesByName(req);
            //eslint-disable-next-line no-console
            if (measure && measure.length) console.table(measure);
        });
        performance.clearMeasures();
        performance.clearMarks();
    };

    addGlobalMethod() {
        if (window) window.printStats = this.printStats;
    }
}

export default APIMiddleware;
