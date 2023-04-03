import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { datadogRum } from '@datadog/browser-rum';

const DATADOG_APP_ID = process.env.DATADOG_APPLICATION_ID ? process.env.DATADOG_APPLICATION_ID : '';
const DATADOG_CLIENT_TOKEN = process.env.DATADOG_CLIENT_TOKEN ? process.env.DATADOG_CLIENT_TOKEN : '';

datadogRum.init({
    applicationId: DATADOG_APP_ID,
    clientToken: DATADOG_CLIENT_TOKEN,
    site: 'datadoghq.com',
    service: 'deriv.com-static-site',
    env: 'qa',
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
});

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "appstore", webpackPreload: true */ './components/app')),
    () => <Loading />
)();

export default App;
