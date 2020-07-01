import { SendbirdAPI, P2pStorage } from '@deriv/p2p/lib/utils';
import { action, observable } from 'mobx';
import { WS } from 'Services';
import BaseStore from '../../base-store';

export default class P2pStore extends BaseStore {
    constructor({ root_store }) {
        super({ root_store });

        this.onClientInit(this.initSendbird);
        this.onLogout(this.disconnectSendbird);

        this.sendbird_api = new SendbirdAPI({
            callbacks: {
                setUnreadNotificationCount: this.setUnreadNotificationCount,
            },
        });
    }

    @observable unread_chat_message_count = P2pStorage.getUnreadNotificationCount();

    @action.bound
    async initSendbird() {
        if (this.root_store.client.is_logged_in) {
            const p2p_advertiser_info = await WS.authorized.p2pAdvertiserInfo();
            const p2p_service_token = await WS.authorized.serviceToken({ service_token: 1, service: 'sendbird' });

            const sendbird_user_id = p2p_advertiser_info?.p2p_advertiser_info?.chat_user_id;
            const service_token = p2p_service_token?.service_token?.token;

            this.sendbird_api.init(sendbird_user_id, service_token);
        }

        return Promise.resolve();
    }

    @action.bound
    disconnectSendbird() {
        if (this.sendbird_api) {
            this.sendbird_api.disconnect();
        }

        return Promise.resolve();
    }

    @action.bound
    setUnreadChatMessageCount(unread_count) {
        this.unread_chat_message_count = unread_count;
    }
}
