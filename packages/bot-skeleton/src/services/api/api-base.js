import { observer as globalObserver } from '../../utils/observer';
import { doUntilDone, socket_state } from '../tradeEngine/utils/helpers';
import { generateDerivApiInstance, getLoginId, getToken } from './appId';

class APIBase {
    api;
    token;
    account_id;
    pip_sizes = {};
    account_info = {};
    is_running = false;
    subscriptions = [];
    time_interval = null;
    has_activeSymbols = false;
    is_stopping = false;

    async init(force_update = false) {
        if (getLoginId()) {
            this.toggleRunButton(true);
            if (force_update) this.terminate();
            this.api = generateDerivApiInstance();
            this.initEventListeners();
            await this.authorizeAndSubscribe();
            if (this.time_interval) clearInterval(this.time_interval);
            this.time_interval = null;
            this.getTime();
        }
    }

    getConnectionStatus() {
        if (this.api?.connection) {
            const ready_state = this.api.connection.readyState;
            return socket_state[ready_state] || 'Unknown';
        }
        return 'Socket not initialized';
    }

    terminate() {
        // eslint-disable-next-line no-console
        console.log('connection terminated');
        if (this.api) this.api.disconnect();
    }

    initEventListeners() {
        if (window) {
            window.addEventListener('online', this.reconnectIfNotConnected);
            window.addEventListener('focus', this.reconnectIfNotConnected);
        }
    }

    async createNewInstance(account_id) {
        if (this.account_id !== account_id) {
            await this.init(true);
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

    async authorizeAndSubscribe() {
        const { token, account_id } = getToken();
        if (token) {
            this.token = token;
            this.account_id = account_id;
            this.api.authorize(this.token);
            try {
                const { authorize } = await this.api.expectResponse('authorize');
                if (this.has_activeSymbols) {
                    this.toggleRunButton(false);
                } else {
                    this.getActiveSymbols();
                }
                await this.subscribe();
                this.account_info = authorize;
            } catch (e) {
                globalObserver.emit('Error', e);
            }
        }
    }

    async subscribe() {
        await Promise.all([
            doUntilDone(() => this.api.send({ balance: 1, subscribe: 1 })),
            doUntilDone(() => this.api.send({ transaction: 1, subscribe: 1 })),
            doUntilDone(() => this.api.send({ proposal_open_contract: 1, subscribe: 1 })),
        ]);
    }

    getActiveSymbols = async () => {
        doUntilDone(() => this.api.send({ active_symbols: 'brief' })).then(({ active_symbols = [] }) => {
            const pip_sizes = {};
            if (active_symbols.length) this.has_activeSymbols = true;
            active_symbols.forEach(({ symbol, pip }) => {
                pip_sizes[symbol] = +(+pip).toExponential().substring(3);
            });
            this.pip_sizes = pip_sizes;
            this.toggleRunButton(false);
        });
    };

    toggleRunButton = toggle => {
        const run_button = document.querySelector('#db-animation__run-button');
        if (!run_button) return;
        run_button.disabled = toggle;
    };

    setIsRunning(toggle = false) {
        this.is_running = toggle;
    }

    pushSubscription(subscription) {
        this.subscriptions.push(subscription);
    }

    clearSubscriptions() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];

        // Resetting timeout resolvers
        const global_timeouts = globalObserver.getState('global_timeouts') ?? [];

        global_timeouts.forEach((_, i) => {
            clearTimeout(i);
        });
    }

    getTime() {
        if (!this.time_interval) {
            this.time_interval = setInterval(() => {
                this.api.send({ time: 1 });
            }, 30000);
        }
    }
}

export const api_base = new APIBase();
