import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL, website_name } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { observer as globalObserver } from '../../utils/observer';

export const generateDerivApiInstance = () => {
    const socket_url = `wss://${getSocketURL()}/websockets/v3?app_id=${getAppId()}&l=${getLanguage()}&brand=${website_name.toLowerCase()}`;
    const deriv_socket = new WebSocket(socket_url);
    const deriv_api = new DerivAPIBasic({
        connection: deriv_socket,
    });
    return deriv_api;
};

const getToken = () => {
    const active_loginid = localStorage.getItem('active_loginid');
    const client_accounts = JSON.parse(localStorage.getItem('client.accounts'));
    const active_account = client_accounts[active_loginid] || {};
    return {
        token: active_account?.token || undefined,
        account_id: active_loginid || undefined,
    };
};

class GetAPI {
    api;
    token;
    account_id;
    pipSizes = [];
    account_info = {};

    constructor() {
        this.init();
    }

    init(force_update = false) {
        if (force_update && this.api) this.api.disconnect();
        this.api = generateDerivApiInstance();
        this.initEventListeners();
        this.authorizeAndSubscribe();
    }

    initEventListeners() {
        if (window) {
            window.addEventListener('online', this.reconnectIfNotConnected);
            window.addEventListener('focus', this.reconnectIfNotConnected);
        }
    }

    createNewInstance(account_id) {
        if (this.account_id !== account_id) {
            this.init(true);
        }
    }

    reconnectIfNotConnected = () => {
        // eslint-disable-next-line no-console
        console.log('connection state: ', this.api.connection.readyState);
        if (this.api.connection.readyState !== 1) {
            // eslint-disable-next-line no-console
            console.log('Info: Connection to the server was closed, trying to reconnect.');
            this.init();
        }
    };

    authorizeAndSubscribe() {
        const { token, account_id } = getToken();
        if (token) {
            this.token = token;
            this.account_id = account_id;
            this.api
                .authorize(this.token)
                .then(({ authorize }) => {
                    this.subscribe();
                    this.getActiveSymbols();
                    this.account_info = authorize;
                })
                .catch(e => {
                    globalObserver.emit('Error', e);
                });
        }
    }

    subscribe() {
        this.api.send({ balance: 1, subscribe: 1 }).catch(e => {
            globalObserver.emit('Error', e);
        });
        this.api.send({ transaction: 1, subscribe: 1 }).catch(e => {
            globalObserver.emit('Error', e);
        });
    }

    getActiveSymbols = async () => {
        await api_base.api.expectResponse('authorize');
        const { active_symbols = [] } = await api_base.api.send({ active_symbols: 'brief' });
        const pip_size = {};
        active_symbols.forEach(({ symbol, pip }) => {
            pip_size[symbol] = +(+pip).toExponential().substring(3);
        });
        this.pip_size = pip_size;
    };
}

export const api_base = new GetAPI();
