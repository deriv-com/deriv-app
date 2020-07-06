import { action, observable } from 'mobx';
import { getPropertyValue, routes } from '@deriv/shared';
import { SendbirdAPI, P2pStorage } from '@deriv/p2p/lib/utils';
import { WS } from 'Services';
import BaseStore from '../../base-store';

export default class P2pStore extends BaseStore {
    constructor({ root_store }) {
        super({ root_store });
        this.onClientInit(this.initSendbird);
        this.onLogout(this.disconnectSendbird);
        this.onSwitchAccount(this.accountSwitcherListener);
    }

    @observable unread_notification_count = 0;
    @observable is_advertiser = false;
    @observable is_visible = false;

    @action.bound
    async initSendbird() {
        const { client } = this.root_store;

        if (client.is_logged_in) {
            P2pStorage.setLoginId(client.loginid);
            P2pStorage.addNotificationListener(this.setUnreadNotificationCount);

            const p2p_advertiser_info = await WS.authorized.p2pAdvertiserInfo();
            const p2p_service_token = await WS.authorized.serviceToken({ service_token: 1, service: 'sendbird' });

            const sendbird_user_id = p2p_advertiser_info?.p2p_advertiser_info?.chat_user_id;
            const service_token = p2p_service_token?.service_token?.sendbird?.token;

            if (!sendbird_user_id || !service_token) {
                // eslint-disable-next-line no-console
                console.warn('Could not initialise Sendbird API for notifications');
                return Promise.resolve();
            }

            this.sendbird_api = new SendbirdAPI({ LocalStorage: P2pStorage });
            this.sendbird_api.init(sendbird_user_id, service_token);

            // show p2p if:
            // 1. we have not already checked this before, and
            // 2. client is not virtual, and
            // 3. p2p call does not return error code `PermissionDenied`
            if (!this.is_visible && !client.is_virtual) {
                const advertiser_info = await WS.authorized.p2pAdvertiserInfo();
                const advertiser_error = getPropertyValue(advertiser_info, ['error', 'code']);

                if (advertiser_error !== 'PermissionDenied') {
                    this.setIsAdvertiser(!advertiser_error);
                    this.setIsVisible(true);
                }
            }
        } else {
            P2pStorage.setLoginId(null);
            P2pStorage.resetNotificationListeners();
        }

        return true;
    }

    @action.bound
    async disconnectSendbird() {
        if (this.sendbird_api) {
            this.sendbird_api.disconnect();
        }

        return true;
    }

    @action.bound
    accountSwitcherListener() {
        this.setIsVisible(false);
        return Promise.resolve();
    }

    @action.bound
    setIsAdvertiser(is_advertiser) {
        this.is_advertiser = is_advertiser;
    }

    @action.bound
    setIsVisible(is_visible) {
        this.is_visible = is_visible;

        if (!is_visible && window.location.pathname.startsWith(routes.cashier_p2p)) {
            this.root_store.common.routeTo(routes.cashier_deposit);
        }
    }

    @action.bound
    setUnreadNotificationCount(unread_notification_count) {
        this.unread_notification_count = unread_notification_count;
    }
}
