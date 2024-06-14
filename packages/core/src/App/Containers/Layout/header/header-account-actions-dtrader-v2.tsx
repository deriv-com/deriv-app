import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { AccountActionsDTraderV2 } from 'App/Components/Layout/Header';

const HeaderAccountActionsDTraderV2 = observer(() => {
    const { client, ui, notifications } = useStore();
    const { account_type, balance, currency, is_eu, is_logged_in, is_virtual } = client;
    const {
        account_switcher_disabled_message,
        is_account_switcher_disabled,
        is_accounts_switcher_on,
        toggleAccountsDialog,
    } = ui;
    const { notifications: notifications_array } = notifications;

    return (
        <div className='header-v2__acc-info__container'>
            <AccountActionsDTraderV2
                acc_switcher_disabled_message={account_switcher_disabled_message}
                account_type={account_type}
                balance={balance}
                currency={currency}
                is_acc_switcher_on={is_accounts_switcher_on}
                is_acc_switcher_disabled={is_account_switcher_disabled}
                is_eu={is_eu}
                is_logged_in={is_logged_in}
                is_virtual={is_virtual}
                notifications_count={notifications_array.length}
                toggleAccountsDialog={toggleAccountsDialog}
            />
        </div>
    );
});

export default HeaderAccountActionsDTraderV2;
