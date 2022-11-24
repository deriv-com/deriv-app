import React from 'react';

export const modals = {
    InvalidVerificationLinkModal: React.lazy(() =>
        import(
            /* webpackChunkName: "invalid-verification-link-modal" */ 'Components/modal-manager/modals/invalid-verification-link-modal'
        )
    ),
};
