import React from 'react';
import { useLocation } from 'react-router-dom';
import { ContentFlag, moduleLoader } from '@deriv/shared';
import { connect } from 'Stores/connect';
import MT5AccountNeededModal from 'App/Components/Elements/Modals/mt5-account-needed-modal.jsx';
import RedirectNoticeModal from 'App/Components/Elements/Modals/RedirectNotice';
import CooldownWarningModal from './cooldown-warning-modal.jsx';
import TradingAssessmentExistingUser from './trading-assessment-existing-user.jsx';
import CompletedAssessmentModal from './completed-assessment-modal.jsx';
import DerivRealAccountRequiredModal from 'App/Components/Elements/Modals/deriv-real-account-required-modal.jsx';
import ExitTradersHubModal from './exit-traders-hub-modal';
import RiskAcceptTestWarningModal from './risk-accept-test-warning-modal';

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

const WarningCloseCreateRealAccountModal = React.lazy(() =>
    import(/* webpackChunkName: "warning-close-create-real-account" */ '../WarningCloseCreateRealAccountModal')
);

const AppModals = ({
    is_account_needed_modal_on,
    is_acuity_modal_open,
    is_closing_create_real_account_modal,
    is_welcome_modal_visible,
    is_reality_check_visible,
    is_set_residence_modal_visible,
    is_close_mx_mlt_account_modal_visible,
    is_close_uk_account_modal_visible,
    is_logged_in,
    should_show_cooldown_modal,
    should_show_assessment_complete_modal,
    is_trading_assessment_for_new_user_enabled,
    fetchFinancialAssessment,
    setCFDScore,
    content_flag,
    active_account_landing_company,
    is_deriv_account_needed_modal_visible,
    is_warning_scam_message_modal_visible,
    is_exit_traders_hub_modal_visible,
    is_trading_experience_incomplete,
    should_show_risk_accept_modal,
}) => {
    const url_params = new URLSearchParams(useLocation().search);
    const url_action_param = url_params.get('action');

    const is_eu_user = [ContentFlag.LOW_RISK_CR_EU, ContentFlag.EU_REAL, ContentFlag.EU_DEMO].includes(content_flag);

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

    if (
        is_logged_in &&
        active_account_landing_company === 'maltainvest' &&
        !is_trading_assessment_for_new_user_enabled &&
        is_trading_experience_incomplete &&
        content_flag !== ContentFlag.LOW_RISK_CR_EU &&
        content_flag !== ContentFlag.LOW_RISK_CR_NON_EU
    ) {
        ComponentToLoad = <TradingAssessmentExistingUser />;
    } else if (is_acuity_modal_open) {
        ComponentToLoad = <AcuityDownloadModal />;
    } else if (is_close_mx_mlt_account_modal_visible) {
        ComponentToLoad = <CloseMxMltAccountModal />;
    } else if (is_close_uk_account_modal_visible) {
        ComponentToLoad = <CloseUKAccountModal />;
    } else if (is_warning_scam_message_modal_visible) {
        ComponentToLoad = <WarningScamMessageModal />;
    } else if (is_closing_create_real_account_modal) {
        ComponentToLoad = <WarningCloseCreateRealAccountModal />;
    } else if (is_welcome_modal_visible) {
        ComponentToLoad = <WelcomeModal />;
    } else if (is_account_needed_modal_on) {
        ComponentToLoad = <MT5AccountNeededModal />;
    } else if (is_reality_check_visible) {
        ComponentToLoad = <RealityCheckModal />;
    } else if (should_show_cooldown_modal) {
        ComponentToLoad = <CooldownWarningModal />;
    } else if (should_show_assessment_complete_modal) {
        ComponentToLoad = <CompletedAssessmentModal />;
    } else if (is_deriv_account_needed_modal_visible) {
        ComponentToLoad = <DerivRealAccountRequiredModal />;
    } else if (is_exit_traders_hub_modal_visible) {
        ComponentToLoad = <ExitTradersHubModal />;
    } else if (should_show_risk_accept_modal) {
        ComponentToLoad = <RiskAcceptTestWarningModal />;
    }

    return (
        <>
            <RedirectNoticeModal is_logged_in={is_logged_in} is_eu={is_eu_user} portal_id='popup_root' />
            {ComponentToLoad ? <React.Suspense fallback={<div />}>{ComponentToLoad}</React.Suspense> : null}
        </>
    );
};

export default connect(({ client, ui, traders_hub }) => ({
    is_welcome_modal_visible: ui.is_welcome_modal_visible,
    is_account_needed_modal_on: ui.is_account_needed_modal_on,
    is_acuity_modal_open: ui.is_acuity_modal_open,
    is_closing_create_real_account_modal: ui.is_closing_create_real_account_modal,
    is_close_mx_mlt_account_modal_visible: ui.is_close_mx_mlt_account_modal_visible,
    is_close_uk_account_modal_visible: ui.is_close_uk_account_modal_visible,
    is_set_residence_modal_visible: ui.is_set_residence_modal_visible,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
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
    is_exit_traders_hub_modal_visible: ui.is_exit_traders_hub_modal_visible,
    content_flag: traders_hub.content_flag,
    is_trading_experience_incomplete: client.is_trading_experience_incomplete,
    should_show_risk_accept_modal: ui.should_show_risk_accept_modal,
}))(AppModals);
