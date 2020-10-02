import React from 'react';
import { isBot, isMT5, urlFor } from '@deriv/shared';
import DenialOfServiceModal from 'App/Components/Elements/Modals/DenialOfServiceModal';
import MT5AccountNeededModal from 'App/Components/Elements/Modals/mt5-account-needed-modal.jsx';
import { connect } from 'Stores/connect';

const AccountSignupModal = React.lazy(() =>
    import(/* webpackChunkName: "account-signup-modal" */ '../AccountSignupModal')
);
const ResetPasswordModal = React.lazy(() =>
    import(/* webpackChunkName: "reset-password-modal" */ '../ResetPasswordModal')
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

const AccountTransferLimit = React.lazy(() =>
    import(/* webpackChunkName: "account-transfer-limit-dialog"  */ '../AccountTransferLimitDialog')
);

const AppModals = ({
    is_account_needed_modal_on,
    is_account_transfer_limit_modal_visible,
    is_account_types_modal_visible,
    is_welcome_modal_visible,
    is_denial_of_service_modal_visible,
    is_reality_check_visible,
    is_set_residence_modal_visible,
    url_action_param,
    switchAccount,
    virtual_account_loginid,
}) => {
    let ComponentToLoad = null;
    switch (url_action_param) {
        case 'reset_password':
            ComponentToLoad = <ResetPasswordModal />;
            break;
        case 'signup':
            ComponentToLoad = <AccountSignupModal />;
            break;
        default:
            // TODO: [deriv-eu] Remove this pop up after EU merge into production
            if (is_denial_of_service_modal_visible) {
                const denialOfServiceOnCancel = () => {
                    const trade_link = isMT5() ? 'user/metatrader' : 'trading';
                    const link_to = isBot() ? 'bot' : trade_link;
                    window.open(urlFor(link_to, { legacy: true }));
                };

                const denialOfServiceOnConfirm = async () => {
                    await switchAccount(virtual_account_loginid);
                };

                ComponentToLoad = (
                    <DenialOfServiceModal
                        onConfirm={denialOfServiceOnConfirm}
                        onCancel={denialOfServiceOnCancel}
                        is_visible={is_denial_of_service_modal_visible}
                    />
                );
            } else if (is_set_residence_modal_visible) {
                ComponentToLoad = <SetResidenceModal />;
            }
            break;
    }

    if (is_account_types_modal_visible) {
        ComponentToLoad = <AccountTypesModal />;
    }

    if (is_account_transfer_limit_modal_visible) {
        ComponentToLoad = <AccountTransferLimit />;
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
    is_account_transfer_limit_modal_visible: ui.is_account_transfer_limit_modal_visible,
    is_set_residence_modal_visible: ui.is_set_residence_modal_visible,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    is_denial_of_service_modal_visible: !client.is_client_allowed_to_visit,
    is_reality_check_visible: client.is_reality_check_visible,
    switchAccount: client.switchAccount,
    virtual_account_loginid: client.virtual_account_loginid,
}))(AppModals);
