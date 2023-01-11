import React from 'react';
import { useLocation } from 'react-router-dom';
import { moduleLoader } from '@deriv/shared';
import { connect } from 'Stores/connect';
import MT5AccountNeededModal from 'App/Components/Elements/Modals/mt5-account-needed-modal.jsx';
import RedirectNoticeModal from 'App/Components/Elements/Modals/RedirectNotice';
import CooldownWarningModal from './cooldown-warning-modal.jsx';
import TradingAssessmentExistingUser from './trading-assessment-existing-user.jsx';
import CompletedAssessmentModal from './completed-assessment-modal.jsx';
import DerivRealAccountRequiredModal from 'App/Components/Elements/Modals/deriv-real-account-required-modal.jsx';

const AccountSignupModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "account-signup-modal" */ '../AccountSignupModal'))
);
const AcuityDownloadModal = React.lazy(() =>
    import(/* webpackChunkName: "acuity-download-modal"  */ '../AcuityDownloadModal')
);
const CloseMxMltAccountModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "close-mx-mlt-account-modal" */ '../CloseMxMltAccountModal'))
);
const ResetOrUnlinkPasswordModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "reset-or-unlink-password-modal" */ '../ResetOrUnlinkPasswordModal'))
);

const UnlinkPasswordModal = React.lazy(() =>
    import(/* webpackChunkName: "reset-or-unlink-password-modal" */ '../UnlinkPasswordModal')
);

const RedirectToLoginModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "reset-password-modal" */ '../RedirectToLoginModal'))
);
const SetResidenceModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "set-residence-modal"  */ '../SetResidenceModal'))
);
const RealityCheckModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "reality-check-modal"  */ '../RealityCheckModal'))
);
const WelcomeModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "welcome-modal"  */ '../WelcomeModal'))
);
const ResetEmailModal = React.lazy(() => import(/* webpackChunkName: "reset-email-modal"  */ '../ResetEmailModal'));

const UpdateEmailModal = React.lazy(() => import(/* webpackChunkName: "update-email-modal"  */ '../UpdateEmailModal'));

const CloseUKAccountModal = React.lazy(() =>
    import(/* webpackChunkName: "close-mx-mlt-account-modal" */ '../CloseUKAccountModal')
);

const WarningScamMessageModal = React.lazy(() =>
    import(/* webpackChunkName: "warning-scam-message" */ '../WarningScamMessageModal')
);

const AppModals = ({
    is_account_needed_modal_on,
    is_acuity_modal_open,
    is_welcome_modal_visible,
    is_reality_check_visible,
    is_set_residence_modal_visible,
    is_close_mx_mlt_account_modal_visible,
    is_close_uk_account_modal_visible,
    is_eu,
    is_logged_in,
    should_show_cooldown_modal,
    should_show_assessment_complete_modal,
    is_trading_assessment_for_new_user_enabled,
    fetchFinancialAssessment,
    setCFDScore,
    active_account_landing_company,
    is_deriv_account_needed_modal_visible,
    is_warning_scam_message_modal_visible,
}) => {
    const url_params = new URLSearchParams(useLocation().search);
    const url_action_param = url_params.get('action');

    React.useEffect(() => {
        if (is_logged_in) {
            fetchFinancialAssessment().then(response => setCFDScore(response?.cfd_score ?? 0));
        }
    }, [is_logged_in]);

    let ComponentToLoad = null;
    switch (url_action_param) {
        case 'redirect_to_login':
            ComponentToLoad = <RedirectToLoginModal />;
            break;
        case 'reset_password':
            ComponentToLoad = <ResetOrUnlinkPasswordModal />;
            break;
        case 'signup':
            ComponentToLoad = <AccountSignupModal />;
            break;
        case 'request_email':
            ComponentToLoad = <ResetEmailModal />;
            break;
        case 'social_email_change':
            ComponentToLoad = <UnlinkPasswordModal />;
            break;
        case 'system_email_change':
            ComponentToLoad = <UpdateEmailModal />;
            break;
        default:
            if (is_set_residence_modal_visible) {
                ComponentToLoad = <SetResidenceModal />;
            }
            break;
    }

    if (is_acuity_modal_open) {
        ComponentToLoad = <AcuityDownloadModal />;
    }

    if (is_close_mx_mlt_account_modal_visible) {
        ComponentToLoad = <CloseMxMltAccountModal />;
    }

    if (is_close_uk_account_modal_visible) {
        ComponentToLoad = <CloseUKAccountModal />;
    }

    if (is_warning_scam_message_modal_visible) {
        ComponentToLoad = <WarningScamMessageModal />;
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

    if (
        is_logged_in &&
        active_account_landing_company === 'maltainvest' &&
        !is_trading_assessment_for_new_user_enabled
    ) {
        ComponentToLoad = <TradingAssessmentExistingUser />;
    }

    if (should_show_cooldown_modal) {
        ComponentToLoad = <CooldownWarningModal />;
    }

    if (should_show_assessment_complete_modal) {
        ComponentToLoad = <CompletedAssessmentModal />;
    }

    if (is_deriv_account_needed_modal_visible) {
        ComponentToLoad = <DerivRealAccountRequiredModal />;
    }

    return (
        <>
            <RedirectNoticeModal is_logged_in={is_logged_in} is_eu={is_eu} portal_id='popup_root' />
            {ComponentToLoad ? <React.Suspense fallback={<div />}>{ComponentToLoad}</React.Suspense> : null}
        </>
    );
};

export default connect(({ client, ui }) => ({
    is_welcome_modal_visible: ui.is_welcome_modal_visible,
    is_account_needed_modal_on: ui.is_account_needed_modal_on,
    is_acuity_modal_open: ui.is_acuity_modal_open,
    is_close_mx_mlt_account_modal_visible: ui.is_close_mx_mlt_account_modal_visible,
    is_close_uk_account_modal_visible: ui.is_close_uk_account_modal_visible,
    is_set_residence_modal_visible: ui.is_set_residence_modal_visible,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    is_eu: client.is_eu,
    is_logged_in: client.is_logged_in,
    is_reality_check_visible: client.is_reality_check_visible,
    has_maltainvest_account: client.has_maltainvest_account,
    fetchFinancialAssessment: client.fetchFinancialAssessment,
    setCFDScore: client.setCFDScore,
    setShouldShowVerifiedAccount: ui.setShouldShowVerifiedAccount,
    should_show_cooldown_modal: ui.should_show_cooldown_modal,
    should_show_assessment_complete_modal: ui.should_show_assessment_complete_modal,
    is_trading_assessment_for_new_user_enabled: ui.is_trading_assessment_for_new_user_enabled,
    active_account_landing_company: client.landing_company_shortcode,
    is_deriv_account_needed_modal_visible: ui.is_deriv_account_needed_modal_visible,
    is_warning_scam_message_modal_visible: ui.is_warning_scam_message_modal_visible,
}))(AppModals);
