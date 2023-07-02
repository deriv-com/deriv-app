/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import ReactDOM from 'react-dom';
import React from 'react';
import 'babel-polyfill';
import 'promise-polyfill';
// eslint-disable-next-line
import registerServiceWorker from 'Utils/pwa';
import initStore from 'App/initStore';
import App from 'App/app.jsx';
import { checkAndSetEndpointFromUrl } from '@deriv/shared';
import AppNotificationMessages from './App/Containers/app-notification-messages.jsx';
import './Utils/Datadog'; // to enable datadog
import semver from 'semver';
import { browserName, browserVersion } from 'react-device-detect';

type TBrowsers =
    | 'Chrome'
    | 'Edge'
    | 'Firefox'
    | 'Opera'
    | 'Safari'
    | 'Chrome Android'
    | 'Firefox Android'
    | 'Opera Android'
    | 'Safari iOS'
    | 'Samsung Internet'
    | 'WebView Android'
    | 'MobileSafari'
    | 'SamsungBrowser';

type TBrowserVersions = { [k in TBrowsers]: string };

const browsers_minimum_required_version: TBrowserVersions = {
    Chrome: '40.0.0',
    Edge: '17.0.0',
    Safari: '11.1.0',
    Firefox: '44.0.0',
    Opera: '27.0.0',
    'Chrome Android': '40.0.0',
    'Firefox Android': '44.0.0',
    'Opera Android': '27.0.0',
    'Safari iOS': '11.3.0',
    'Samsung Internet': '4.0.0',
    'WebView Android': '40.0.0',
    MobileSafari: '11.3.0',
    SamsungBrowser: '4.0.0',
};

const user_browser = {
    name: browserName,
    version: semver.coerce(browserVersion)?.version || '0.0.0',
};

const can_register_sw =
    typeof browsers_minimum_required_version[user_browser.name] !== 'undefined' &&
    semver.gt(user_browser.version, browsers_minimum_required_version[user_browser.name]);

if (
    can_register_sw &&
    (!!window?.localStorage.getItem?.('debug_service_worker') || // To enable local service worker related development
        (!window.location.hostname.startsWith('localhost') && !/binary\.sx/.test(window.location.hostname)) ||
        window.location.hostname === 'deriv-app.binary.sx')
) {
    registerServiceWorker();
}
const has_endpoint_url = checkAndSetEndpointFromUrl();

// if has endpoint url, APP will be redirected
if (!has_endpoint_url) {
    const root_store = initStore(AppNotificationMessages);

    const wrapper = document.getElementById('deriv_app');
    if (wrapper) {
        ReactDOM.render(<App useSuspense={false} root_store={root_store} />, wrapper);
    }
}
