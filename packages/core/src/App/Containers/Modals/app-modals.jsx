import React from 'react';
import { urlFor } from '_common/url';
import DenialOfServiceModal from 'App/Components/Elements/Modals/DenialOfServiceModal';
import { connect } from 'Stores/connect';
import { isBot, isMT5 } from 'Utils/PlatformSwitcher';

const AccountSignupModal = React.lazy(() =>
    import(/* webpackChunkName: "account-signup-modal" */ '../AccountSignupModal')
);
const ResetPasswordModal = React.lazy(() =>
    import(/* webpackChunkName: "reset-password-modal" */ '../ResetPasswordModal')
);
const SetResidenceModal = React.lazy(() =>
    import(/* webpackChunkName: "set-residence-modal"  */ '../SetResidenceModal')
);
const AccountTypesModal = React.lazy(() =>
    import(/* webpackChunkName: "set-residence-modal"  */ '../AccountTypesModal')
);

const AppModals = ({
    is_account_types_modal_visible,
    is_denial_of_service_modal_visible,
    should_have_real_account,
    is_set_residence_modal_visible,
    url_action_param,
    switchAccount,
    toggleAccountTypesModal,
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
            if (is_denial_of_service_modal_visible) {
                const denialOfServiceOnCancel = () => {
                    const trade_link = isMT5() ? 'user/metatrader' : 'trading';
                    const link_to = isBot() ? 'bot' : trade_link;
                    window.open(urlFor(link_to, undefined, undefined, true));
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
    // Account Types modal
    if (should_have_real_account) {
        toggleAccountTypesModal(true);
    }
    if (is_account_types_modal_visible) {
        ComponentToLoad = <AccountTypesModal />;
    }

    return ComponentToLoad ? <React.Suspense fallback={<div />}>{ComponentToLoad}</React.Suspense> : null;
};

export default connect(({ client, ui }) => ({
    is_account_types_modal_visible: ui.is_account_types_modal_visible,
    is_set_residence_modal_visible: ui.is_set_residence_modal_visible,
    is_denial_of_service_modal_visible: !client.is_client_allowed_to_visit,
    should_have_real_account: client.should_have_real_account,
    switchAccount: client.switchAccount,
    toggleAccountTypesModal: ui.toggleAccountTypesModal,
    virtual_account_loginid: client.virtual_account_loginid,
}))(AppModals);
