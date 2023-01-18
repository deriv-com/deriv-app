import BinarySocket, { TAuthorizedSocket } from '../../../../../core/src/_common/base/ts_socket_base';
import WS from 'jest-websocket-mock';

const url = `wss://test.ws.com/websockets/v3?app_id=1010&l=en&brand=deriv`;

const authorize_response = {
    authorize: {
        account_list: [
            {
                account_type: 'trading',
                created_at: 1647509550,
                currency: 'USD',
                is_disabled: 0,
                is_virtual: 0,
                landing_company_name: 'svg',
                loginid: 'CR0000000',
                trading: {},
            },
        ],
        balance: 10000,
        country: 'id',
        currency: 'USD',
        email: 'test@jest.com',
        fullname: 'michio uchiha',
        is_virtual: 1,
        landing_company_fullname: 'Test Jest Deriv Limited',
        landing_company_name: 'virtual',
        local_currencies: {
            IDR: {
                fractional_digits: 2,
            },
        },
        loginid: 'VRTC0000000',
        preferred_language: 'EN',
        scopes: ['read', 'trade', 'payments', 'trading_information', 'admin'],
        trading: {},
        upgradeable_landing_companies: ['svg'],
        user_id: 1234567,
    },
    echo_req: {
        authorize: 'michio_token',
        req_id: 1,
    },
    msg_type: 'authorize',
    req_id: 1,
};

type TMakeMockSocket = () => {
    wsClient: TAuthorizedSocket;
    wsServer: WS;
    wsConnect: (response?: typeof authorize_response) => void;
    wsClean: () => void;
};

const makeMockSocket: TMakeMockSocket = () => {
    const wsClient = BinarySocket;
    const wsServer = new WS(url, {
        jsonProtocol: true,
    });

    wsClient.init({
        options: {},
        client: {
            is_logged_in: true,
            getToken: () => {
                return 'michio_token';
            },
        },
    });

    const wsConnect = async (authorizeResponse: typeof authorize_response = authorize_response) => {
        wsClient.closeAndOpenNewConnection();
        await wsServer.connected;
        await wsServer.nextMessage;
        wsServer.send(authorizeResponse);
    };

    const wsClean = () => {
        WS.clean();
    };

    return { wsClient, wsServer, wsConnect, wsClean };
};

export default makeMockSocket;
