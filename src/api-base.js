import { getLanguage, getAppIdFallback, getServerAddressFallback } from '@storage';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';

const socket_url = `wss://${getServerAddressFallback()}/websockets/v3?app_id=${getAppIdFallback()}&l=${getLanguage().toUpperCase()}&brand=deriv`;

class APIBase {
    api;
    login_id;

    constructor() {
        this.init();
        this.initEventListeners();
    }

    init() {
        this.api = new DerivAPIBasic({
            connection: new WebSocket(socket_url),
        });

        this.api.onOpen().subscribe(() => {
            // eslint-disable-next-line no-console
            console.log('Connection has been established!');
            console.log(this.api);
        });
    }

    initEventListeners() {
        if (window) {
            window.addEventListener('online', this.reconnectIfNotConnected);
            window.addEventListener('focus', this.reconnectIfNotConnected);
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
}

export default APIBase;

export const api_base = new APIBase();
