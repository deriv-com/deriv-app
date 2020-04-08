import React, { Component } from 'react';
import { Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import MT5FinancialStpRealAccountSignup from 'Modules/MT5/Containers/mt5-financial-stp-real-account-signup.jsx';

class MT5AccountOpeningRealFinancialStpModal extends Component {
    render() {
        const { disableApp, enableApp, is_mt5_financial_stp_modal_open, setMT5FinancialStpModalState } = this.props;

        const toggleModal = () => setMT5FinancialStpModalState(false);

        return (
            <Modal
                id='mt5_financial_stp_signup_modal'
                className='mt5-financial-stp-signup-modal'
                disableApp={disableApp}
                width='904px'
                title={localize('Create a DMT5 real Financial STP account')}
                enableApp={enableApp}
                is_open={is_mt5_financial_stp_modal_open}
                has_close_icon={true}
                toggleModal={toggleModal}
            >
                <MT5FinancialStpRealAccountSignup toggleModal={toggleModal} />
            </Modal>
        );
    }
}

export default connect(({ ui, modules }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_real_financial_stp_password_modal_open: ui.is_real_financial_stp_password_modal_open,
    is_mt5_financial_stp_modal_open: modules.mt5.is_mt5_financial_stp_modal_open,
    setMT5FinancialStpModalState: modules.mt5.setMT5FinancialStpModalState,
    account_type: modules.mt5.account_type,
    openAccount: modules.mt5.openAccount,
    setAccountType: modules.mt5.setAccountType,
}))(MT5AccountOpeningRealFinancialStpModal);
