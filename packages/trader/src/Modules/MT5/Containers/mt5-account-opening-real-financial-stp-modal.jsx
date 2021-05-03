import React from 'react';
import { Modal, MobileDialog, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import MT5FinancialStpRealAccountSignup from 'Modules/MT5/Containers/mt5-financial-stp-real-account-signup.jsx';

const MT5AccountOpeningRealFinancialStpModal = ({
    disableApp,
    disableMt5FinancialStpModal,
    enableApp,
    is_mt5_financial_stp_modal_open,
}) => (
    <React.Fragment>
        <DesktopWrapper>
            <Modal
                id='mt5_financial_stp_signup_modal'
                className='mt5-financial-stp-signup-modal'
                disableApp={disableApp}
                width='904px'
                title={localize('Create a DMT5 real Financial STP account')}
                enableApp={enableApp}
                is_open={is_mt5_financial_stp_modal_open}
                has_close_icon={true}
                height='740px'
                toggleModal={disableMt5FinancialStpModal}
            >
                <MT5FinancialStpRealAccountSignup toggleModal={disableMt5FinancialStpModal} />
            </Modal>
        </DesktopWrapper>
        <MobileWrapper>
            <MobileDialog
                portal_element_id='modal_root'
                title={localize('Create a DMT5 real Financial STP account')}
                wrapper_classname='mt5-financial-stp-signup-modal'
                visible={is_mt5_financial_stp_modal_open}
                onClose={disableMt5FinancialStpModal}
            >
                <MT5FinancialStpRealAccountSignup toggleModal={disableMt5FinancialStpModal} />
            </MobileDialog>
        </MobileWrapper>
    </React.Fragment>
);

export default connect(({ ui, modules }) => ({
    disableApp: ui.disableApp,
    disableMt5FinancialStpModal: modules.mt5.disableMt5FinancialStpModal,
    enableApp: ui.enableApp,
    is_mt5_financial_stp_modal_open: modules.mt5.is_mt5_financial_stp_modal_open,
}))(MT5AccountOpeningRealFinancialStpModal);
