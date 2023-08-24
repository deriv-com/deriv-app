import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { Text, Dialog } from '@deriv/components';
import { useCashierLocked, useDepositLocked, useIsSystemMaintenance } from '@deriv/hooks';

const CFDServerMaintenanceDialog = observer(() => {
    const { ui } = useStore();
    const { is_system_maintenance_dialog_visible, toggleSystemMaintenanceModal } = ui;
    const is_system_maintenance = useIsSystemMaintenance();
    const is_account_disabled = useDepositLocked() || useCashierLocked();

    let dialog_message;
    let dialog_title = '';

    if (!is_system_maintenance) {
        dialog_title = 'Server Maintenance';
        dialog_message = (
            <Localize
                i18n_default_text='Server maintenance starts at <0>01:00 GMT every Sunday</0>, and it may take up to 2 hours to complete. Services may be disrupted during this time..'
                components={[<Text key={0} weight='bold' size='xxs' />]}
            />
        );
    }
    // if (is_system_maintenance && selected_mt5 is svg) {
    //     const dialog_message = localize('The MT5 Derived SVG server is down.');
    // }
    if (is_account_disabled) {
        dialog_title = 'Account disabled';
        dialog_message = localize('Your account has been disabled. Please contact live chat for more info.');
    }

    return (
        <Dialog
            is_visible={is_system_maintenance_dialog_visible}
            title={localize(dialog_title)}
            confirm_button_text={is_account_disabled && localize('Live Chat')}
            onConfirm={true}
            cancel_button_text={localize('Close')}
            onCancel={() => {
                toggleSystemMaintenanceModal();
            }}
        >
            {dialog_message}
        </Dialog>
    );
});

export default CFDServerMaintenanceDialog;
