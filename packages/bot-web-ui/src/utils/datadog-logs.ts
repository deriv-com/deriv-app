import { datadogLogs } from '@datadog/browser-logs';
import { formatDate, formatTime } from '@deriv/shared';

/**
 * Initializes Datadog Logs for production or staging environments, conditionally based on environment variables.
 *
 * @param {boolean} is_datadog_enabled - The parameter to enable or disable datadog tracking.
 * @example initDatadogLogs(true);
 * @returns {void}
 * **/
const initDatadogLogs = (is_datadog_enabled: boolean) => {
    if (is_datadog_enabled) {
        if (window.DD_LOGS) {
            datadogLogs.setTrackingConsent('granted');
            return;
        }
    } else {
        if (window.DD_LOGS) {
            datadogLogs.setTrackingConsent('not-granted');
        }
        return;
    }
    const DATADOG_CLIENT_TOKEN_LOGS = process.env.DATADOG_CLIENT_TOKEN_LOGS ?? '';
    const isProduction = process.env.NODE_ENV === 'production';
    const isStaging = process.env.NODE_ENV === 'staging';
    let dataDogSessionSampleRate = 0;

    dataDogSessionSampleRate = Number(process.env.DATADOG_SESSION_SAMPLE_RATE_LOGS ?? 1);
    let dataDogVersion = '';
    let dataDogEnv = '';

    if (isProduction) {
        dataDogVersion = `deriv-app-${process.env.REF_NAME}`;
        dataDogEnv = 'production';
    } else if (isStaging) {
        dataDogVersion = `deriv-app-staging-v${formatDate(new Date(), 'YYYYMMDD')}-${formatTime(Date.now(), 'HH:mm')}`;
        dataDogEnv = 'staging';
    }

    if (isProduction || isStaging) {
        datadogLogs.init({
            clientToken: DATADOG_CLIENT_TOKEN_LOGS,
            site: 'datadoghq.com',
            forwardErrorsToLogs: false,
            service: 'Dbot',
            sessionSampleRate: dataDogSessionSampleRate,
            version: dataDogVersion,
            env: dataDogEnv,
        });
    }
};

export default initDatadogLogs;
