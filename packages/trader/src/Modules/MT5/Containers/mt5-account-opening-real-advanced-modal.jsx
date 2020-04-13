import React, { Component }         from 'react';
import { Modal }                    from '@deriv/components';
import { localize }                 from '@deriv/translations';
import { connect }                  from 'Stores/connect';
import MT5AdvancedRealAccountSignup from 'Modules/MT5/Containers/mt5-advanced-real-account-signup.jsx';

class MT5AccountOpeningRealAdvancedModal extends Component {
    render() {
        const {
            disableApp,
            enableApp,
            is_mt5_advanced_modal_open,
            setMT5AdvancedModalState,
        } = this.props;

        const toggleModal = () => setMT5AdvancedModalState(false);

        return (
            <Modal
                id='mt5_advanced_signup_modal'
                className='mt5-advanced-signup-modal'
                disableApp={disableApp}
                width='904px'
                title={localize('Create a DMT5 real Advanced account')}
                enableApp={enableApp}
                is_open={is_mt5_advanced_modal_open}
                has_close_icon={true}
                toggleModal={toggleModal}
            >
                <MT5AdvancedRealAccountSignup
                    toggleModal={toggleModal}
                />
            </Modal>
        );
    }
}

export default connect(({ ui, modules }) => ({
    disableApp                          : ui.disableApp,
    enableApp                           : ui.enableApp,
    is_real_advanced_password_modal_open: ui.is_real_advanced_password_modal_open,
    is_mt5_advanced_modal_open          : modules.mt5.is_mt5_advanced_modal_open,
    setMT5AdvancedModalState            : modules.mt5.setMT5AdvancedModalState,
    account_type                        : modules.mt5.account_type,
    openAccount                         : modules.mt5.openAccount,
    setAccountType                      : modules.mt5.setAccountType,
}))(MT5AccountOpeningRealAdvancedModal);
