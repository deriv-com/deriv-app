import { datadogLogs } from '@datadog/browser-logs';
import { formatDate, formatTime } from '@deriv/shared';

const DATADOG_CLIENT_TOKEN = process.env.DATADOG_CLIENT_TOKEN ?? '';
const isProduction = process.env.CIRCLE_JOB === 'release_production';
const isStaging = process.env.CIRCLE_JOB === 'release_staging';

let dataDogSessionSampleRate = 0;
let dataDogVersion = '';
let dataDogEnv = '';

if (isProduction) {
    dataDogVersion = `deriv-app-${process.env.CIRCLE_TAG}`;
    dataDogSessionSampleRate = +process.env.DATADOG_SESSION_SAMPLE_RATE ?? 10;
    dataDogEnv = 'production';
} else if (isStaging) {
    dataDogVersion = `deriv-app-staging-v${formatDate(new Date(), 'YYYYMMDD')}-${formatTime(Date.now(), 'HH:mm')}`;
    dataDogSessionSampleRate = 100;
    dataDogEnv = 'staging';
}

datadogLogs.init({
    clientToken: DATADOG_CLIENT_TOKEN,
    site: 'datadoghq.eu',
    forwardErrorsToLogs: true,
    service: 'Dbot',
    sessionSampleRate: dataDogSessionSampleRate,
    version: dataDogVersion,
    env: dataDogEnv,
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
    'exchange_rates',
    'trading_times',
    'time',
    'get_account_status',
    'get_settings',
    'payout_currencies',
    'website_status',
    'get_financial_assessment',
    'mt5_login_list',
    'get_self_exclusion',
    'landing_company',
    'get_limits',
    'paymentagent_list',
    'platform',
    'trading_platform_available_accounts',
    'trading_platform_accounts',
    'statement',
    'landing_company_details',
    'contracts_for',
    'residence_list',
    'account_security',
    'p2p_advertiser_info',
    'platform',
    'history', // only response, there is no `history` type but instead it is response type
];

const log = (measures = [], is_bot_running) => {
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

    sendRequestsStatistic = is_bot_running => {
        REQUESTS.forEach(req_type => {
            const measure = performance.getEntriesByName(req_type);
            if (measure && measure.length) {
                log(measure, is_bot_running, req_type);
            }
        });
        performance.clearMeasures();
    };

    addGlobalMethod() {
        if (window) window.sendRequestsStatistic = this.sendRequestsStatistic;
    }
}

export default APIMiddleware;
