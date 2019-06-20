import 'babel-polyfill';
import 'promise-polyfill';
import '_common/lib/polyfills/nodelist.foreach';
import '_common/lib/polyfills/element.closest';
import { checkNewRelease } from '_common/check_new_release';
import registerServiceWorker from 'Utils/pwa';

// used by gtm to update page after a new release
window.check_new_release = checkNewRelease;

import 'event-source-polyfill';
import '_common/lib/plugins';

registerServiceWorker();
import App from 'App/App.jsx';
