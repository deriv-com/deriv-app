require('babel-polyfill');
require('promise-polyfill');
require('./_common/lib/polyfills/nodelist.foreach');
require('./_common/lib/polyfills/element.closest');

// used by gtm to update page after a new release
window.check_new_release = require('./_common/check_new_release').checkNewRelease;

require('event-source-polyfill');
require('./_common/lib/plugins');
