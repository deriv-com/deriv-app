import React from 'react';
import 'Sass/app/modules/modals.scss';

const AccountSignupModal = React.lazy(() => import(/* webpackChunkName: "account-signup-modal" */'../AccountSignupModal'));
const ResetPasswordModal = React.lazy(() => import(/* webpackChunkName: "reset-password-modal" */'../ResetPasswordModal'));

const Modals = () => {
    return (
        <React.Fragment>
            <AccountSignupModal />
            <ResetPasswordModal />
        </React.Fragment>
    );
};

export default Modals;
