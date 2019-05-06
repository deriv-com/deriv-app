/* eslint-disable no-unused-vars */
// Check view width, add navbar height as offset if on desktop
function checkWidth() {
    const mq = window.matchMedia('(max-width: 1199px)');
    return (mq.matches ? 50 : (document.getElementById('navigation') || '').scrollHeight);
}

function toggleMobileMenu() {
    const toggleButton = document.getElementById('toggle-menu');
    if (!toggleButton) return;
    const navbar       = document.getElementById('navigation');
    const navbar_item  = document.getElementsByClassName('navbar-collapse')[0];
    const el_language_dropdown = document.getElementsByClassName('language-dropdown')[0];
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        navbar.classList.toggle('expand');
        navbar_item.classList.toggle('expand');
        if (el_language_dropdown && /show/.test(el_language_dropdown.classList)) {
            toggleAllSiblings(el_language_dropdown.parentNode, filterById, 'invisible');
            el_language_dropdown.classList.remove('show');
        }
    });
}

function collapseMenu() {
    const navbar      = document.getElementById('navigation');
    const navbar_item = document.getElementsByClassName('navbar-collapse')[0];
    if (navbar && navbar_item) {
        navbar.classList.remove('expand');
        navbar_item.classList.remove('expand');
    }
}

// scrollTo function with animation
// - Gist reference: https://gist.github.com/andjosh/6764939
function scrollTo(to, duration = 1000) {
    if (typeof to === 'undefined') return;
    const start     = window.pageYOffset;
    const change    = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
        currentTime += increment;
        const val = Math.easeInOutQuad(currentTime, start, change, duration);
        document.body.scrollTop = val;
        document.documentElement.scrollTop = val;
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

Math.easeInOutQuad = function(current_time, start_value, change_in_value, duration) {
    let curr_time = current_time;
    curr_time /= duration / 2;
    if (curr_time < 1) return change_in_value / 2 * curr_time * curr_time + start_value;
    curr_time--;
    return -change_in_value / 2 * (curr_time * (curr_time - 2) - 1) + start_value;
};

function getParamValue(url, key) {
    const regex   = new RegExp(`[?&]${key}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results || !results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function allLanguages() {
    return [ 'en', 'de', 'es', 'fr', 'id', 'it', 'ko', 'pl', 'pt', 'ru', 'th', 'vi', 'zh_cn', 'zh_tw', 'ach' ];
}

function getLanguage() {
    let language;
    window.location.href.toLowerCase().split('/').slice(3).forEach((l) => { // forEach() has more browser compatibility than 'Array.find()'
        if (!language && allLanguages().indexOf(l) >= 0) language = l;
    });
    return language || 'en';
}

function urlFor(path) {
    const lang = getLanguage();
    const url  = window.location.href;
    return `${url.substring(0, url.indexOf(`/${lang}/`) + lang.length + 2)}${path}.html`;
}

function wsConnect() {
    const config_server = localStorage.getItem('config.server_url');
    const server_url    = config_server || 'frontend.binaryws.com';
    endpointNotification(config_server);

    return new WebSocket(`wss://${server_url}/websockets/v3?app_id=${getAppId()}&l=${getLanguage()}`);
}

function isBinaryApp() {
    return (/desktop-app/i.test(window.location.href) || localStorage.getItem('config.is_desktop_app'));
}

function getAppId() {
    if (localStorage.getItem('config.app_id')) {
        return localStorage.getItem('config.app_id');
    }
    if (isBinaryApp()) {
        return '14473';
    }
    if (/staging\.binary\.com/i.test(window.location.hostname)) {
        return '1098';
    }
    return '1';
}

function wsSend(ws, request) {
    if (ws && request && typeof request === 'object') {
        ws.send(JSON.stringify(request));
    }
}

function endpointNotification (config_server) {
    if (config_server && config_server.length > 0 && !document.getElementById('end_note')) {
        const el_end_note = document.createElement('div');
        el_end_note.setAttribute('id', 'end_note');
        el_end_note.innerHTML = `The server <a href="${urlFor('endpoint')}">endpoint</a> is: ${config_server}`;
        document.body.appendChild(el_end_note);
        document.body.style['padding-bottom'] = `${el_end_note.offsetHeight}px`;
    }
}

// NodeList foreach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg = window) {
        for (let i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

function filterById(elem) {
    return !((/^(language)$/i.test(elem.id)));
}

function toggleAllSiblings(elem, filter, class_name) {
    let el = elem.parentNode.firstChild;
    do {
        if (el.nodeType !== 3 && (!filter || filter(el))) {
            el.classList.toggle(class_name);
        }
        el = el.nextSibling;
    } while (el);
}

function setupCrowdin() {
    const isInContextEnvironment = () => (
        /^https:\/\/staging\.binary\.com\/translations\//i.test(window.location.href) &&
            /ach/i.test(getLanguage())
    );

    if (isInContextEnvironment()) {
        const el_lang = document.getElementById('language');
        if (el_lang) el_lang.style.display = 'none';
        /* eslint-disable no-underscore-dangle */
        window._jipt = [];
        window._jipt.push(['project', 'binary-static']);
        /* eslint-enable no-underscore-dangle */
        if (document.body) {
            const crowdinScript = document.createElement('script');
            crowdinScript.setAttribute('src', `${document.location.protocol}//cdn.crowdin.com/jipt/jipt.js`);
            crowdinScript.setAttribute('type', 'text/javascript');
            document.body.appendChild(crowdinScript);
        }
    }
}

function commonOnload() {
    setupCrowdin();
    dataLayer.push({ event: 'page_load' });
}

// displays notification on outdated browsers
function outdatedBrowser() {
    const src = '//browser-update.org/update.min.js';
    if (document.querySelector(`script[src*="${src}"]`)) return;
    const el_message = document.getElementById('outdated_browser_message');
    const message = el_message ? el_message.innerHTML : 'Your web browser ({brow_name}) is out of date and may affect your trading experience. Proceed at your own risk. <a href="https://www.whatbrowser.org/" target="_blank">Update browser</a>';
    window.$buoop = {
        vs      : { i: 11, f: -4, o: -4, s: 9, c: -4 },
        api     : 4,
        url     : 'https://whatbrowser.org/',
        noclose : true, // Do not show the 'ignore' button to close the notification
        text    : message,
        reminder: 0, // show all the time
    };
    if (document.body) {
        const script = document.createElement('script');
        script.setAttribute('src', src);
        document.body.appendChild(script);
    }
}

window.addEventListener('load', () => { // being called before js code of each page
    outdatedBrowser();
});
