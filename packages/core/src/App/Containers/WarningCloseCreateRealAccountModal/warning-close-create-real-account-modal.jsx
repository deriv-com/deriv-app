import React from 'react';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { withRouter } from 'react-router';
import WarningMessageModal from './warning-close-create-real-account-content';
import './warning-close-create-real-account-modal.scss';
import { observer, useStore } from '@deriv/stores';

const WarningCloseCreateRealAccountModal = observer(() => {
    const { ui, common } = useStore();
    const { app_routing_history: routing_history } = common;
    const { is_closing_create_real_account_modal, setIsClosingCreateRealAccountModal, closeRealAccountSignup } = ui;

    return (
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
});

export default withRouter(WarningCloseCreateRealAccountModal);
