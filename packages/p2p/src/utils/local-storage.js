import { isEmptyObject } from '@deriv/shared';

const LOCALSTORAGE_KEY = 'p2p_settings';

class LocalStorage {
    constructor() {
        this.loginid = null;
        this.notification_listeners = [];
        this.notification_count = 0;
    }

    setLoginId(loginid) {
        this.loginid = loginid;
    }

    addNotificationListener(callback) {
        if (!this.notification_listeners.some(listener => listener === callback)) {
            this.notification_listeners.push(callback);
        }
        this.notification_listeners.push(callback);
    }

    getNotificationCount() {
        return this.getNotifications().filter(n => n.unread_msgs > 0 || !n.has_seen_order).length;
    }

    getNotifications() {
        return this.getSettings().notifications;
    }

    getSettings() {
        const user_settings = this.getAllSettings()[this.loginid];
        if (isEmptyObject(user_settings)) {
            return {
                is_cached: false,
                notifications: [],
            };
        }
        return user_settings;
    }

    // eslint-disable-next-line class-methods-use-this
    getAllSettings() {
        return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '{}');
    }

    setNotificationByChannelUrl(channel_url, options) {
        const matches = channel_url.match(/^p2porder_([A-Za-z]{2})_([0-9]+)_([0-9]+)$/);
        const order_id = matches[2];
        this.setNotificationByOrderId(order_id, options);
    }

    setNotificationByOrderId(order_id, options) {
        const notifications = this.getNotifications();
        const notification = notifications.find(n => n.order_id === order_id);

        if (notification) {
            if (options?.channel_url !== undefined) {
                notification.channel_url = options.channel_url;
            }
            if (options?.unread_msgs !== undefined) {
                notification.unread_msgs = options.unread_msgs;
            }
            if (options?.has_seen_order !== undefined) {
                notification.has_seen_order = options.has_seen_order;
            }
        } else {
            notifications.push({
                order_id,
                channel_url: options?.chat_channel_url,
                unread_msgs: options?.unread_msgs || 0,
                has_seen_order: options?.has_seen_order || true,
            });
        }

        this.updateNotifications({ is_cached: true, notifications });
    }

    syncNotifications() {
        const notification_count = this.getNotificationCount();

        if (this.notification_count !== notification_count) {
            this.notification_listeners.forEach(listener => listener(notification_count));
            this.notification_count = notification_count;
        }
    }

    updateNotifications(settings) {
        const p2p_settings = this.getAllSettings();
        p2p_settings[this.loginid] = settings;
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(p2p_settings));
        this.syncNotifications();
    }
}

export default new LocalStorage();
