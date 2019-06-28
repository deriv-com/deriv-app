import 'babel-polyfill';
import 'promise-polyfill';
import '_common/lib/polyfills/nodelist.foreach';
import '_common/lib/polyfills/element.closest';
import registerServiceWorker from 'Utils/pwa';

import 'event-source-polyfill';
import '_common/lib/plugins';

// registerServiceWorker();
import App from 'App/App.jsx';
