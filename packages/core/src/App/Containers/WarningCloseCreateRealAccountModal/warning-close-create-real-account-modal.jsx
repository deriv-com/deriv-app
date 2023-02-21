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
}) => {
    return (
        <React.Fragment>
            <DesktopWrapper>
                <WarningMessageModal
                    is_closing_create_real_account_modal={is_closing_create_real_account_modal}
                    setIsClosingCreateRealAccountModal={setIsClosingCreateRealAccountModal}
                    closeRealAccountSignup={closeRealAccountSignup}
                />
            </DesktopWrapper>
            <MobileWrapper>
                <WarningMessageModal
                    is_closing_create_real_account_modal={is_closing_create_real_account_modal}
                    setIsClosingCreateRealAccountModal={setIsClosingCreateRealAccountModal}
                    closeRealAccountSignup={closeRealAccountSignup}
                />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ ui }) => ({
    is_closing_create_real_account_modal: ui.is_closing_create_real_account_modal,
    setIsClosingCreateRealAccountModal: ui.setIsClosingCreateRealAccountModal,
    closeRealAccountSignup: ui.closeRealAccountSignup,
}))(withRouter(WarningCloseCreateRealAccountModal));
