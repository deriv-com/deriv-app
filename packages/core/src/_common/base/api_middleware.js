const REQUESTS = [
    'authorize',
    'website_status',
    'p2p_advert_create',
    'p2p_advertiser_payment_methods',
    'p2p_payment_methods',
    'p2p_advert_list',
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
        let request_type;

        REQUESTS.forEach(type => {
            if (type in request && !request_type) request_type = type;
        });

        return request_type;
    };

    log = (is_p2p_running, measures = []) => {
        measures?.forEach(measure => {
            /* eslint-disable no-console */
            console.log(measure);
            console.log(is_p2p_running);
        });
    };

    defineMeasure = response_type => {
        let measure;
        if (response_type === 'p2p_advert_create') {
            performance.mark('create_ad_end');
            measure = performance.measure('create_ad', 'create_ad_start', 'create_ad_end');
            performance.clearMarks('create_ad_start');

            /* eslint-disable no-console */
            console.log(measure);
        } else if (response_type === 'p2p_order_info') {
            performance.mark('create_order_end');
            measure = performance.measure('create_order', 'create_order_start', 'create_order_end');
            performance.clearMarks('create_order_start');

            /* eslint-disable no-console */
            console.log(measure);
        } else {
            performance.mark(`${response_type}_end`);
            measure = performance.measure(`${response_type}`, `${response_type}_start`, `${response_type}_end`);
        }

        return (measure.startTimeDate = new Date(Date.now() - measure.startTime));
    };

    sendWillBeCalled({ args: [request] }) {
        this.config.wsEvent('send');

        const key = requestToKey(request);

        if (key in this.debounced_calls) {
            return this.debounced_calls[key];
        }

        return undefined;
    }

    sendIsCalled({ response_promise, args: [request, options = {}] }) {
        const promise = promiseRejectToResolve(response_promise);

        const key = requestToKey(request);
        const request_type = this.getRequestType(request);

        if (request_type) performance.mark(`${request_type}_start`);

        if (options.callback) {
            promise.then(options.callback);
        }

        this.debounced_calls[key] = promise;

        promise.then(response => {
            const response_type = this.getRequestType(response);
            if (response_type) this.defineMeasure(response_type);

            delete this.debounced_calls[key];
        });

        return promise;
    }

    sendRequestsStatistic = is_p2p_running => {
        REQUESTS.forEach(request_type => {
            const measure = performance.getEntriesByName(request_type);
            if (measure?.length) this.log(is_p2p_running, measure);
        });
        performance.clearMeasures();
    };

    addGlobalMethod() {
        if (window) window.sendRequestsStatistic = this.sendRequestsStatistic;
    }
}

// Delegate error handling to the callback
function promiseRejectToResolve(promise) {
    return new Promise(r => {
        promise.then(r, r);
    });
}

function requestToKey(request) {
    const request_copy = { ...request };

    delete request_copy.passthrough;
    delete request_copy.req_id;
    delete request_copy.subscribe;

    return JSON.stringify(request_copy);
}

module.exports = APIMiddleware;
