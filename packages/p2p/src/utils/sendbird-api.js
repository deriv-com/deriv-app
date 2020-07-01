import SendBird from 'sendbird';
import LocalStorage from './local-storage';

class SendbirdAPI {
    constructor({ callbacks }) {
        this.channels = {};
        this.callbacks = { ...callbacks };
        this.sendbird = null;
        this.sendbird_user_id = null;
        this.service_token = null;
        this.unread_notification_count = 0;
    }

    async init(sendbird_user_id, service_token) {
        const sendbird = new SendBird({ appId: '4E259BA5-C383-4624-89A6-8365E06D9D39' });

        this.sendbird = sendbird;
        this.sendbird_user_id = sendbird_user_id;
        this.service_token = service_token;

        sendbird.connect(this.sendbird_user_id, this.service_token, (user, error) => {
            if (error) {
                // eslint-disable-next-line no-console
                console.warn(error);
                return;
            }

            const channel_event_handler = new sendbird.ChannelHandler();
            channel_event_handler.onMessageReceived = this.onMessageReceived;
            channel_event_handler.onChannelChanged = this.onMessageReceived;

            const user_event_handler = new sendbird.UserEventHandler();
            user_event_handler.onTotalUnreadMessageCountUpdated = this.onTotalUnreadMessageCountUpdated;

            sendbird.addChannelHandler('channel_event_handler', channel_event_handler);
            sendbird.addUserEventHandler('user_event_handler', user_event_handler);

            this.syncChannels();
        });

        return Promise.resolve();
    }

    async disconnect() {
        if (this.sendbird) {
            this.sendbird.disconnect();
        }

        return Promise.resolve();
    }

    async syncChannels() {
        const channels = {};
        const channel_list_query = this.sendbird.GroupChannel.createMyGroupChannelListQuery();

        channel_list_query.includeEmpty = true;
        channel_list_query.limit = 100;

        while (channel_list_query.hasNext) {
            if (channel_list_query.isLoading) {
                /* eslint-disable */
                await new Promise(resolve => setTimeout(resolve, 100));
                continue;
                /* eslint-enable */
            }

            // eslint-disable-next-line no-loop-func
            channel_list_query.next((channel_list, error) => {
                if (!error) {
                    channel_list.forEach(channel => {
                        const has_seen_chat = channel.unreadMessageCount > 0;
                        LocalStorage.setNotification(channel.url, { has_seen_chat });
                    });
                }
            });

            if (!channel_list_query.hasNext) {
                break;
            }
        }

        this.channels = { ...this.channels, ...channels };
        this.syncUnreadChatMessageCount();
        return Promise.resolve();
    }

    onMessageReceived(channel) {
        const updated_channel = {
            [channel.url]: {
                unread_message_count: channel.unreadMessageCount,
            },
        };

        const has_seen_chat = channel.unreadMessageCount > 0;
        LocalStorage.setNotification(channel.url, { has_seen_chat });

        this.channels = { ...this.channels, ...updated_channel };
        this.syncUnreadChatMessageCount();
    }

    syncUnreadChatMessageCount() {
        const unread_notification_count = LocalStorage.getUnreadNotificationCount();
        this.unread_notification_count = unread_notification_count;

        if (typeof this.callbacks.setUnreadNotificationCount === 'function') {
            this.callbacks.setUnreadNotificationCount(unread_notification_count);
        }
    }
}

export default SendbirdAPI;
