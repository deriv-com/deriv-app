import React from 'react';

export const modals = {
    OrderDetailsConfirmModal: React.lazy(() =>
        import(
            /* webpackChunkName: "order-details-confirm-modal" */ 'Components/modal-manager/modals/order-details-confirm-modal'
        )
    ),
};
