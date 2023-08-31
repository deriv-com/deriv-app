import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getSocketURL } from '@deriv/shared';
import APIMiddleware from './api-middleware';

export const generateDerivApiInstance = () => {
    const deriv_socket = new WebSocket(getSocketURL());
    const deriv_api = new DerivAPIBasic({
        connection: deriv_socket,
        middleware: new APIMiddleware({}),
    });
    return deriv_api;
};

export const getLoginId = () => {
    const login_id = localStorage.getItem('active_loginid');
    if (login_id && login_id !== 'null') return login_id;
    return null;
};

export const getToken = () => {
    const active_loginid = getLoginId();
    const client_accounts = JSON.parse(localStorage.getItem('client.accounts')) || undefined;
    const active_account = (client_accounts && client_accounts[active_loginid]) || {};
    return {
        token: active_account?.token || undefined,
        account_id: active_loginid || undefined,
    };
};
