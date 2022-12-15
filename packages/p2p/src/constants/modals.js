import React from 'react';

export const modals = {
    AdExceedsDailyLimitModal: React.lazy(() =>
        import(
            /* webpackChunkName: "ad-exceeds-daily-limit-modal" */ 'Components/modal-manager/modals/ad-exceeds-daily-limit-modal'
        )
    ),
    MyAdsFloatingRateSwitchModal: React.lazy(() =>
        import(
            /* webpackChunkName: "my-ads-floating-rate-switch-modal" */ 'Components/modal-manager/modals/my-ads-floating-rate-switch-modal'
        )
    ),
};
