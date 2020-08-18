// const Cookies = require('js-cookie');

/*
 * Configuration values needed in js codes
 *
 * NOTE:
 * Please use the following command to avoid accidentally committing personal changes
 * git update-index --assume-unchanged src/javascript/config.js
 *
 */
const domain_app_ids = {
    // these domains as supported "production domains"
    'deriv.app': 16929, // TODO: [app-link-refactor] - Remove backwards compatibility for `deriv.app`
    'app.deriv.com': 16929,
};

const getCurrentProductionDomain = () =>
    !/^staging\./.test(window.location.hostname) &&
    Object.keys(domain_app_ids).find((domain) => new RegExp(`.${domain}$`, 'i').test(window.location.hostname));

const isProduction = () => {
    const all_domains = Object.keys(domain_app_ids).map((domain) => `(www\\.)?${domain.replace('.', '\\.')}`);
    return new RegExp(`^(${all_domains.join('|')})$`, 'i').test(window.location.hostname);
};

const binary_desktop_app_id = 14473;

const getAppId = () => {
    let app_id = null;
    const user_app_id = ''; // you can insert Application ID of your registered application here
    const config_app_id = window.localStorage.getItem('config.app_id');
    if (config_app_id) {
        app_id = config_app_id;
    } else if (/desktop-app/i.test(window.location.href) || window.localStorage.getItem('config.is_desktop_app')) {
        window.localStorage.removeItem('config.default_app_id');
        window.localStorage.setItem('config.is_desktop_app', 1);
        app_id = binary_desktop_app_id;
    } else if (user_app_id.length) {
        window.localStorage.setItem('config.default_app_id', user_app_id);
        app_id = user_app_id;
    } else if (
        /staging\.deriv\.app/i.test(window.location.hostname) || // TODO: [app-link-refactor] - Remove backwards compatibility for `deriv.app`
        /staging-app\.deriv\.com/i.test(window.location.hostname)
    ) {
        window.localStorage.removeItem('config.default_app_id');
        app_id = 16303; // it's being used in endpoint chrome extension - please do not remove
    } else if (/localhost/i.test(window.location.hostname)) {
        app_id = 17044;
    } else {
        window.localStorage.removeItem('config.default_app_id');
        const current_domain = getCurrentProductionDomain();
        app_id = domain_app_ids[current_domain] || 16929;
    }
    return app_id;
};

module.exports = {
    domain_app_ids,
    getCurrentProductionDomain,
    isProduction,
    getAppId,
};
