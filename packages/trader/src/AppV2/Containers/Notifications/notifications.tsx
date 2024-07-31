import React from 'react';
import { useNotifications, NotificationBanners } from '@deriv-com/quill-ui';

const Notifications = () => {
    const { banners, removeBanner } = useNotifications();

    return (
        <>
            <NotificationBanners banners={banners} isMobile onClose={removeBanner} className='trade-notification' />
        </>
    );
};

export default Notifications;
