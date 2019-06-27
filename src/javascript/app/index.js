import 'babel-polyfill';
import 'promise-polyfill';

import initApp             from './App/app';
import registerServiceWorker from './Utils/pwa';

registerServiceWorker();
initApp();
