import React from 'react';

export const modals = {
    BuySellModal: React.lazy(() =>
        import(/* webpackChunkName: "buy-sell-modal" */ 'Components/modal-manager/modals/buy-sell-modal')
    ),
    CancelAddPaymentMethodModal: React.lazy(() =>
        import(
            /* webpackChunkName: "cancel-add-payment-method-modal" */ 'Components/modal-manager/modals/cancel-add-payment-method-modal'
        )
    ),
    AdExceedsDailyLimitModal: React.lazy(() =>
        import(
            /* webpackChunkName: "ad-exceeds-daily-limit-modal" */ 'Components/modal-manager/modals/ad-exceeds-daily-limit-modal'
        )
    ),
    EmailLinkVerifiedModal: React.lazy(() =>
        import(
            /* webpackChunkName: "email-link-verified-modal" */ 'Components/modal-manager/modals/email-link-verified-modal'
        )
    ),
    FilterModal: React.lazy(() =>
        import(/* webpackChunkName: "filter-modal" */ 'Components/modal-manager/modals/filter-modal')
    ),
    MyAdsDeleteErrorModal: React.lazy(() =>
        import(
            /* webpackChunkName: "my-ads-delete-error-modal" */ 'Components/modal-manager/modals/my-ads-delete-error-modal'
        )
    ),
    MyAdsDeleteModal: React.lazy(() =>
        import(/* webpackChunkName: "my-ads-delete-modal" */ 'Components/modal-manager/modals/my-ads-delete-modal')
    ),
    MyAdsFloatingRateSwitchModal: React.lazy(() =>
        import(
            /* webpackChunkName: "my-ads-floating-rate-switch-modal" */ 'Components/modal-manager/modals/my-ads-floating-rate-switch-modal'
        )
    ),
    OrderDetailsCancelModal: React.lazy(() =>
        import(
            /* webpackChunkName: "order-details-cancel-modal" */ 'Components/modal-manager/modals/order-details-cancel-modal'
        )
    ),
};
