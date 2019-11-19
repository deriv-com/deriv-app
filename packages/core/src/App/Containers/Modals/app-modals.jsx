import React       from 'react';
import { connect } from 'Stores/connect';

const AccountSignupModal = React.lazy(() => import(/* webpackChunkName: "account-signup-modal" */'../AccountSignupModal'));
const ResetPasswordModal = React.lazy(() => import(/* webpackChunkName: "reset-password-modal" */'../ResetPasswordModal'));
const SetResidenceModal  = React.lazy(() => import(/* webpackChunkName: "set-residence-modal"  */'../SetResidenceModal'));

const AppModals = ({ is_set_residence_modal_visible, url_action_param }) => {
    let ComponentToLoad = null;
    switch (url_action_param) {
        case 'reset_password':
            ComponentToLoad = <ResetPasswordModal />;
            break;
        case 'signup':
            ComponentToLoad = <AccountSignupModal />;
            break;
        default:
            if (is_set_residence_modal_visible) {
                ComponentToLoad = <SetResidenceModal />;
            }
            break;
    }

    return ComponentToLoad ? (
        <React.Suspense fallback={ <div /> }>
            {ComponentToLoad}
        </React.Suspense>
    ) : null;
};

export default connect(({ ui }) => ({
    is_set_residence_modal_visible: ui.is_set_residence_modal_visible,
}))(AppModals);
