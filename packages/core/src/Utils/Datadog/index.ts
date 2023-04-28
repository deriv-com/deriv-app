import { datadogRum } from '@datadog/browser-rum';

const DATADOG_APP_ID = process.env.DATADOG_APPLICATION_ID ?? '';
const DATADOG_CLIENT_TOKEN = process.env.DATADOG_CLIENT_TOKEN ?? '';
const DATADOG_SESSION_SAMPLE_RATE = process.env.DATADOG_SESSION_SAMPLE_RATE ?? 10;
const DATADOG_SESSION_REPLAY_SAMPLE_RATE = process.env.DATADOG_SESSION_REPLAY_SAMPLE_RATE ?? 1;

datadogRum.init({
    applicationId: DATADOG_APP_ID,
    clientToken: DATADOG_CLIENT_TOKEN,
    site: 'datadoghq.com',
    service: 'deriv.com',
    env: 'production',
    sessionSampleRate: +DATADOG_SESSION_SAMPLE_RATE,
    sessionReplaySampleRate: +DATADOG_SESSION_REPLAY_SAMPLE_RATE,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
    version: '1.0.0',
    trackFrustrations: true,
    enableExperimentalFeatures: ['clickmap'],
});
datadogRum.startSessionReplayRecording();
