import React from 'react';

export const modals = {
    QuickAddModal: React.lazy(() =>
        import(/* webpackChunkName: "quick-add-modal" */ 'Components/modal-manager/modals/quick-add-modal')
    ),
};
