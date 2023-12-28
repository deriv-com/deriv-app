import React from 'react';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

const MT5AccountNeededModal = observer(() => {
    const { client, ui } = useStore();
    const {
        is_account_needed_modal_on,
        account_needed_modal_props: { target, target_label, target_dmt5_label },
        closeAccountNeededModal,
        disableApp,
        enableApp,
        openRealAccountSignup,
    } = ui;
    const { is_eu } = client;
    const dmt5_label = is_eu ? localize('CFDs') : localize('Deriv MT5');
    const deriv_label = is_eu ? localize('Deriv Multipliers') : localize('Deriv');

    const createAccount = () => {
        closeAccountNeededModal();
        openRealAccountSignup(target);
    };

    return (
        <Dialog
            title={localize('You’ll need a {{deriv_account}} account', {
                deriv_account: target_label,
            })}
            confirm_button_text={localize('Add {{deriv_account}} account', {
                deriv_account: target_label,
            })}
            onConfirm={createAccount}
            cancel_button_text={localize('Cancel')}
            onCancel={closeAccountNeededModal}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_account_needed_modal_on}
        >
            <Localize
                i18n_default_text='Please add a {{deriv_account}} account first before adding a {{dmt5_account}} account. Deposits and withdrawals for your {{dmt5_label}} account are done by transferring funds to and from your {{deriv_label}} account.'
                values={{
                    deriv_account: target_label,
                    dmt5_account: target_dmt5_label,
                    dmt5_label,
                    deriv_label,
                }}
            />
        </Dialog>
    );
});

export default MT5AccountNeededModal;
