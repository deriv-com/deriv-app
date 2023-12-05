import React from 'react';
import { connect } from 'Stores/connect';
import { withRouter } from 'react-router';
import WarningMessageModal from './warning-close-create-real-account-content';
import './warning-close-create-real-account-modal.scss';

const WarningCloseCreateRealAccountModal = props => <WarningMessageModal {...props} />;

export default connect(({ ui, common }) => ({
    is_closing_create_real_account_modal: ui.is_closing_create_real_account_modal,
    setIsClosingCreateRealAccountModal: ui.setIsClosingCreateRealAccountModal,
    closeRealAccountSignup: ui.closeRealAccountSignup,
    routing_history: common.app_routing_history,
    real_account_signup_target: ui.real_account_signup_target,
}))(withRouter(WarningCloseCreateRealAccountModal));
