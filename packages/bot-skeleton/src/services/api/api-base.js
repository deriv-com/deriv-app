import { observer as globalObserver } from '../../utils/observer';
import { generateDerivApiInstance, getLoginId, getToken } from './appId';

class GetAPI {
    api;
    token;
    account_id;
    pip_sizes = {};
    account_info = {};
    subscriptions = {
        ticks_history: null,
    };

    init(force_update = false) {
        this.toggleRunButton(true);
        if (getLoginId()) {
            if (force_update && this.api) this.api.disconnect();
            this.api = generateDerivApiInstance();
            this.initEventListeners();
            this.authorizeAndSubscribe();
        }
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
        await this.api.expectResponse('authorize');
        const { active_symbols = [] } = await this.api.send({ active_symbols: 'brief' }).catch(e => {
            globalObserver.emit('Error', e);
        });
        const pip_sizes = {};
        active_symbols.forEach(({ symbol, pip }) => {
            pip_sizes[symbol] = +(+pip).toExponential().substring(3);
        });
        this.pip_sizes = pip_sizes;
        this.toggleRunButton(false);
    };

    toggleRunButton = toggle => {
        const run_button = document.querySelector('#db-animation__run-button');
        if (!run_button) return;
        if (toggle) {
            run_button.disabled = true;
        } else {
            run_button.disabled = false;
        }
    };
}

export const api_base = new GetAPI();
