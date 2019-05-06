window.$ = window.jQuery = require('jquery');

require('babel-polyfill');
require('promise-polyfill');
require('./_common/lib/polyfills/nodelist.foreach');
require('./_common/lib/polyfills/element.closest');

require('@binary-com/binary-style');
require('@binary-com/binary-style/binary.more');

// used by gtm to update page after a new release
window.check_new_release = require('./_common/check_new_release').checkNewRelease;

require('event-source-polyfill');
require('./_common/lib/jquery.sparkline.js');
require('./_common/lib/plugins');
require('jquery.scrollto');

const BinaryLoader = require('./app/base/binary_loader');

document.addEventListener('DOMContentLoaded', BinaryLoader.init);
$(window).on('pageshow', (e) => { // Safari doesn't fire load event when using back button
    if (e.originalEvent.persisted) {
        BinaryLoader.init();
    }
});
