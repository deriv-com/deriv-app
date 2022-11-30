import React from 'react';

export const modals = {
    CreateAdErrorModal: React.lazy(() =>
        import(/* webpackChunkName: "create-ad-error-modal" */ 'Components/modal-manager/modals/create-ad-error-modal')
    ),
};
