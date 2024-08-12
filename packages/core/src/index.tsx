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
import { AnalyticsInitializer } from 'Utils/Analytics';

let eventQueue = [];

const queueEvent = event => {
    eventQueue.push(event);
    localStorage.setItem('pending_events', JSON.stringify(eventQueue));
};

const sendEventToAnalytics = event => {
    console.log('Sending event:', event);
};

const loadPendingEvents = () => {
    const storedEvents = localStorage.getItem('pending_events');
    if (storedEvents) {
        eventQueue = JSON.parse(storedEvents);
    }
};

const initializeAnalytics = async () => {
    try {
        await AnalyticsInitializer();
        console.log('analytics loaded');

        if (eventQueue.length > 0) {
            eventQueue.forEach(event => {
                sendEventToAnalytics(event);
            });

            eventQueue = [];
            localStorage.removeItem('pending_events');
        }
    } catch (error) {
        console.error('Analytics failed to load', error);
    }
};

console.log('before calling analytics');
loadPendingEvents();
initializeAnalytics();
console.log('after calling analytics');

if (
    !!window?.localStorage.getItem?.('debug_service_worker') ||
    (!window.location.hostname.startsWith('localhost') && !/binary\.sx/.test(window.location.hostname)) ||
    window.location.hostname === 'deriv-app.binary.sx'
) {
    registerServiceWorker();
}

const has_endpoint_url = checkAndSetEndpointFromUrl();

if (!has_endpoint_url) {
    const root_store = initStore(AppNotificationMessages);

    const wrapper = document.getElementById('deriv_app');
    if (wrapper) {
        ReactDOM.render(<App useSuspense={false} root_store={root_store} />, wrapper);
    }
}
