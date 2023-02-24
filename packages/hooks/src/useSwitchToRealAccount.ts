import { useStore } from '@deriv/stores';
import React from 'react';

const useSwitchToRealAccount = () => {
    const { client, notifications } = useStore();
    const { account_list, has_active_real_account, is_virtual, is_pre_appstore, switchAccount, accounts, loginid } =
        client;
    const { showAccountSwitchToRealNotification } = notifications;

    const switchToReal = React.useCallback(() => {
        if (is_pre_appstore && is_virtual && has_active_real_account) {
            const new_account = account_list.find(account => account.loginid?.[0]);

            if (new_account && new_account.loginid) {
                const new_loginid = new_account.loginid;
                const is_same_account = loginid === new_loginid;

                if (!is_same_account) {
                    switchAccount(new_loginid);
                    showAccountSwitchToRealNotification(new_loginid, accounts[new_loginid].currency || 'USD');
                }
            }
        }
    }, [
        accounts,
        loginid,
        account_list,
        has_active_real_account,
        is_pre_appstore,
        is_virtual,
        switchAccount,
        showAccountSwitchToRealNotification,
    ]);

    return switchToReal;
};

export default useSwitchToRealAccount;
