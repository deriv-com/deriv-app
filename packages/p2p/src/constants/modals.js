import React from 'react';

export const modals = {
    EditAdCancelModal: React.lazy(() =>
        import(/* webpackChunkName: "edit-ad-cancel-modal" */ 'Components/modal-manager/modals/edit-ad-cancel-modal')
    ),
};
