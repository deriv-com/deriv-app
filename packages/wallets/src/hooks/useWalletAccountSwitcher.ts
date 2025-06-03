import { useCallback } from 'react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api-v2';

const useWalletAccountSwitcher = () => {
    const { data: authorizeData, switchAccount: _switchAccount } = useAuthorize();
    const { data: walletAccounts } = useWalletAccountsList();

    const switchWalletAccount = useCallback(
        async (loginid: string) => {
            const url = new URL(window.location.href);
            const dtradeAccount = walletAccounts
                ?.find(account => account.loginid === loginid)
                ?.linked_to?.find(linkedAccount => linkedAccount.platform === 'dtrade');

            await _switchAccount(loginid);
            const linkedAccountDetails = authorizeData.account_list?.find(
                account => account.loginid === dtradeAccount?.loginid
            );

            const accountLoginId =
                sessionStorage.getItem('active_wallet_loginid') || sessionStorage.getItem('active_loginid') || '';
            const accountParam = /^VR/.test(accountLoginId)
                ? 'demo'
                : authorizeData.account_list?.find(account => account.loginid === accountLoginId)?.currency;
            if (accountParam) {
                url.searchParams.set('account', accountParam);
                window.history.replaceState({}, '', url.toString());
            }

            if (dtradeAccount?.loginid && !linkedAccountDetails?.is_disabled) {
                sessionStorage.setItem('active_loginid', dtradeAccount.loginid);
            }
        },
        [_switchAccount, authorizeData.account_list, walletAccounts]
    );

    return switchWalletAccount;
};

export default useWalletAccountSwitcher;
