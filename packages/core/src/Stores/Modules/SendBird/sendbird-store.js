import { action, observable } from 'mobx';
import SendBird from 'sendbird';
import BaseStore from '../../base-store';
import { WS } from 'Services';

export default class SendbirdStore extends BaseStore {
    sendbird = null;
    sendbird_user = null;
    sendbird_user_token = null;

    @action.bound
    init() {
        this.onClientInit(this.initSendbird);
        this.onLogout(() => this.sendbird && this.sendbird.disconnect());
    }

    initSendbird() {
        const { client } = this.root_store;

        if (!client.is_logged_in || client.is_virtual) {
            console.log({ is_logged_in: client.is_logged_in, is_virtual: client.is_virtual });
            return Promise.resolve();
        }

        WS.authorized.serviceToken({ service_token: 1, service: 'sendbird' }).then(response => {
            if (!response.error) {
                this.setSendbird(new SendBird({ appId: '4E259BA5-C383-4624-89A6-8365E06D9D39' }));
                this.setSendbirdUserToken(response.service_token?.sendbird?.token || response.service_token.token);

                this.sendbird.connect(this.sendbird_user_token, (user, error) => {
                    if (!error) {
                        this.setSendbirdUser(user);
                        this.onSendbirdUserConnected();
                    }
                });
            }
        });

        return Promise.resolve();
    }

    @action.bound
    setSendbird(sendbird) {
        this.sendbird = sendbird;
    }

    @action.bound
    setSendbirdUser(sendbird_user) {
        this.sendbird_user = sendbird_user;
    }

    @action.bound
    setSendbirdUserToken(sendbird_user_token) {
        this.sendbird_user_token = sendbird_user_token;
    }

    @action.bound
    onSendbirdUserConnected() {
        const user_event_handler = new this.sendbird.UserEventHandler();
        user_event_handler.onTotalUnreadMessageCountUpdated = this.onTotalUnreadMessageCountUpdated;
        this.sendbird.addUserEventHandler('user_event_handler', user_event_handler);

        const channel_event_handler = new this.sendbird.ChannelHandler();
        channel_event_handler.onMessageReceived = this.onMessageReceived;
        this.sendbird.addChannelHandler('channel_event_handler', user_event_handler);
    }

    @action.bound
    onMessageReceived(channel, message) {
        console.log({ channel, message });
    }

    @action.bound
    onTotalUnreadMessageCountUpdated(total_count, count_by_custom_types) {
        console.log({ total_count, count_by_custom_types });
    }
}
