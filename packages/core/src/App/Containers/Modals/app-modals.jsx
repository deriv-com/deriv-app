import React from 'react';

const AccountSignupModal = React.lazy(() => import(/* webpackChunkName: "account-signup-modal" */'../AccountSignupModal'));
const ResetPasswordModal = React.lazy(() => import(/* webpackChunkName: "reset-password-modal" */'../ResetPasswordModal'));

const AppModals = () => {
    return (
        <React.Fragment>
            <AccountSignupModal />
            <ResetPasswordModal />
        </React.Fragment>
    );
};

export default AppModals;
