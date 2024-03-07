import { datadogRum } from '@datadog/browser-rum';

const DATADOG_APP_ID = process.env.DATADOG_APPLICATION_ID ?? '';
const DATADOG_CLIENT_TOKEN = process.env.DATADOG_CLIENT_TOKEN ?? '';
const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

function getAcct1Value(url: string) {
    const start = url.indexOf('acct1=') + 6; // 6 is the length of 'acct1='
    const end = url.indexOf('&', start); // Find the end of the parameter value
    if (end === -1) {
        return url.substring(start); // If there's no '&' after acct1, get the substring from start to the end
    }
    return url.substring(start, end); // Get the substring between 'acct1=' and the '&'
}

let dataDogSessionSampleRate = 0;
let dataDogSessionReplaySampleRate = 0;
let dataDogVersion = '';
let dataDogEnv = '';
let serviceName = '';

if (isProduction) {
    serviceName = 'app.deriv.com';
    dataDogVersion = `deriv-app-${process.env.REF_NAME}`;
    dataDogSessionReplaySampleRate = +process.env.DATADOG_SESSION_REPLAY_SAMPLE_RATE! ?? 1;
    dataDogSessionSampleRate = +process.env.DATADOG_SESSION_SAMPLE_RATE! ?? 10;
    dataDogEnv = 'production';
} else if (isStaging) {
    serviceName = 'staging-app.deriv.com';
    dataDogVersion = `deriv-app-staging-v${process.env.REF_NAME}`;
    dataDogSessionReplaySampleRate = 100;
    dataDogSessionSampleRate = 100;
    dataDogEnv = 'staging';
}
// we do it in order avoid error "application id is not configured, no RUM data will be collected"
// for test-links where application ID has not been configured and therefore RUM data will not be collected
if (isProduction || isStaging) {
    datadogRum.init({
        applicationId: isStaging || isProduction ? DATADOG_APP_ID : '',
        clientToken: isStaging || isProduction ? DATADOG_CLIENT_TOKEN : '',
        site: 'datadoghq.com',
        service: serviceName,
        env: dataDogEnv,
        sessionSampleRate: dataDogSessionSampleRate,
        sessionReplaySampleRate: dataDogSessionReplaySampleRate,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input',
        version: dataDogVersion,
        trackFrustrations: true,
        enableExperimentalFeatures: ['clickmap'],
        beforeSend: event => {
            if (event.type === 'resource') {
                event.resource.url = event.resource.url.replace(
                    /^https:\/\/api.telegram.org.*$/,
                    'telegram token=REDACTED'
                );

                if (event.resource.url.match(/^https:\/\/eu.deriv.com\/ctrader-login.*$/)) {
                    const url = event.resource.url;
                    const accnt = getAcct1Value(url);
                    event.resource.url = event.resource.url.replace(
                        /^https:\/\/eu.deriv.com\/ctrader-login.*$/,
                        `https://eu.deriv.com/ctrader-login?acct1=${accnt}&token1=redacted`
                    );
                }
            }
        },
    });
}
