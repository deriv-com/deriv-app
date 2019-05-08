const urlLang       = require('./language').urlLang;
const createElement = require('./utility').createElement;

const Crowdin = (() => {
    /**
     * in-context translation provided at: https://staging.binary.com/translations/
     * and uses 'ach' as pseudo language code
     */
    const isInContextEnvironment = () => (
        /^https:\/\/staging\.binary\.com\/translations\//i.test(window.location.href) &&
        /ach/i.test(urlLang())
    );

    /**
     * initialize Crowdin in-context environment
     */
    const init = () => {
        if (isInContextEnvironment()) {
            const lang = document.querySelector('#topbar ul[id$="_language"]');
            if (lang) lang.setVisibility(0);
            /* eslint-disable no-underscore-dangle */
            window._jipt = [];
            window._jipt.push(['project', 'binary-static']);
            /* eslint-enable no-underscore-dangle */
            if (document.body) {
                document.body.appendChild(createElement('script', { type: 'text/javascript', src: `${document.location.protocol}//cdn.crowdin.com/jipt/jipt.js` }));
            }
        }
    };

    return {
        init,
        isInContext: isInContextEnvironment,
    };
})();

module.exports = Crowdin;
