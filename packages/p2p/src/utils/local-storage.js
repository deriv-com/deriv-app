import ObjectUtils from '@deriv/shared/utils/object';

const LOCALSTORAGE_KEY = 'p2p_settings';

const getNotifications = () => getSettings().notifications;

const getSettings = () => {
    const settings = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

    if (ObjectUtils.isEmptyObject(settings)) {
        return {
            is_cached: false,
            notifications: [],
        };
    }

    return settings;
};

const getUnreadNotificationCount = () => {
    return getNotifications().filter(n => !n.has_seen_chat || !n.has_seen_order).length;
};

const setNotification = (channel_url, options) => {
    const notifications = getNotifications();
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

    setNotifications(notifications);
};

const setNotifications = notifications => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({ is_cached: true, notifications }));
};

export default {
    getNotifications,
    getSettings,
    getUnreadNotificationCount,
    setNotification,
    setNotifications,
};
