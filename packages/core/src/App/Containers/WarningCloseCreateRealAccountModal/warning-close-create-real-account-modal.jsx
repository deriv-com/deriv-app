import React from 'react';
import { withRouter } from 'react-router';
import WarningMessageModal from './warning-close-create-real-account-content';
import './warning-close-create-real-account-modal.scss';
import { observer, useStore } from '@deriv/stores';

const WarningCloseCreateRealAccountModal = observer(() => {
    const { common, ui } = useStore();
    const {
        closeRealAccountSignup,
        is_closing_create_real_account_modal,
        setIsClosingCreateRealAccountModal,
        real_account_signup_target,
    } = ui;
    const { app_routing_history: routing_history } = common;

    return (
        <WarningMessageModal
            closeRealAccountSignup={closeRealAccountSignup}
            is_closing_create_real_account_modal={is_closing_create_real_account_modal}
            setIsClosingCreateRealAccountModal={setIsClosingCreateRealAccountModal}
            real_account_signup_target={real_account_signup_target}
            routing_history={routing_history}
        />
    );
});

export default withRouter(WarningCloseCreateRealAccountModal);
