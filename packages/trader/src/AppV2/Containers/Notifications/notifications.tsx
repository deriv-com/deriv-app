import { useNotifications, NotificationBanners } from '@deriv-com/quill-ui';
import React from 'react';
import { useDevice } from '@deriv/components';

const Notifications = () => {
    const { banners, removeBanner } = useNotifications();
    const { is_mobile } = useDevice();

    return (
        <>
            <NotificationBanners banners={banners} isMobile={is_mobile} onClose={removeBanner} />
        </>
    );
};

export default Notifications;
