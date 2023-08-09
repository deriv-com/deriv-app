const datadogLogs = require('@datadog/browser-logs').datadogLogs;
const formatDate = require('@deriv/shared').formatDate;
const formatTime = require('@deriv/shared').formatTime;

const datadog_client_token_logs = process.env.DATADOG_CLIENT_TOKEN_LOGS ?? '';
const is_production = process.env.CIRCLE_JOB === 'release_production';
const is_staging = process.env.CIRCLE_JOB === 'release_staging';
const datadog_session_sample_rate = +process.env.DATADOG_SESSION_SAMPLE_RATE ?? 10;
let datadog_version = '';
let datadog_env = '';
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

if (is_production) {
    datadog_version = `deriv-app-${process.env.CIRCLE_TAG}`;
    datadog_env = 'production';
} else if (is_staging) {
    datadog_version = `deriv-app-staging-v${formatDate(new Date(), 'YYYYMMDD')}-${formatTime(Date.now(), 'HH:mm')}`;
    datadog_env = 'staging';
}

if (datadog_client_token_logs) {
    datadogLogs.init({
        clientToken: datadog_client_token_logs,
        site: 'datadoghq.com',
        forwardErrorsToLogs: false,
        service: 'Dp2p',
        sessionSampleRate: datadog_session_sample_rate,
        version: datadog_version,
        env: datadog_env,
    });
}

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

    log = (measures = []) => {
        if (process.env.DATADOG_CLIENT_TOKEN_LOGS) {
            measures?.forEach(measure => {
                datadogLogs.logger.info(measure.name, {
                    name: measure.name,
                    startTime: measure.startTimeDate,
                    duration: measure.duration,
                    detail: measure.detail,
                });
            });
        }
    };

    defineMeasure = response_type => {
        let measure;
        if (response_type === 'p2p_advert_create') {
            performance.mark('create_ad_end');
            if (performance.getEntriesByName('create_ad_start', 'mark').length) {
                measure = performance.measure('create_ad', 'create_ad_start', 'create_ad_end');
                performance.clearMarks('create_ad_start');
                this.log([measure]);
            }
        } else if (response_type === 'p2p_order_info') {
            performance.mark('create_order_end');
            if (performance.getEntriesByName('create_order_start', 'mark').length) {
                measure = performance.measure('create_order', 'create_order_start', 'create_order_end');
                performance.clearMarks('create_order_start');
                this.log([measure]);
            }
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

    clearPerformanceMeasures = () => {
        performance.clearMeasures();
    };

    addGlobalMethod() {
        if (window) window.clearPerformanceMeasures = this.clearPerformanceMeasures;
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
