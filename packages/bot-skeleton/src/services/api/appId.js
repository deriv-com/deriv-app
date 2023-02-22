import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL, website_name } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';

export const generateDerivApiInstance = () => {
    const socket_url = `wss://${getSocketURL()}/websockets/v3?app_id=${getAppId()}&l=${getLanguage()}&brand=${website_name.toLowerCase()}`;
    const deriv_socket = new WebSocket(socket_url);
    const deriv_api = new DerivAPIBasic({
        connection: deriv_socket,
    });
    return deriv_api;
};

export const getLoginId = () => {
    const login_id = localStorage.getItem('active_loginid');
    console.log(login_id);
    if (login_id && login_id !== 'null') return login_id;
    return null;
};

export const getToken = () => {
    const active_loginid = getLoginId();
    const client_accounts = JSON.parse(localStorage.getItem('client.accounts')) || undefined;
    const active_account = (client_accounts && client_accounts[active_loginid]) || {};
    console.log(active_loginid, 'active_loginid');
    console.log(client_accounts, 'client_accounts');
    console.log(active_account, 'active_account');
    return {
        token: active_account?.token || undefined,
        account_id: active_loginid || undefined,
    };
};
