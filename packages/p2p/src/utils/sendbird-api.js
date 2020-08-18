import SendBird from 'sendbird';
import { isProduction } from '@deriv/shared';

class SendbirdAPI {
    constructor({ LocalStorage }) {
        this.LocalStorage = LocalStorage;
        this.channels = {};
        this.sendbird = null;
    }

    async init(sendbird_user_id, service_token) {
        this.sendbird = new SendBird({
            appId: isProduction() ? '1465991C-5D64-4C88-8BD9-B0D7A6455E69' : '4E259BA5-C383-4624-89A6-8365E06D9D39',
        });
        this.sendbird.connect(sendbird_user_id, service_token, (user, error) => {
            if (error) {
                // eslint-disable-next-line no-console
                console.warn({ error });
                return;
            }

            const channel_event_handler = new this.sendbird.ChannelHandler();
            const user_event_handler = new this.sendbird.UserEventHandler();

            channel_event_handler.onMessageReceived = this.onMessageReceived.bind(this);
            channel_event_handler.onChannelChanged = this.onMessageReceived.bind(this);

            this.sendbird.addChannelHandler('channel_event_handler', channel_event_handler);
            this.sendbird.addUserEventHandler('user_event_handler', user_event_handler);
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
                await new Promise(resolve => setTimeout(resolve, 100)); // eslint-disable-line no-await-in-loop
                continue; // eslint-disable-line no-continue
            }

            // eslint-disable-next-line no-loop-func
            channel_list_query.next((channel_list, error) => {
                if (!error) {
                    channel_list.forEach(channel => {
                        this.LocalStorage.setNotificationByChannelUrl(channel.url, {
                            unread_msgs: channel.unreadMessageCount,
                        });
                    });
                }
            });
        }

        this.channels = Object.assign({}, this.channels, channels);
        this.LocalStorage.syncNotifications();

        return Promise.resolve();
    }

    onMessageReceived(channel) {
        const updated_channels = {
            [channel.url]: {
                unread_message_count: channel.unreadMessageCount,
            },
        };

        this.LocalStorage.setNotificationByChannelUrl(channel.url, {
            unread_msgs: channel.unreadMessageCount,
        });
        this.channels = Object.assign({}, this.channels, updated_channels);
        this.LocalStorage.syncNotifications();
    }
}

export default SendbirdAPI;
