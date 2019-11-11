import 'babel-polyfill';
import 'promise-polyfill';
import registerServiceWorker from 'Utils/pwa';

import 'event-source-polyfill';

if (!window.location.hostname.startsWith('localhost') && !/binary\.sx/.test(window.location.hostname)) {
    registerServiceWorker();
}

// eslint-disable-next-line
import App from 'App/app.jsx';
