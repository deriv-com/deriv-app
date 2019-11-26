const Pushwoosh           = require('web-push-notifications').Pushwoosh;
const Client              = require('../base/client_base');
const { getLanguage }     = require('deriv-translations');
const urlForCurrentDomain = require('../url').urlForCurrentDomain;
const isProduction        = require('../../config').isProduction;

const BinaryPushwoosh = (() => {
    const pw = new Pushwoosh();

    let initialised = false;

    const init = () => {
        if (!isProduction()) return;

        if (!initialised) {
            pw.push(['init', {
                logLevel                : 'error', // or info or debug
                applicationCode         : 'D04E6-FA474',
                safariWebsitePushID     : 'web.com.binary',
                defaultNotificationTitle: 'Deriv',
                defaultNotificationImage: urlForCurrentDomain('https://style.binary.com/images/logo/logomark.png'),
            }]);
            initialised = true;
            sendTags();
        }
    };

    const sendTags = () => {
        pw.push((api) => {
            api.getTags().then((result) => {
                if (!result.result['Login ID'] || !result.result['Site Language']) {
                    // send login id and site language
                    return api.setTags({
                        'Login ID'     : Client.get('loginid'),
                        'Site Language': getLanguage(),
                    });
                }
                return null;
            }).catch(e => {
                return; // do nothing
            });
        });
    };

    return {
        init,
    };
})();

module.exports = BinaryPushwoosh;
