import React from 'react';

export const modals = {
    BuySellModal: React.lazy(() =>
        import(/* webpackChunkName: "buy-sell-modal" */ 'Components/modal-manager/modals/buy-sell-modal')
    ),
};
