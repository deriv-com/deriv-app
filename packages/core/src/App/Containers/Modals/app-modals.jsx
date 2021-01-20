import React from 'react';
import { useLocation } from 'react-router-dom';
import MT5AccountNeededModal from 'App/Components/Elements/Modals/mt5-account-needed-modal.jsx';
import { connect } from 'Stores/connect';

const AccountSignupModal = React.lazy(() =>
    import(/* webpackChunkName: "account-signup-modal" */ '../AccountSignupModal')
);
const ResetPasswordModal = React.lazy(() =>
    import(/* webpackChunkName: "reset-password-modal" */ '../ResetPasswordModal')
);
const RedirectToLoginModal = React.lazy(() =>
    import(/* webpackChunkName: "reset-password-modal" */ '../RedirectToLoginModal')
);
const SetResidenceModal = React.lazy(() =>
    import(/* webpackChunkName: "set-residence-modal"  */ '../SetResidenceModal')
);
const RealityCheckModal = React.lazy(() =>
    import(/* webpackChunkName: "reality-check-modal"  */ '../RealityCheckModal')
);
const AccountTypesModal = React.lazy(() =>
    import(/* webpackChunkName: "account-types-modal"  */ '../AccountTypesModal')
);
const WelcomeModal = React.lazy(() => import(/* webpackChunkName: "welcome-modal"  */ '../WelcomeModal'));

const AppModals = ({
    is_account_needed_modal_on,
    is_account_types_modal_visible,
    is_welcome_modal_visible,
    is_reality_check_visible,
    is_set_residence_modal_visible,
}) => {
    const url_params = new URLSearchParams(useLocation().search);
    const url_action_param = url_params.get('action');

    let ComponentToLoad = null;
    switch (url_action_param) {
        case 'redirect_to_login':
            ComponentToLoad = <RedirectToLoginModal />;
            break;
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

    if (is_account_types_modal_visible) {
        ComponentToLoad = <AccountTypesModal />;
    }

    if (is_welcome_modal_visible) {
        ComponentToLoad = <WelcomeModal />;
    }

    if (is_account_needed_modal_on) {
        ComponentToLoad = <MT5AccountNeededModal />;
    }

    if (is_reality_check_visible) {
        ComponentToLoad = <RealityCheckModal />;
    }

    return ComponentToLoad ? <React.Suspense fallback={<div />}>{ComponentToLoad}</React.Suspense> : null;
};

export default connect(({ client, ui }) => ({
    is_account_types_modal_visible: ui.is_account_types_modal_visible,
    is_welcome_modal_visible: ui.is_welcome_modal_visible,
    is_account_needed_modal_on: ui.is_account_needed_modal_on,
    is_set_residence_modal_visible: ui.is_set_residence_modal_visible,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    is_reality_check_visible: client.is_reality_check_visible,
}))(AppModals);
