import { removeCookies } from '@deriv/shared';
import SocketCache from '_common/base/socket_cache';
import WS from './ws-methods';

export const requestLogout = () => WS.logout().then(doLogout);

function endChat() {
    window.LC_API?.close_chat?.();
}

const doLogout = response => {
    console.log('doLogout', 'logout.js')
    if (response.logout !== 1) return undefined;
    removeCookies('affiliate_token', 'affiliate_tracking', 'onfido_token');
    SocketCache.clear();
    sessionStorage.clear();
    endChat();
    return response;
};
