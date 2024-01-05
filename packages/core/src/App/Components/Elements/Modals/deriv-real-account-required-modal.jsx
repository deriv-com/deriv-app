import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import './deriv-real-account-required-modal.scss';

const DerivRealAccountRequiredModal = observer(() => {
    const { ui, traders_hub } = useStore();
    const { is_eu_user } = traders_hub;
    const {
        is_deriv_account_needed_modal_visible: is_open,
        openDerivRealAccountNeededModal: onClose,
        disableApp,
        enableApp,
        openRealAccountSignup,
    } = ui;
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
            {localize('A Deriv account will allow you to fund (and withdraw from) your CFDs account(s).')}
        </Dialog>
    );
});

export default DerivRealAccountRequiredModal;
