import { datadogLogs } from '@datadog/browser-logs';

const DATADOG_CLIENT_TOKEN = process.env.DATADOG_CLIENT_TOKEN ?? '';
const DATADOG_SESSION_SAMPLE_RATE = process.env.DATADOG_SESSION_SAMPLE_RATE ?? 10;
const CIRCLE_TAG = process.env.CIRCLE_TAG ?? 'NO_VERSION';

datadogLogs.init({
    clientToken: DATADOG_CLIENT_TOKEN,
    site: 'datadoghq.com',
    sessionSampleRate: DATADOG_SESSION_SAMPLE_RATE,
    service: 'Dbot',
    version: `deriv-app-${CIRCLE_TAG}`,
});

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

const log = (measures = []) => {
    if (measures && measures.length) {
        measures.forEach(measure => {
            datadogLogs.logger.info(measure.name, {
                name: measure.name,
                startTime: measure.startTimeDate,
                duration: measure.duration,
                detail: measure.detail,
            });
        });
    }
};

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
                let measure;
                if (res_type === 'history') {
                    performance.mark('ticks_history_end');
                    measure = performance.measure('ticks_history', 'ticks_history_start', 'ticks_history_end');
                } else {
                    performance.mark(`${res_type}_end`);
                    measure = performance.measure(`${res_type}`, `${res_type}_start`, `${res_type}_end`);
                }
                measure.startTimeDate = new Date(Date.now() - measure.startTime);
            }
        });
        return response_promise;
    };

    sendRequestsStatistic = () => {
        REQUESTS.forEach(req_type => {
            const measure = performance.getEntriesByName(req_type);
            if (measure && measure.length) {
                log(measure, req_type);
            }
        });
        performance.clearMeasures();
    };

    addGlobalMethod() {
        if (window) window.sendRequestsStatistic = this.sendRequestsStatistic;
    }
}

export default APIMiddleware;
