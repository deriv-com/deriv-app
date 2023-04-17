import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import './deriv-real-account-required-modal.scss';
import { observer, useStore } from '@deriv/stores';

const DerivRealAccountRequiredModal = observer(() => {
    const { ui, traders_hub } = useStore();
    const {
        is_deriv_account_needed_modal_visible,
        openDerivRealAccountNeededModal,
        disableApp,
        enableApp,
        openRealAccountSignup,
    } = ui;
    const { is_eu_user } = traders_hub;
    const createAccount = () => {
        if (is_eu_user) {
            openDerivRealAccountNeededModal();
            openRealAccountSignup('maltainvest');
        } else {
            openDerivRealAccountNeededModal();
            openRealAccountSignup();
        }
    };

    return (
        <Dialog
            className='open-real-account-dialog'
            title={localize('You’ll need a Deriv account')}
            confirm_button_text={localize('Add Deriv Account')}
            onConfirm={createAccount}
            cancel_button_text={localize('Cancel')}
            onCancel={openDerivRealAccountNeededModal}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_deriv_account_needed_modal_visible}
        >
            {localize('A Deriv account will allow you to fund (and withdraw from) your MT5 account(s).')}
        </Dialog>
    );
});

export default DerivRealAccountRequiredModal;
