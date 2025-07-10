import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { AccountActions } from 'App/Components/Layout/Header';

type THeaderAccountActions = {
    onClickDeposit: () => void;
    is_traders_hub_routes: boolean;
};

const HeaderAccountActions = observer(({ onClickDeposit, is_traders_hub_routes }: THeaderAccountActions) => {
    const { client, ui, notifications } = useStore();
    const { account_type, balance, currency, is_eu, is_logged_in, is_virtual } = client;
    const {
        account_switcher_disabled_message,
        disableApp,
        enableApp,
        is_account_switcher_disabled,
        is_accounts_switcher_on,
        openRealAccountSignup,
        toggleAccountsDialog,
    } = ui;
    const { is_notifications_visible, notifications: notifications_array, toggleNotificationsModal } = notifications;
    const filtered_notifications = notifications_array.filter(item => !item.only_toast_message);
    return (
        <div id='dt_core_header_acc-info-container' className='acc-info__container'>
            <AccountActions
                acc_switcher_disabled_message={account_switcher_disabled_message}
                account_type={account_type}
                balance={balance}
                currency={currency}
                disableApp={disableApp}
                enableApp={enableApp}
                is_acc_switcher_on={is_accounts_switcher_on}
                is_acc_switcher_disabled={is_account_switcher_disabled}
                is_eu={is_eu}
                is_notifications_visible={is_notifications_visible}
                is_logged_in={is_logged_in}
                is_traders_hub_routes={is_traders_hub_routes}
                is_virtual={is_virtual}
                onClickDeposit={onClickDeposit}
                notifications_count={filtered_notifications.length}
                toggleAccountsDialog={toggleAccountsDialog}
                toggleNotifications={toggleNotificationsModal}
                openRealAccountSignup={openRealAccountSignup}
            />
        </div>
    );
});

export default HeaderAccountActions;
