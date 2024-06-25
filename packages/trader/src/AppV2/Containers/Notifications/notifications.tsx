import { useNotifications, NotificationBanners } from '@deriv-com/quill-ui';
import React from 'react';

const Notifications = () => {
    const { banners, removeBanner } = useNotifications();

    return (
        <>
            <NotificationBanners banners={banners} onClose={removeBanner} />
        </>
    );
};

export default Notifications;
