import React from 'react';
import { connect } from 'Stores/connect';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { withRouter } from 'react-router';
import WarningMessageModal from './warning-close-create-real-account-content';
import './warning-close-create-real-account-modal.scss';

const WarningCloseCreateRealAccountModal = ({
    is_closing_create_real_account_modal,
    setIsClosingCreateRealAccountModal,
    closeRealAccountSignup,
    routing_history,
}) => (
    <React.Fragment>
        <DesktopWrapper>
            <WarningMessageModal
                is_closing_create_real_account_modal={is_closing_create_real_account_modal}
                setIsClosingCreateRealAccountModal={setIsClosingCreateRealAccountModal}
                closeRealAccountSignup={closeRealAccountSignup}
                routing_history={routing_history}
            />
        </DesktopWrapper>
        <MobileWrapper>
            <WarningMessageModal
                is_closing_create_real_account_modal={is_closing_create_real_account_modal}
                setIsClosingCreateRealAccountModal={setIsClosingCreateRealAccountModal}
                closeRealAccountSignup={closeRealAccountSignup}
                routing_history={routing_history}
            />
        </MobileWrapper>
    </React.Fragment>
);

export default connect(({ ui, common }) => ({
    is_closing_create_real_account_modal: ui.is_closing_create_real_account_modal,
    setIsClosingCreateRealAccountModal: ui.setIsClosingCreateRealAccountModal,
    closeRealAccountSignup: ui.closeRealAccountSignup,
    routing_history: common.app_routing_history,
}))(withRouter(WarningCloseCreateRealAccountModal));
