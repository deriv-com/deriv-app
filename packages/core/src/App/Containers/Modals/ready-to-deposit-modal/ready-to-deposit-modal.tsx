import React from 'react';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './ready-to-deposit-modal.scss';

const ReadyToDepositModal = observer(() => {
    const { ui, traders_hub } = useStore();
    const { is_eu_user } = traders_hub;
    const {
        is_ready_to_deposit_modal_visible: is_open,
        toggleReadyToDepositModal: onClose,
        disableApp,
        enableApp,
        openRealAccountSignup,
    } = ui;

    const createAccount = () => {
        onClose();
        return is_eu_user ? openRealAccountSignup('maltainvest') : openRealAccountSignup();
    };

    return (
        <Dialog
            className='ready-to-deposit-dialog'
            title={localize('Ready to deposit and trade for real?')}
            confirm_button_text={localize('Add real account')}
            onConfirm={createAccount}
            cancel_button_text={localize('Maybe later')}
            onCancel={onClose}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_open}
            dismissable={true}
            has_close_icon={false}
            onEscapeButtonCancel={onClose}
        >
            {localize('You need a real Deriv account to access the cashier.')}
        </Dialog>
    );
});

export default ReadyToDepositModal;
