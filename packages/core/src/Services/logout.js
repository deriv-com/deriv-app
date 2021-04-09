import { init } from '@livechat/customer-sdk';
import Cookies from 'js-cookie';
import { removeCookies, livechat_client_id, livechat_license_id, isTestLink } from '@deriv/shared';
import SocketCache from '_common/base/socket_cache';
import WS from './ws-methods';

export const requestLogout = () => WS.logout().then(doLogout);

function endChat() {
    const domain = window.location.hostname.includes('deriv.com') ? 'deriv.com' : 'binary.sx';
    const utm_data = Cookies.getJSON('utm_data', { domain });
    const { utm_source, utm_medium, utm_campaign } = utm_data || {};
    const session_variables = {
        is_logged_in: false,
        loginid: '',
        landing_company_shortcode: '',
        currency: '',
        residence: '',
        email: '',
        utm_source: utm_source ?? '',
        utm_medium: utm_medium ?? '',
        utm_campaign: utm_campaign ?? '',
    };
    const customerSDK = init({
        licenseId: livechat_license_id,
        clientId: livechat_client_id,
    });

    window.LiveChatWidget.call('set_session_variables', session_variables);
    window.LiveChatWidget.call('set_customer_email', ' ');
    window.LiveChatWidget.call('set_customer_name', ' ');

    customerSDK.on('connected', () => {
        if (window.LiveChatWidget.get('chat_data')) {
            const { chatId, threadId } = window.LiveChatWidget.get('chat_data');
            if (threadId) {
                customerSDK.deactivateChat({ chatId });
            }
        }
    });
}

const doLogout = response => {
    if (response.logout !== 1) return undefined;
    removeCookies('affiliate_token', 'affiliate_tracking', 'onfido_token');
    SocketCache.clear();
    sessionStorage.clear();
    if (!isTestLink()) {
        endChat();
    }
    return response;
};
