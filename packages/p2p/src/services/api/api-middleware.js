export const REQUESTS = [
    'website_status',
    'p2p_advert_list',
    'p2p_payment_methods',
    'p2p_order_create',
    'p2p_order_info',
];

class APIMiddleware {
    constructor(config) {
        this.config = config;
        this.debounced_calls = {};
        this.addGlobalMethod();
    }

    getRequestType = request => {
        let req_type;
        REQUESTS.forEach(type => {
            if (type in request && !req_type) req_type = type;
        });

        return req_type;
    };

    log = (measures = [], is_p2p_running) => {
        if (measures && measures.length) {
            measures.forEach(measure => {
                /* eslint-disable no-console */
                console.log(measure);
                console.log(is_p2p_running);
            });
        }
    };

    defineMeasure = res_type => {
        if (res_type) {
            performance.mark(`${res_type}_end`);
            const measure = performance.measure(`${res_type}`, `${res_type}_start`, `${res_type}_end`);
            return (measure.startTimeDate = new Date(Date.now() - measure.startTime));
        }
        return false;
    };

    sendIsCalled = ({ response_promise, args: [request] }) => {
        const req_type = this.getRequestType(request);
        if (req_type) performance.mark(`${req_type}_start`);
        response_promise.then(res => {
            const res_type = this.getRequestType(res);
            if (res_type) {
                this.defineMeasure(res_type);
            }
        });
        return response_promise;
    };

    sendRequestsStatistic = is_p2p_running => {
        REQUESTS.forEach(req_type => {
            const measure = performance.getEntriesByName(req_type);
            if (measure && measure.length) {
                this.log(measure, is_p2p_running, req_type);
            }
        });
        performance.clearMeasures();
    };

    addGlobalMethod() {
        if (window) window.sendRequestsStatistic = this.sendRequestsStatistic;
    }
}

export default APIMiddleware;
