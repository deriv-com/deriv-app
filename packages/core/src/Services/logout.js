import { removeCookies } from '@deriv/shared';
import Client from '_common/base/client_base';
import SocketCache from '_common/base/socket_cache';
import WS from './ws-methods';

export const requestLogout = () => WS.logout().then(doLogout);

const doLogout = response => {
    if (response.logout !== 1) return undefined;
    removeCookies('affiliate_token', 'affiliate_tracking', 'onfido_token');
    Client.clearAllAccounts();
    Client.set('loginid', '');
    SocketCache.clear();
    sessionStorage.clear();

    return response;
};
