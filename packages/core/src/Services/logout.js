import { init } from '@livechat/customer-sdk';
import { removeCookies } from '@deriv/shared';
import SocketCache from '_common/base/socket_cache';
import WS from './ws-methods';

export const requestLogout = () => WS.logout().then(doLogout);

function endChat() {
    const customerSDK = init({
        licenseId: 12049137,
        clientId: '66aa088aad5a414484c1fd1fa8a5ace7',
    });

    customerSDK.on('connected', () => {
        if (window.LiveChatWidget.get('chat_data')) {
            const { chatId, threadId } = window.LiveChatWidget.get('chat_data');
            if (threadId) {
                customerSDK.deactivateChat({ chatId });
            }
        }
    });

    window.LiveChatWidget.call('set_customer_email', ' ');
    window.LiveChatWidget.call('set_customer_name', ' ');
}

const doLogout = response => {
    if (response.logout !== 1) return undefined;
    removeCookies('affiliate_token', 'affiliate_tracking', 'onfido_token');
    SocketCache.clear();
    sessionStorage.clear();
    endChat();
    return response;
};
