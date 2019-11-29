const DerivAPIBasic    = require('@deriv/deriv-api/dist/DerivAPIBasic');
const ObjectUtils      = require('deriv-shared/utils/object');
const { getLanguage }  = require('deriv-translations');
const website_name     = require('App/Constants/app-config').website_name;
const ClientBase       = require('./client_base');
const SocketCache      = require('./socket_cache');
const APIMiddleware    = require('./api_middleware');
const { State }        = require('../storage');
const getAppId         = require('../../config').getAppId;
const getSocketURL     = require('../../config').getSocketURL;

/*
 * An abstraction layer over native javascript WebSocket,
 * which provides additional functionality like
 * reopen the closed connection and process the buffered requests
 */
const BinarySocketBase = (() => {
    let deriv_api,
        binary_socket,
        middleware;

    let config               = {};
    let wrong_app_id         = 0;
    let is_available         = true;
    let is_disconnect_called = false;
    let is_connected_before  = false;

    const socket_url = `wss://${getSocketURL()}/websockets/v3?app_id=${getAppId()}&l=${getLanguage()}&brand=${website_name.toLowerCase()}`;
    const timeouts        = {};

    const clearTimeouts = () => {
        Object.keys(timeouts).forEach((key) => {
            clearTimeout(timeouts[key]);
            delete timeouts[key];
        });
    };

    const isReady = () => hasReadyState(1);

    const isClose = () => !binary_socket || hasReadyState(2, 3);

    const hasReadyState = (...states) => binary_socket && states.some(s => binary_socket.readyState === s);

    const init = (options) => {
        if (wrong_app_id === getAppId()) {
            return;
        }
        if (typeof options === 'object' && config !== options) {
            config     = options;
            middleware = new APIMiddleware(config);
        }
        clearTimeouts();
        config.wsEvent('init');

        if (isClose()) {
            is_disconnect_called = false;
            binary_socket = new WebSocket(socket_url);
            deriv_api = new DerivAPIBasic({
                connection: binary_socket,
                storage   : SocketCache,
                middleware,
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
            State.set(['response', msg_type], ObjectUtils.cloneObject(response));

            config.wsEvent('message');

            if (ObjectUtils.getPropertyValue(response, ['error', 'code']) === 'InvalidAppID') {
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

    const excludeAuthorize = type => !(type === 'authorize' && !ClientBase.isLoggedIn());

    const wait = (...responses) =>
        deriv_api.expectResponse(...responses.filter(excludeAuthorize));

    const subscribe = (request, cb) =>
        deriv_api.subscribe(request).subscribe(cb, cb); // Delegate error handling to the callback

    const balanceAll = () => deriv_api.send({ balance: 1, account: 'all' });

    const subscribeBalanceAll = (cb) => subscribe({ balance: 1, account: 'all' }, cb);

    const subscribeProposal = (req, cb) => subscribe({ proposal: 1, ...req }, cb);

    const subscribeProposalOpenContract = (contract_id = null, cb) =>
        subscribe({ proposal_open_contract: 1, ...(contract_id && { contract_id }) }, cb);

    const subscribeTicks = (symbol, cb) => subscribe({ ticks: symbol }, cb);

    const subscribeTicksHistory = (request_object, cb) => subscribe(request_object, cb);

    const subscribeTransaction = (cb) => subscribe({ transaction: 1 }, cb);

    const subscribeWebsiteStatus = (cb) => subscribe({ website_status: 1 }, cb);

    const buyAndSubscribe = (request) => {
        return new Promise((resolve) => {
            let called = false;
            const subscriber = subscribe(request, response => {
                if (!called) {
                    called = true;
                    subscriber.unsubscribe();
                    resolve(response);
                }
            });
        });
    };

    const sell = (contract_id, bid_price) =>
        deriv_api.send({ sell: contract_id, price: bid_price });

    const cashier = (action, verification_code) =>
        deriv_api.send({ cashier: action, ...(verification_code && { verification_code }) });

    const newAccountVirtual = (verification_code, client_password, residence, device_data) =>
        deriv_api.send({
            new_account_virtual: 1,
            verification_code,
            client_password,
            residence,
            ...device_data,
        });

    const setAccountCurrency = (currency, passthrough) =>
        deriv_api.send({
            set_account_currency: currency,
            ...(passthrough && { passthrough }),
        });

    const newAccountReal = (values) =>
        deriv_api.send({
            new_account_real: 1,
            ...values,
        });

    const mt5NewAccount = (values) =>
        deriv_api.send({
            mt5_new_account: 1,
            ...values,
        });

    const mt5PasswordChange = (login, old_password, new_password, password_type, values) =>
        deriv_api.send({
            mt5_password_change: 1,
            login,
            old_password,
            new_password,
            password_type,
            ...values,
        });

    const profitTable = (limit, offset, date_boundaries) =>
        deriv_api.send({ profit_table: 1, description: 1, limit, offset, ...date_boundaries });

    const statement = (limit, offset, date_boundaries) =>
        deriv_api.send({ statement: 1, description: 1, limit, offset, ...date_boundaries });

    const verifyEmail = (email, type) =>
        deriv_api.send({ verify_email: email, type });

    const paymentAgentList = (country, currency) =>
        deriv_api.send({ paymentagent_list: country, ...(currency && { currency }) });

    const paymentAgentWithdraw = ({ loginid, currency, amount, verification_code }) =>
        deriv_api.send({
            amount,
            currency,
            verification_code,
            paymentagent_withdraw: 1,
            dry_run              : 0,
            paymentagent_loginid : loginid,
        });

    const paymentAgentTransfer = ({ amount, currency, description, transfer_to }) =>
        deriv_api.send({
            amount,
            currency,
            description,
            transfer_to,
            paymentagent_transfer: 1,
            dry_run              : 0,
        });

    const activeSymbols = (mode = 'brief') => deriv_api.activeSymbols(mode);

    const transferBetweenAccounts = (account_from, account_to, currency, amount) =>
        deriv_api.send({
            transfer_between_accounts: 1,
            accounts                 : 'all',
            ...(account_from && {
                account_from,
                account_to,
                currency,
                amount,
            }),
        });

    const forgetStream = (id) =>
        deriv_api.forget(id);

    const tncApproval = () =>
        deriv_api.send({ tnc_approval: '1' });

    return {
        init,
        forgetStream,
        wait,
        clearTimeouts,
        availability,
        hasReadyState,
        clear             : () => {},
        sendBuffered      : () => {},
        getSocket         : () => binary_socket,
        get               : () => deriv_api,
        setOnDisconnect   : (onDisconnect) => { config.onDisconnect = onDisconnect; },
        setOnReconnect    : (onReconnect) => { config.onReconnect = onReconnect; },
        removeOnReconnect : () => { delete config.onReconnect; },
        removeOnDisconnect: () => { delete config.onDisconnect; },
        cache             : delegateToObject({}, () => deriv_api.cache),
        storage           : delegateToObject({}, () => deriv_api.storage),
        buyAndSubscribe,
        sell,
        cashier,
        mt5NewAccount,
        mt5PasswordChange,
        newAccountVirtual,
        newAccountReal,
        profitTable,
        statement,
        verifyEmail,
        activeSymbols,
        paymentAgentList,
        paymentAgentWithdraw,
        paymentAgentTransfer,
        setAccountCurrency,
        balanceAll,
        subscribeBalanceAll,
        subscribeProposal,
        subscribeProposalOpenContract,
        subscribeTicks,
        subscribeTicksHistory,
        subscribeTransaction,
        subscribeWebsiteStatus,
        tncApproval,
        transferBetweenAccounts,
    };
})();

function delegateToObject(base_obj, extending_obj_getter) {
    return new Proxy(base_obj, {
        get(target, field) {
            if (target[field]) return target[field];

            const extending_obj = typeof extending_obj_getter === 'function'
                ? extending_obj_getter()
                : extending_obj_getter;

            if (!extending_obj) return undefined;

            const value = extending_obj[field];
            if (value) {
                if (typeof value === 'function') {
                    return value.bind(extending_obj);
                }
                return value;
            }

            return undefined;
        },
    });
}

const proxied_socket_base = delegateToObject(BinarySocketBase, () => BinarySocketBase.get());

const proxyForAuthorize = obj => new Proxy(obj, {
    get(target, field) {
        if (typeof target[field] !== 'function') {
            return proxyForAuthorize(target[field], proxied_socket_base[field]);
        }
        return (...args) => (
            BinarySocketBase.wait('authorize')
                .then(() => target[field](...args)));
    },
});

BinarySocketBase.authorized = proxyForAuthorize(proxied_socket_base);

module.exports = proxied_socket_base;
