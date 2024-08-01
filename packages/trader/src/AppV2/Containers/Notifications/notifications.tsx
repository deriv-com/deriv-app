import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useNotifications, NotificationBanners } from '@deriv-com/quill-ui';
import { StandaloneFlagCheckeredFillIcon } from '@deriv/quill-icons';

const Notifications = observer(() => {
    const { addBanner, banners, removeBanner } = useNotifications();
    const { portfolio } = useStore();
    const { setAddNotificationBannerCallback } = portfolio;

    React.useEffect(() => {
        const addNotificationBannerCallback = (params: Parameters<typeof addBanner>[0], result: string) =>
            addBanner({
                icon: <StandaloneFlagCheckeredFillIcon iconSize='sm' className={`trade-notification--${result}`} />,
                ...params,
            });

        setAddNotificationBannerCallback(addNotificationBannerCallback);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <NotificationBanners banners={banners} isMobile onClose={removeBanner} className='trade-notification' />;
});

export default Notifications;
