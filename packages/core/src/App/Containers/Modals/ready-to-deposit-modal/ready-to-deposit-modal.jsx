import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const ReadyToDepositModal = ({
    is_open,
    onClose,
    disableApp,
    enableApp,
    openRealAccountSignup,
    is_eu_user,
    is_pre_appstore,
}) => {
    const createAccount = () => {
        if (is_eu_user) {
            onClose();
            openRealAccountSignup('maltainvest');
        } else {
            onClose();
            openRealAccountSignup();
        }
    };

    return (
        <Dialog
            className={is_pre_appstore && 'open-real-account-dialog'}
            title={localize('Ready to deposit and trade for real?')}
            confirm_button_text={localize('Add real account')}
            onConfirm={createAccount}
            cancel_button_text={localize('Stay in demo')}
            onCancel={onClose}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_open}
        >
            {localize('You need a real Deriv account to access the cashier.')}
        </Dialog>
    );
};

ReadyToDepositModal.propTypes = {
    is_open: PropTypes.bool,
    onClose: PropTypes.func,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    openRealAccountSignup: PropTypes.func,
    is_eu_user: PropTypes.string,
    is_pre_appstore: PropTypes.bool,
};

export default connect(({ ui, traders_hub, client }) => ({
    is_open: ui.is_ready_to_deposit_modal_visible,
    onClose: ui.toggleReadyToDepositModal,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    openRealAccountSignup: ui.openRealAccountSignup,
    is_eu_user: traders_hub.is_eu_user,
    is_pre_appstore: client.is_pre_appstore,
}))(ReadyToDepositModal);
