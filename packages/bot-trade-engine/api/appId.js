import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL } from '../shared';
import APIMiddleware from './api-middleware';
import { getLanguage } from '@deriv/translations';

// let getLanguage;
// (async () => {
//     try {
//         const translations = await import('@deriv/translations');
//         getLanguage = translations?.getLanguage;
//     } catch (error) {
//         getLanguage = 'en';
//         // eslint-disable-next-line no-console
//         console.warn('Could not load translations.', error);
//     }
//     if (!getLanguage) {
//         getLanguage = 'en';
//     }
// })();

export const generateDerivApiInstance = (website_name = 'Deriv') => {
    const socket_url = `wss://${getSocketURL()}/websockets/v3?app_id=${getAppId()}&l=${getLanguage()}&brand=${website_name.toLowerCase()}`;
    const deriv_socket = new WebSocket(socket_url);
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
