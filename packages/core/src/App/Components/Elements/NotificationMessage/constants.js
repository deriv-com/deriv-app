export const default_delay = 3000;

export const max_display_notifications = 3;

export const icon_types = {
    danger: 'IcAlertDanger',
    info: 'IcAlertInfo',
    success: 'IcAlertSuccess',
    warning: 'IcAlertWarning',
    contract_sold: 'IcAlertInfo',
};

export const types = {
    danger: 'notification--danger',
    info: 'notification--info',
    success: 'notification--success',
    warning: 'notification--warning',
    contract_sold: 'notification--info',
};

export const sortNotifications = (() => {
    const notification_order = {
        contract_sold: 1,
        danger: 2,
        warning: 3,
        info: 4,
        success: 5,
    };

    return (a, b) => notification_order[a.type] - notification_order[b.type];
})();
