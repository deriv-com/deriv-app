import { useCallback } from 'react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api-v2';

const useWalletAccountSwitcher = () => {
    const { switchAccount: _switchAccount } = useAuthorize();
    const { data: walletAccounts } = useWalletAccountsList();

    const switchWalletAccount = useCallback(
        async (loginid: string) => {
            const dtradeAccount = walletAccounts
                ?.find(account => account.loginid === loginid)
                ?.linked_to?.find(linkedAccount => linkedAccount.platform === 'dtrade');

            await _switchAccount(loginid);
            if (dtradeAccount?.loginid) localStorage.setItem('active_loginid', dtradeAccount.loginid);
        },
        [_switchAccount, walletAccounts]
    );

    return switchWalletAccount;
};

export default useWalletAccountSwitcher;
