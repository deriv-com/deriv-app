import React from 'react';

const AccountSignupModal = React.lazy(() => import(/* webpackChunkName: "account-signup-modal" */'../AccountSignupModal'));
const ResetPasswordModal = React.lazy(() => import(/* webpackChunkName: "reset-password-modal" */'../ResetPasswordModal'));
const SetResidenceModal  = React.lazy(() => import(/* webpackChunkName: "set-residence-modal"  */'../SetResidenceModal'));

const AppModals = () => {
    return (
        <React.Fragment>
            <AccountSignupModal />
            <ResetPasswordModal />
            <SetResidenceModal />
        </React.Fragment>
    );
};

export default AppModals;
