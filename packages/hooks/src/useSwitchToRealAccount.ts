import { useStore } from '@deriv/stores';
import React from 'react';
import { routes } from '@deriv/shared';
import { useHistory } from 'react-router-dom';

const useSwitchToRealAccount = () => {
    const { client, notifications, ui } = useStore();
    const { account_list, has_active_real_account, is_virtual, switchAccount, accounts, loginid } = client;
    const { showAccountSwitchToRealNotification } = notifications;
    const { toggleReadyToDepositModal } = ui;
    const history = useHistory();

    const switchToReal = React.useCallback(() => {
        if (is_virtual && has_active_real_account) {
            const new_account = account_list?.find(account => {
                const account_loginid = account?.loginid;
                return account_loginid && (account_loginid?.startsWith('CR') || account_loginid?.startsWith('MF'));
            });

            if (new_account && new_account.loginid) {
                const new_loginid = new_account.loginid;
                const is_same_account = loginid === new_loginid;

                if (!is_same_account) {
                    switchAccount(new_loginid);
                    showAccountSwitchToRealNotification(new_loginid, accounts[new_loginid].currency || 'USD');
                }
            }
        } else if (is_virtual && !has_active_real_account) {
            history.push(routes.traders_hub);
            toggleReadyToDepositModal();
        }
    }, [
        accounts,
        loginid,
        account_list,
        has_active_real_account,
        is_virtual,
        switchAccount,
        showAccountSwitchToRealNotification,
        toggleReadyToDepositModal,
        history,
    ]);

    return switchToReal;
};

export default useSwitchToRealAccount;
