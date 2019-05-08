const defaultRedirectUrl = require('./client').defaultRedirectUrl;
const Url                = require('../../_common/url');

const Redirect = (() => {
    const onLoad = () => {
        const actions_map = {
            signup                : { path: 'new_account/virtualws' },
            reset_password        : { path: 'user/reset_passwordws' },
            payment_withdraw      : { path: 'cashier/forwardws', query: 'action=withdraw' },
            payment_agent_withdraw: { path: 'paymentagent/withdrawws' },
            mt5_password_reset    : { path: 'user/metatrader' },
        };

        const params = Url.paramsHash();
        const config = actions_map[params.action];
        // need to redirect not using pjax
        window.location.href = config && params.code ?
            `${Url.urlFor(config.path, config.query, params.lang || '')}#token=${params.code}` :
            defaultRedirectUrl();
    };

    return {
        onLoad,
    };
})();

module.exports = Redirect;
