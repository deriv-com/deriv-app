import ObjectUtils from '@deriv/shared/utils/object';

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

    removeNotificationListener(callback) {
        const listener_idx = this.notification_listeners.findIndex(listener => listener === callback);
        if (listener_idx > -1) {
            this.notification_listeners.splice(existing_listener_idx, 1);
        }
    }

    getNotificationCount() {
        return this.getNotifications().filter(n => !n.has_seen_chat || !n.has_seen_order).length;
    }

    getNotifications() {
        return this.getSettings().notifications;
    }

    getSettings() {
        const user_settings = this.getAllSettings()[this.loginid];
        if (ObjectUtils.isEmptyObject(user_settings)) {
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

    setNotification(channel_url, options) {
        if (!channel_url) {
            return;
        }

        const notifications = this.getNotifications();
        const notification = notifications.find(n => n.channel_url === channel_url);

        if (notification) {
            if (options.has_seen_chat !== undefined) {
                notification.has_seen_chat = options.has_seen_chat;
            }
            if (options.has_seen_order !== undefined) {
                notification.has_seen_order = options.has_seen_order;
            }
        } else {
            notifications.push({
                channel_url,
                has_seen_chat: options.has_seen_chat || false,
                has_seen_order: options.has_seen_order || false,
            });
        }

        this.updateNotifications({ is_cached: true, notifications });
        this.syncNotifications();
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
    }
}

export default new LocalStorage();
