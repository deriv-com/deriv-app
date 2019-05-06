const defaultRedirectUrl = require('./client').defaultRedirectUrl;
const isLoggedIn         = require('./client').isLoggedIn;
const getElementById     = require('../../_common/common_functions').getElementById;
const getLanguage        = require('../../_common/language').get;
const State              = require('../../_common/storage').State;
const Url                = require('../../_common/url');
const applyToAllElements = require('../../_common/utility').applyToAllElements;
const createElement      = require('../../_common/utility').createElement;
const findParent         = require('../../_common/utility').findParent;
require('custom-event-polyfill');

const BinaryPjax = (() => {
    let previous_url;

    const params   = {};
    const cache    = {};

    const init = (container, content_selector) => {
        if (!(window.history && window.history.pushState && window.history.replaceState &&
            // pushState isn't reliable on iOS until 5.
            !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/))) {
            return;
        }

        if (!container || !content_selector) {
            return;
        }

        params.container        = container;
        params.content_selector = content_selector;

        const url     = window.location.href;
        const title   = document.title;
        const content = container.querySelector(content_selector);

        // put current content to cache, so we won't need to load it again
        if (content) {
            window.history.replaceState({ url }, title, url);
            setDataPage(content, url);
            params.container.dispatchEvent(new CustomEvent('binarypjax:after', { detail: content }));
        }

        applyToAllElements('a', (el) => { el.addEventListener('click', handleClick); }, '', getElementById('all-accounts'));
        document.addEventListener('click', handleClick);
        window.addEventListener('popstate', handlePopstate);

        // IE11 PopState
        if (!!window.MSInputMethodContext && !!document.documentMode) {
            window.onhashchange = handlePopstate;
        }
    };

    const setDataPage = (content, url) => {
        content.setAttribute('data-page', url.match(/.+\/(.+)\.html.*/)[1]);
    };

    const handleClick = (event) => {
        const link = findParent(event.target, 'a');
        if (!link) {
            return;
        }

        const url = link.href;
        if (!url) {
            return;
        }

        // Exclude links having 'no-ajax' class or target="_blank" or not html
        if (link.classList.contains('no-ajax') || link.target === '_blank' || !/\.html/i.test(url)) {
            return;
        }

        // Middle click, cmd click, and ctrl click should open links in a new tab as normal
        if (event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        // Ignore cross origin links
        if (location.protocol !== link.protocol || location.hostname !== link.hostname) {
            return;
        }

        // Ignore event with default prevented
        if (event.defaultPrevented) {
            return;
        }

        // browse a page in another section // TODO: uncomment when split the release process
        // if (Url.getSection() !== Url.getSection(url)) {
        //     return;
        // }

        event.preventDefault();
        // check if url is not same as current or if url has `anchor` query
        if (location.href !== url || Url.paramsHash().anchor) {
            processUrl(url);
        } else {
            $.scrollTo('body', 500);
        }

        // workaround to remove non-error notification msg for chrome bug where users logout from different browser window
        const msg_notification_el = getElementById('msg_notification');
        if (!isLoggedIn() && !msg_notification_el.classList.contains('error')) {
            msg_notification_el.setVisibility(0);
        }
    };

    const processUrl = (url, replace) => {
        State.set('is_loaded_by_pjax', true);

        const complete_url = /^http/i.test(url) ? url : Url.urlFor(url);

        const cached_content = cacheGet(complete_url);
        if (cached_content) {
            replaceContent(complete_url, cached_content, replace);
        } else {
            load(complete_url, replace);
        }
    };

    /**
     * Load url from server
     */
    const load = (url, replace) => {
        const lang  = getLanguage();
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState !== 4 || this.status !== 200) {
                return;
            }
            const div    = createElement('div', { html: this.responseText });
            const result = { content: div.querySelector(params.content_selector) };

            const title = div.getElementsByTagName('title')[0];
            if (title) {
                result.title = title.textContent.trim();
            }

            // If failed to find title or content, load the page in traditional way
            if (!result.title || !result.content) {
                locationReplace(url);
                return;
            }

            setDataPage(result.content, url);
            cachePut(url, result);
            replaceContent(url, result, replace);
        };

        xhttp.open('GET', url.replace(new RegExp(`/${lang}/`, 'i'), `/${lang.toLowerCase()}/pjax/`), true);
        xhttp.send();
    };

    const handlePopstate = (e) => {
        const url = e.state && e.state.url ? e.state.url         // eslint-disable-line no-nested-ternary
            : window.location.href;
        if (url) {
            processUrl(url, true);
        } else {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        return false;
    };

    const createEventWithPolyfill = (event_name) => {
        let event;
        if (typeof Event === 'function') {
            event = new Event(event_name);
        } else {
            // IE11
            event = document.createEvent('HTMLEvents');
            event.initEvent(event_name, true, true);
        }

        return event;
    };

    const replaceContent = (url, content, replace) => {
        previous_url = window.location.href;
        window.history[replace ? 'replaceState' : 'pushState']({ url }, content.title, url);

        params.container.dispatchEvent(createEventWithPolyfill('binarypjax:before'));

        document.title = content.title;
        const content_selector = params.container.querySelector(params.content_selector);
        if (content_selector) {
            content_selector.remove();
        }
        $(params.container).append($(content.content).clone());

        params.container.dispatchEvent(new CustomEvent('binarypjax:after', { detail: content.content }));

        const query_params = Url.paramsHash();
        if (!query_params.anchor) {
            $.scrollTo('body', 500);
        }
    };

    const cachePut = (url, content) => {
        cache[cleanUrl(url)] = content;
    };

    const cacheGet = url => cache[cleanUrl(url)];

    const cleanUrl = url => url.replace(/(\?|#).*$/, '');

    const locationReplace = (url) => {
        window.history.replaceState(null, '', url);
        window.location.replace(url);
    };

    const loadPreviousUrl = () => {
        if (window.location.href === previous_url) {
            previous_url = '';
        }
        processUrl(previous_url || defaultRedirectUrl());
    };

    return {
        init,
        loadPreviousUrl,

        load          : processUrl,
        getPreviousUrl: () => previous_url,
    };
})();

module.exports = BinaryPjax;
