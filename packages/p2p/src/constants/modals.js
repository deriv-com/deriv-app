import React from 'react';

export const modals = {
    EmailVerificationModal: React.lazy(() =>
        import(
            /* webpackChunkName: "email-verification-modal" */ 'Components/modal-manager/modals/email-verification-modal'
        )
    ),
};
