const DerivAPIBasic    = require('deriv-api/dist/DerivAPIBasic');
const website_name     = require('App/Constants/app-config').website_name;
const ClientBase       = require('./client_base');
const SocketCache      = require('./socket_cache');
const { State }        = require('../storage');
const getLanguage      = require('../language').get;
const {
    cloneObject,
    getPropertyValue,
} = require('../utility');
const getAppId         = require('../../config').getAppId;
const getSocketURL     = require('../../config').getSocketURL;

/*
 * An abstraction layer over native javascript WebSocket,
 * which provides additional functionality like
 * reopen the closed connection and process the buffered requests
 */
const BinarySocketBase = (() => {
    let deriv_api;

    let config               = {};
    let wrong_app_id         = 0;
    let is_available         = true;
    let is_disconnect_called = false;
    let is_connected_before  = false;

    const timeouts     = {};

    const clearTimeouts = () => {
        Object.keys(timeouts).forEach((key) => {
            clearTimeout(timeouts[key]);
            delete timeouts[key];
        });
    };

    const isReady = () => hasReadyState(1);

    const isClose = () => !deriv_api || hasReadyState(2, 3);

    const hasReadyState = (...states) => deriv_api && states.some(s => deriv_api.connection.readyState === s);

    const init = (options) => {
        if (wrong_app_id === getAppId()) {
            return;
        }
        if (typeof options === 'object' && config !== options) {
            config         = options;
        }
        clearTimeouts();
        config.wsEvent('init');

        if (isClose()) {
            deriv_api = new DerivAPIBasic({
                endpoint: getSocketURL(),
                app_id  : getAppId(),
                lang    : getLanguage(),
                brand   : website_name.toLowerCase(),
                storage : SocketCache,
            });
        }

        deriv_api.onOpen().subscribe(() => {
            config.wsEvent('open');
            if (ClientBase.isLoggedIn()) {
                deriv_api.authorize(ClientBase.get('token'));
            }

            if (typeof config.onOpen === 'function') {
                config.onOpen(isReady());
            }

            if (typeof config.onReconnect === 'function' && is_connected_before) {
                config.onReconnect();
            }

            if (!is_connected_before) {
                is_connected_before = true;
            }
        });

        deriv_api.onMessage().subscribe(({ data: response }) => {
            const msg_type = response.msg_type;
            State.set(['response', msg_type], cloneObject(response));

            config.wsEvent('message');

            if (getPropertyValue(response, ['error', 'code']) === 'InvalidAppID') {
                wrong_app_id = getAppId();
            }

            if (typeof config.onMessage === 'function') {
                config.onMessage(response);
            }
        });

        deriv_api.onClose().subscribe(() => {
            clearTimeouts();
            config.wsEvent('close');

            if (wrong_app_id !== getAppId() && typeof config.onDisconnect === 'function' && !is_disconnect_called) {
                config.onDisconnect();
                is_disconnect_called = true;
            }
        });
    };

    const availability = (status) => {
        if (typeof status !== 'undefined') {
            is_available = !!status;
        }
        return is_available;
    };

    // Delegate error handling to the callback
    const promiseRejectToResolve = promise => new Promise((r) => {
        promise.then(r, r);
    });

    const send = (request, options = {}) => {
        const promise = promiseRejectToResolve(deriv_api.send(request));

        config.wsEvent('send');

        if (options.callback) {
            promise.then(options.callback);
        }

        return promise;
    };

    const excludeAuthorize = type => !(type === 'authorize' && !ClientBase.isLoggedIn());

    const expectResponse = (...responses) =>
        deriv_api.expectResponse(...responses.filter(excludeAuthorize));

    const subscribe = (request, cb) =>
        deriv_api.subscribe(request).subscribe(cb, cb); // Delegate error handling to the callback

    const subscribeBalance = (cb) => subscribe({ balance: 1 }, cb);

    const subscribeProposal = (req, cb) => subscribe({ proposal: 1, ...req }, cb);

    const subscribeProposalOpenContract = (contract_id = null, cb) =>
        subscribe({ proposal_open_contract: 1, ...(contract_id && { contract_id }) }, cb);

    const subscribeTicks = (symbol, cb) => subscribe({ ticks: symbol }, cb);

    const subscribeTicksHistory = (request_object, cb) => subscribe(request_object, cb);

    const subscribeTransaction = (cb) => subscribe({ transaction: 1 }, cb);

    const subscribeWebsiteStatus = (cb) => subscribe({ website_status: 1 }, cb);

    const buy = (proposal_id, price) =>
        send({ buy: proposal_id, price });

    const sell = (contract_id, bid_price) =>
        send({ sell: contract_id, price: bid_price });

    const cashier = (action, verification_code) =>
        send({ cashier: action, ...(verification_code && { verification_code }) });

    const newAccountVirtual = (verification_code, client_password, residence, device_data) =>
        send({
            new_account_virtual: 1,
            verification_code,
            client_password,
            residence,
            ...device_data,
        });

    const profitTable = (limit, offset, date_boundaries) =>
        send({ profit_table: 1, description: 1, limit, offset, ...date_boundaries });

    const statement = (limit, offset, date_boundaries) =>
        send({ statement: 1, description: 1, limit, offset, ...date_boundaries });

    const verifyEmail = (email, type) =>
        send({ verify_email: email, type });

    const activeSymbols = () =>
        promiseRejectToResolve(deriv_api.storage.activeSymbols('brief'));

    const payoutCurrencies = async () => {
        await expectResponse('authorize');
        return deriv_api.payoutCurrencies();
    };

    const forgetStream = (id) =>
        promiseRejectToResolve(deriv_api.forget(id));

    return {
        init,
        send,
        forgetStream,
        expectResponse,
        clearTimeouts,
        availability,
        hasReadyState,
        clear             : () => {},
        sendBuffered      : () => {},
        get               : () => deriv_api,
        setOnDisconnect   : (onDisconnect) => { config.onDisconnect = onDisconnect; },
        setOnReconnect    : (onReconnect) => { config.onReconnect = onReconnect; },
        removeOnReconnect : () => { delete config.onReconnect; },
        removeOnDisconnect: () => { delete config.onDisconnect; },
        buy,
        sell,
        cashier,
        newAccountVirtual,
        profitTable,
        statement,
        verifyEmail,
        activeSymbols,
        payoutCurrencies,
        subscribeBalance,
        subscribeProposal,
        subscribeProposalOpenContract,
        subscribeTicks,
        subscribeTicksHistory,
        subscribeTransaction,
        subscribeWebsiteStatus,
    };
})();

const proxied_socket_base = new Proxy(BinarySocketBase, {
    get(target, field) {
        if (target[field]) return target[field];

        const api = target.get();
        if (!api) return undefined;

        if (api[field]) return api[field].bind(api);

        return undefined;
    },
});

module.exports = proxied_socket_base;
