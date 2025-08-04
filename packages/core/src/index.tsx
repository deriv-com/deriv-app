/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import ReactDOM from 'react-dom';

import { checkAndSetEndpointFromUrl } from '@deriv/shared';
import { getActiveAccounts, isTmbEnabled } from '@deriv/utils';

import App from 'App/app.jsx';
import initStore from 'App/initStore';
import { AnalyticsInitializer } from 'Utils/Analytics';
// eslint-disable-next-line
import registerServiceWorker from 'Utils/pwa';

import AppNotificationMessages from './App/Containers/app-notification-messages.jsx';

import 'promise-polyfill';

AnalyticsInitializer();

const hostname = window.location.hostname;
if (
    !!window?.localStorage.getItem?.('debug_service_worker') || // To enable local service worker related development
    (!hostname.startsWith('localhost') && !/binary\.sx/.test(hostname)) ||
    hostname === 'deriv-app.binary.sx'
) {
    registerServiceWorker();
}

const has_endpoint_url = checkAndSetEndpointFromUrl();

// if has endpoint url, APP will redirect
if (!has_endpoint_url) {
    const initApp = async () => {
        const is_tmb_enabled = await isTmbEnabled();
        const accounts = await getActiveAccounts();
        const root_store = is_tmb_enabled
            ? initStore(AppNotificationMessages, accounts)
            : initStore(AppNotificationMessages);

        const wrapper = document.getElementById('deriv_app');
        if (wrapper) {
            ReactDOM.render(<App useSuspense={false} root_store={root_store} />, wrapper);
        }
    };

    initApp();
}
