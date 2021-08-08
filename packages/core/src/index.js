import 'babel-polyfill';
import 'promise-polyfill';
import registerServiceWorker from 'Utils/pwa';

import 'event-source-polyfill';

if (
    !!window?.localStorage.getItem?.('debug_service_worker') || // To enable local service worker related development
    !window.location.hostname.startsWith('localhost')

    /** && !/binary\.sx/.test(window.location.hostname)) ||
    window.location.hostname === 'deriv-app.binary.sx' */ // TODO: this one should revert to the original one.
) {
    registerServiceWorker();
}

// eslint-disable-next-line
import App from 'App/app.jsx';
