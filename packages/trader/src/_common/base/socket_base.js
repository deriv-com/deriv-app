const DerivAPIBasic    = require('deriv-api/dist/DerivAPIBasic');
const ClientBase       = require('./client_base');
const SocketCache      = require('./socket_cache');
const getLanguage      = require('../language').get;
const getPropertyValue = require('../utility').getPropertyValue;
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
                brand   : 'deriv',
                storage : SocketCache,
            });
        }

        deriv_api.onOpen(() => {
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

        deriv_api.onMessage(({ data: response }) => {
            config.wsEvent('message');

            if (getPropertyValue(response, ['error', 'code']) === 'InvalidAppID') {
                wrong_app_id = getAppId();
            }

            if (typeof config.onMessage === 'function') {
                config.onMessage(response);
            }
        });

        deriv_api.onClose(() => {
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

    return {
        init,
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
    };
})();

const proxied_socket_base = new Proxy(BinarySocketBase, {
    get(target, field) {
        if (target[field]) return target[field];

        const api = target.get();
        if (!api) return undefined;

        if (api[field]) return api[field];

        return undefined;
    },
});

module.exports = proxied_socket_base;
