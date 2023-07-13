import React from 'react';

export const modals = {
    AdErrorTooltipModal: React.lazy(() =>
        import(
            /* webpackChunkName: "ad-error-tooltip-modal" */ 'Components/modal-manager/modals/ad-error-tooltip-modal'
        )
    ),
    AddPaymentMethodErrorModal: React.lazy(() =>
        import(
            /* webpackChunkName: "add-payment-method-error-modal" */ 'Components/modal-manager/modals/add-payment-method-error-modal'
        )
    ),
    AdVisibilityErrorModal: React.lazy(() =>
        import(
            /* webpackChunkName: "ad-visibility-error-modal" */ 'Components/modal-manager/modals/ad-visibility-error-modal'
        )
    ),
    BuySellModal: React.lazy(() =>
        import(/* webpackChunkName: "buy-sell-modal" */ 'Components/modal-manager/modals/buy-sell-modal')
    ),
    BlockUserModal: React.lazy(() =>
        import(/* webpackChunkName: "block-user-modal" */ 'Components/modal-manager/modals/block-user-modal')
    ),
    CancelAddPaymentMethodModal: React.lazy(() =>
        import(
            /* webpackChunkName: "cancel-add-payment-method-modal" */ 'Components/modal-manager/modals/cancel-add-payment-method-modal'
        )
    ),
    CancelEditPaymentMethodModal: React.lazy(() =>
        import(
            /* webpackChunkName: "cancel-edit-payment-method-modal" */ 'Components/modal-manager/modals/cancel-edit-payment-method-modal'
        )
    ),
    CurrencySelectorModal: React.lazy(() =>
        import(
            /* webpackChunkName: "currency-selector-modal" */ 'Components/modal-manager/modals/currency-selector-modal'
        )
    ),
    CreateAdErrorModal: React.lazy(() =>
        import(/* webpackChunkName: "create-ad-error-modal" */ 'Components/modal-manager/modals/create-ad-error-modal')
    ),
    CreateAdAddPaymentMethodModal: React.lazy(() =>
        import(
            /* webpackChunkName: "create-ad-add-payment-method-modal" */ 'Components/modal-manager/modals/create-ad-add-payment-method-modal'
        )
    ),
    DeletePaymentMethodErrorModal: React.lazy(() =>
        import(
            /* webpackChunkName: "delete-payment-method-error-modal" */ 'Components/modal-manager/modals/delete-payment-method-error-modal'
        )
    ),
    EditAdCancelModal: React.lazy(() =>
        import(/* webpackChunkName: "edit-ad-cancel-modal" */ 'Components/modal-manager/modals/edit-ad-cancel-modal')
    ),
    EmailLinkBlockedModal: React.lazy(() =>
        import(
            /* webpackChunkName: "edit-ad-cancel-modal" */ 'Components/modal-manager/modals/email-link-blocked-modal'
        )
    ),
    EmailLinkExpiredModal: React.lazy(() =>
        import(
            /* webpackChunkName: "email-link-expired-modal" */ 'Components/modal-manager/modals/email-link-expired-modal'
        )
    ),
    EmailLinkVerifiedModal: React.lazy(() =>
        import(
            /* webpackChunkName: "email-link-verified-modal" */ 'Components/modal-manager/modals/email-link-verified-modal'
        )
    ),
    EmailVerificationModal: React.lazy(() =>
        import(
            /* webpackChunkName: "email-verification-modal" */ 'Components/modal-manager/modals/email-verification-modal'
        )
    ),
    ErrorModal: React.lazy(() =>
        import(/* webpackChunkName: "error-modal" */ 'Components/modal-manager/modals/error-modal')
    ),
    FilterModal: React.lazy(() =>
        import(/* webpackChunkName: "filter-modal" */ 'Components/modal-manager/modals/filter-modal')
    ),
    InvalidVerificationLinkModal: React.lazy(() =>
        import(
            /* webpackChunkName: "invalid-verification-link-modal" */ 'Components/modal-manager/modals/invalid-verification-link-modal'
        )
    ),
    LoadingModal: React.lazy(() =>
        import(/* webpackChunkName: "loading-modal" */ 'Components/modal-manager/modals/loading-modal')
    ),
    MarketRateChangeErrorModal: React.lazy(() =>
        import(
            /* webpackChunkName: "market-rate-change-error-modal" */ 'Components/modal-manager/modals/market-rate-change-error-modal'
        )
    ),
    MyAdsDeleteModal: React.lazy(() =>
        import(/* webpackChunkName: "my-ads-delete-modal" */ 'Components/modal-manager/modals/my-ads-delete-modal')
    ),
    MyAdsDeleteErrorModal: React.lazy(() =>
        import(
            /* webpackChunkName: "my-ads-delete-error-modal" */ 'Components/modal-manager/modals/my-ads-delete-error-modal'
        )
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
    OrderDetailsConfirmModal: React.lazy(() =>
        import(
            /* webpackChunkName: "order-details-confirm-modal" */ 'Components/modal-manager/modals/order-details-confirm-modal'
        )
    ),
    QuickAddModal: React.lazy(() =>
        import(/* webpackChunkName: "quick-add-modal" */ 'Components/modal-manager/modals/quick-add-modal')
    ),
    RatingModal: React.lazy(() =>
        import(/* webpackChunkName: "rating-modal" */ 'Components/modal-manager/modals/rating-modal')
    ),
    RateChangeModal: React.lazy(() =>
        import(/* webpackChunkName: "rate-change-modal" */ 'Components/modal-manager/modals/rate-change-modal')
    ),
    RecommendedModal: React.lazy(() =>
        import(/* webpackChunkName: "recommended-modal" */ 'Components/modal-manager/modals/recommended-modal')
    ),
};
