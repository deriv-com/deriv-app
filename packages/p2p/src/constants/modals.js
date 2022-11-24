import React from 'react';

export const modals = {
    LoadingModal: React.lazy(() =>
        import(/* webpackChunkName: "loading-modal" */ 'Components/modal-manager/modals/loading-modal')
    ),
};
