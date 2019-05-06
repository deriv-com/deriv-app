const LimitsInit   = require('./limits.init');
const BinarySocket = require('../../../../../base/socket');

const Limits = (() => {
    const onLoad = () => {
        BinarySocket.wait('get_account_status').then((response_get_account_status) => {
            BinarySocket.send({ get_limits: 1 }).then((response) => {
                if (response.error) {
                    LimitsInit.limitsError(response.error);
                } else {
                    BinarySocket.send({ active_symbols: 'brief' }).then((response_active_symbols) => { // this is to get localized texts for the name of the market_specific limits
                        LimitsInit.limitsHandler(response, response_get_account_status, response_active_symbols);
                    });
                }
            });
        });
    };

    const onUnload = () => {
        LimitsInit.clean();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Limits;
