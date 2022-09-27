import React from 'react';
import CashierNotifications from './cashier-notifications';

// This component is used in general-store
const CashierNotificationsIcon = (p2p_notification_count: number) => {
    return <CashierNotifications p2p_notification_count={p2p_notification_count} />;
};

export default CashierNotificationsIcon;
