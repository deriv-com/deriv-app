import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import './deriv-real-account-required-modal.scss';

const DerivRealAccountRequiredModal = ({
    is_open,
    onClose,
    disableApp,
    enableApp,
    openRealAccountSignup,
    is_eu_user,
}) => {
    const createAccount = () => {
        if (is_eu_user) {
            onClose();
            openRealAccountSignup('maltainvest');
        } else {
            onClose();
            openRealAccountSignup('svg');
        }
    };

    return (
        <Dialog
            className='open-real-account-dialog'
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
    is_eu_user: PropTypes.string,
};

export default connect(({ ui, traders_hub }) => ({
    is_open: ui.is_deriv_account_needed_modal_visible,
    onClose: ui.openDerivRealAccountNeededModal,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    openRealAccountSignup: ui.openRealAccountSignup,
    is_eu_user: traders_hub.is_eu_user,
}))(DerivRealAccountRequiredModal);
