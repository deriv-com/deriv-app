import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useNotifications, NotificationBanners } from '@deriv-com/quill-ui';
import { StandaloneFlagCheckeredFillIcon } from '@deriv/quill-icons';
import { routes } from '@deriv/shared';
import { useLocation } from 'react-router-dom';

const Notifications = observer(() => {
    const { addBanner, banners, removeBanner } = useNotifications();
    const { portfolio } = useStore();
    const { setAddNotificationBannerCallback } = portfolio;
    const { pathname } = useLocation();

    React.useEffect(() => {
        if (banners.length > 1) removeBanner(banners[0].id);
        if (pathname === routes.trade) return;
        banners.forEach(({ type, id }) => {
            if (!type) {
                // Sell notifications have type and Purchase ones do not.
                removeBanner(id);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [banners, pathname]);

    React.useEffect(() => {
        const addNotificationBannerCallback = (params: Parameters<typeof addBanner>[0], result: string) =>
            addBanner({
                icon: (
                    <StandaloneFlagCheckeredFillIcon
                        iconSize='sm'
                        className={`trade-notification--${result}`}
                        key='contract-closed'
                    />
                ),
                ...params,
            });

        setAddNotificationBannerCallback(addNotificationBannerCallback);

        return () => setAddNotificationBannerCallback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <NotificationBanners
            autohideTimeout={4000}
            banners={banners}
            className='trade-notification'
            isMobile
            onClose={removeBanner}
            zIndex={100}
        />
    );
});

export default Notifications;
