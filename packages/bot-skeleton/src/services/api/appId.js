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

class GetAPI {
    api;
    token;
    pipSizes = [];
    account_info = {};

    constructor() {
        this.api = generateDerivApiInstance();
        this.initEventListeners();
    }

    initEventListeners() {
        if (window) {
            window.addEventListener('offline', this.offline);
            window.addEventListener('online', this.online);
            this.authorize();
        }
    }

    offline = () => {
        // eslint-disable-next-line
        console.log('offline');
    };

    online = () => {
        this.api.send({ ping: 1 }).catch(err => {
            // eslint-disable-next-line
            console.log(err, 'error');
        });
    };

    authorize() {
        const active_loginid = localStorage.getItem('active_loginid');
        const client_accounts = JSON.parse(localStorage.getItem('client.accounts'));
        const active_account = client_accounts[active_loginid] || {};

        if (active_account && active_account.token) {
            this.token = active_account.token;
            this.api
                .authorize(this.token)
                .then(({ authorize }) => {
                    this.subscribe();
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
        this.pipSizes = active_symbols
            .reduce((s, i) => s.set(i.symbol, +(+i.pip).toExponential().substring(3)), new Map())
            .toObject();
    };
}

export const api_base = new GetAPI();
