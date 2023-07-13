import { datadogLogs } from '@datadog/browser-logs';
import { formatDate, formatTime } from '@deriv/shared';

const DATADOG_CLIENT_TOKEN_LOGS = process.env.DATADOG_CLIENT_TOKEN_LOGS ?? '';
const isProduction = process.env.CIRCLE_JOB === 'release_production';
const isStaging = process.env.CIRCLE_JOB === 'release_staging';
let dataDogSessionSampleRate = 0;

dataDogSessionSampleRate = +process.env.DATADOG_SESSION_SAMPLE_RATE_LOGS ?? 1;
let dataDogVersion = '';
let dataDogEnv = '';

if (isProduction) {
    dataDogVersion = `deriv-app-${process.env.CIRCLE_TAG}`;
    dataDogEnv = 'production';
} else if (isStaging) {
    dataDogVersion = `deriv-app-staging-v${formatDate(new Date(), 'YYYYMMDD')}-${formatTime(Date.now(), 'HH:mm')}`;
    dataDogEnv = 'staging';
}

datadogLogs.init({
    clientToken: DATADOG_CLIENT_TOKEN_LOGS,
    site: 'datadoghq.com',
    forwardErrorsToLogs: false,
    service: 'Dbot',
    sessionSampleRate: dataDogSessionSampleRate,
    version: dataDogVersion,
    env: dataDogEnv,
});

export const REQUESTS = [
    'active_symbols',
    'authorize',
    'balance',
    'buy',
    'proposal',
    'proposal_open_contract',
    'run-proposal',
    'transaction',
    'ticks_history',
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

    log = (measures = [], is_bot_running) => {
        if (measures && measures.length) {
            measures.forEach(measure => {
                datadogLogs.logger.info(measure.name, {
                    name: measure.name,
                    startTime: measure.startTimeDate,
                    duration: measure.duration,
                    detail: measure.detail,
                    isBotRunning: is_bot_running,
                });
            });
        }
    };

    defineMeasure = res_type => {
        if (res_type) {
            let measure;
            if (res_type === 'proposal') {
                performance.mark('first_proposal_end');
                if (performance.getEntriesByName('bot-start', 'mark').length) {
                    measure = performance.measure('run-proposal', 'bot-start', 'first_proposal_end');
                    performance.clearMarks('bot-start');
                }
            }
            if (res_type === 'history') {
                performance.mark('ticks_history_end');
                measure = performance.measure('ticks_history', 'ticks_history_start', 'ticks_history_end');
            } else {
                performance.mark(`${res_type}_end`);
                measure = performance.measure(`${res_type}`, `${res_type}_start`, `${res_type}_end`);
            }
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

    sendRequestsStatistic = is_bot_running => {
        REQUESTS.forEach(req_type => {
            const measure = performance.getEntriesByName(req_type);
            if (measure && measure.length) {
                this.log(measure, is_bot_running, req_type);
            }
        });
        performance.clearMeasures();
    };

    addGlobalMethod() {
        if (window) window.sendRequestsStatistic = this.sendRequestsStatistic;
    }
}

export default APIMiddleware;
