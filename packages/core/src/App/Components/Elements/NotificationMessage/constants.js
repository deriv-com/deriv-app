export const default_delay = 3000;

export const max_display_notifications = 3;
export const max_display_notifications_mobile = 1;

export const icon_types = {
    danger: 'IcAlertDanger',
    info: 'IcAlertInfo',
    success: 'IcAlertSuccess',
    warning: 'IcAlertWarning',
    contract_sold: 'IcAlertInfo',
    announce: 'IcAlertAnnounce',
};

export const types = {
    announce: 'notification--announce',
    danger: 'notification--danger',
    info: 'notification--info',
    success: 'notification--success',
    warning: 'notification--warning',
    contract_sold: 'notification--info',
};

export const sortNotifications = (() => {
    const notification_order = {
        promotions: 1,
        news: 2,
        contract_sold: 3,
        danger: 4,
        warning: 5,
        info: 6,
        success: 7,
    };

    return (a, b) => notification_order[a.type] - notification_order[b.type];
})();

export const sortNotificationsMobile = (() => {
    const notification_order_mobile = {
        contract_sold: 1,
        promotions: 2,
        danger: 3,
        news: 4,
        warning: 5,
        info: 6,
        success: 7,
    };

    return (a, b) => notification_order_mobile[a.type] - notification_order_mobile[b.type];
})();
