import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const DerivRealAccountRequiredModal = ({ is_open, onClose, disableApp, enableApp, openRealAccountSignup }) => {
    const createAccount = () => {
        onClose();
        openRealAccountSignup();
    };

    return (
        <Dialog
            title={localize('You’ll need a Deriv account')}
            confirm_button_text={localize('Add Deriv Account')}
            onConfirm={createAccount}
            cancel_button_text={localize('Cancel')}
            onCancel={onClose}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_open}
        >
            {localize('A Deriv account will allow you to fund (and withdraw from) your MT5 account(s).')}
        </Dialog>
    );
};

DerivRealAccountRequiredModal.propTypes = {
    is_open: PropTypes.bool,
    onClose: PropTypes.func,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    openRealAccountSignup: PropTypes.func,
};

export default connect(({ ui }) => ({
    is_open: ui.is_deriv_account_needed_modal_visible,
    onClose: ui.openDerivRealAccountNeededModal,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    openRealAccountSignup: ui.openRealAccountSignup,
}))(DerivRealAccountRequiredModal);
