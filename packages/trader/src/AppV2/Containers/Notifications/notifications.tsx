import { useNotifications, NotificationBanners } from '@deriv-com/quill-ui';

import React from 'react';

const Notifications = () => {
    const { banners, removeBanner } = useNotifications();

    return (
        <>
            <NotificationBanners banners={banners} isMobile onClose={removeBanner} />
        </>
    );
};

export default Notifications;
