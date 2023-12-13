import React from 'react';
import { useLocation } from 'react-router-dom';

import { ContentFlag, moduleLoader, routes, SessionStore } from '@deriv/shared';

import DerivRealAccountRequiredModal from 'App/Components/Elements/Modals/deriv-real-account-required-modal.jsx';
import MT5AccountNeededModal from 'App/Components/Elements/Modals/mt5-account-needed-modal.jsx';
import RedirectNoticeModal from 'App/Components/Elements/Modals/RedirectNotice';
import { connect } from 'Stores/connect';

import CompletedAssessmentModal from './completed-assessment-modal.jsx';
import ReadyToVerifyModal from './ready-to-verify-modal';
import CooldownWarningModal from './cooldown-warning-modal.jsx';
import MT5Notification from './mt5-notification';
import NeedRealAccountForCashierModal from './need-real-account-for-cashier-modal';
import ReadyToDepositModal from './ready-to-deposit-modal';
import RiskAcceptTestWarningModal from './risk-accept-test-warning-modal';
import TradingAssessmentExistingUser from './trading-assessment-existing-user.jsx';
import VerificationModal from '../VerificationModal';

const AccountSignupModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "account-signup-modal" */ '../AccountSignupModal'))
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
const ResetEmailModal = React.lazy(() => import(/* webpackChunkName: "reset-email-modal"  */ '../ResetEmailModal'));

const UpdateEmailModal = React.lazy(() => import(/* webpackChunkName: "update-email-modal"  */ '../UpdateEmailModal'));

const WarningScamMessageModal = React.lazy(() =>
    import(/* webpackChunkName: "warning-scam-message" */ '../WarningScamMessageModal')
);

const WarningCloseCreateRealAccountModal = React.lazy(() =>
    import(/* webpackChunkName: "warning-close-create-real-account" */ '../WarningCloseCreateRealAccountModal')
);

const VerificationDocumentSubmitted = React.lazy(() =>
    import(/* webpackChunkName: "verification-document-submitted-modal" */ './VerificationDocumentSubmitted')
);

const OneTimeDepositModal = React.lazy(() =>
    import(/* webpackChunkName: "one-time-deposit-modal" */ '../OneTimeDepositModal')
);

const AdditionalKycInfoModal = React.lazy(() =>
    import(
        /* webpackChunkName: "additional-kyc-info-modal" */ '@deriv/account/src/Components/additional-kyc-info-modal'
    )
);

const InformationSubmittedModal = React.lazy(() =>
    import(/* webpackChunkName: "information-submitted-modal" */ './information-submitted-modal')
);

const AppModals = ({
    is_account_needed_modal_on,
    is_closing_create_real_account_modal,
    is_set_residence_modal_visible,
    is_logged_in,
    should_show_cooldown_modal,
    should_show_assessment_complete_modal,
    toggleAccountSignupModal,
    is_trading_assessment_for_new_user_enabled,
    fetchFinancialAssessment,
    setCFDScore,
    content_flag,
    is_mt5_notification_modal_visible,
    active_account_landing_company,
    is_deriv_account_needed_modal_visible,
    is_warning_scam_message_modal_visible,
    is_ready_to_deposit_modal_visible,
    is_trading_experience_incomplete,
    should_show_risk_accept_modal,
    is_need_real_account_for_cashier_modal_visible,
    is_verification_modal_visible,
    is_verification_submitted,
    should_show_one_time_deposit_modal,
    should_show_account_success_modal,
    is_additional_kyc_info_modal_open,
    is_kyc_information_submitted_modal_open,
}) => {
    const temp_session_signup_params = SessionStore.get('signup_query_param');
    const url_params = new URLSearchParams(useLocation().search || temp_session_signup_params);
    const url_action_param = url_params.get('action');

    const is_eu_user = [ContentFlag.LOW_RISK_CR_EU, ContentFlag.EU_REAL, ContentFlag.EU_DEMO].includes(content_flag);

    React.useEffect(() => {
        if (is_logged_in) {
            fetchFinancialAssessment().then(response => {
                setCFDScore(response?.cfd_score ?? 0);
            });
        }
    }, [is_logged_in]);
    if (temp_session_signup_params && window.location.href.includes(routes.onboarding)) {
        toggleAccountSignupModal(true);
    } else {
        SessionStore.remove('signup_query_param');
        toggleAccountSignupModal(false);
    }

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
    } else if (is_warning_scam_message_modal_visible) {
        ComponentToLoad = <WarningScamMessageModal />;
    } else if (is_closing_create_real_account_modal) {
        ComponentToLoad = <WarningCloseCreateRealAccountModal />;
    } else if (is_account_needed_modal_on) {
        ComponentToLoad = <MT5AccountNeededModal />;
    } else if (should_show_cooldown_modal) {
        ComponentToLoad = <CooldownWarningModal />;
    } else if (is_mt5_notification_modal_visible) {
        ComponentToLoad = <MT5Notification />;
    } else if (should_show_assessment_complete_modal) {
        ComponentToLoad = <CompletedAssessmentModal />;
    } else if (is_deriv_account_needed_modal_visible) {
        ComponentToLoad = <DerivRealAccountRequiredModal />;
    } else if (should_show_risk_accept_modal) {
        ComponentToLoad = <RiskAcceptTestWarningModal />;
    }
    if (is_ready_to_deposit_modal_visible) {
        ComponentToLoad = <ReadyToDepositModal />;
    }

    if (is_need_real_account_for_cashier_modal_visible) {
        ComponentToLoad = <NeedRealAccountForCashierModal />;
    }

    if (is_verification_modal_visible) {
        ComponentToLoad = <VerificationModal />;
    }

    if (is_verification_submitted) {
        ComponentToLoad = <VerificationDocumentSubmitted />;
    }

    if (should_show_one_time_deposit_modal) {
        ComponentToLoad = <OneTimeDepositModal />;
    }

    if (should_show_account_success_modal) {
        ComponentToLoad = <ReadyToVerifyModal />;
    }
    if (is_additional_kyc_info_modal_open) {
        ComponentToLoad = <AdditionalKycInfoModal />;
    }

    if (is_kyc_information_submitted_modal_open) {
        ComponentToLoad = <InformationSubmittedModal />;
    }

    return (
        <>
            <RedirectNoticeModal is_logged_in={is_logged_in} is_eu={is_eu_user} portal_id='popup_root' />
            {ComponentToLoad ? <React.Suspense fallback={<div />}>{ComponentToLoad}</React.Suspense> : null}
        </>
    );
};

export default connect(({ client, ui, traders_hub }) => ({
    is_account_needed_modal_on: ui.is_account_needed_modal_on,
    is_closing_create_real_account_modal: ui.is_closing_create_real_account_modal,
    is_set_residence_modal_visible: ui.is_set_residence_modal_visible,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    is_logged_in: client.is_logged_in,
    is_verification_modal_visible: ui.is_verification_modal_visible,
    is_verification_submitted: ui.is_verification_submitted,
    has_maltainvest_account: client.has_maltainvest_account,
    fetchFinancialAssessment: client.fetchFinancialAssessment,
    is_mt5_notification_modal_visible: traders_hub.is_mt5_notification_modal_visible,
    setCFDScore: client.setCFDScore,
    setShouldShowVerifiedAccount: ui.setShouldShowVerifiedAccount,
    should_show_cooldown_modal: ui.should_show_cooldown_modal,
    should_show_assessment_complete_modal: ui.should_show_assessment_complete_modal,
    toggleAccountSignupModal: ui.toggleAccountSignupModal,
    is_trading_assessment_for_new_user_enabled: ui.is_trading_assessment_for_new_user_enabled,
    active_account_landing_company: client.landing_company_shortcode,
    is_deriv_account_needed_modal_visible: ui.is_deriv_account_needed_modal_visible,
    is_warning_scam_message_modal_visible: ui.is_warning_scam_message_modal_visible,
    is_ready_to_deposit_modal_visible: ui.is_ready_to_deposit_modal_visible,
    is_need_real_account_for_cashier_modal_visible: ui.is_need_real_account_for_cashier_modal_visible,
    content_flag: traders_hub.content_flag,
    is_trading_experience_incomplete: client.is_trading_experience_incomplete,
    should_show_risk_accept_modal: ui.should_show_risk_accept_modal,
    should_show_one_time_deposit_modal: ui.should_show_one_time_deposit_modal,
    should_show_account_success_modal: ui.should_show_account_success_modal,
    is_additional_kyc_info_modal_open: ui.is_additional_kyc_info_modal_open,
    is_kyc_information_submitted_modal_open: ui.is_kyc_information_submitted_modal_open,
}))(AppModals);
