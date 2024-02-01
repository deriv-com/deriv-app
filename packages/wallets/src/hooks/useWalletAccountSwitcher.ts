import { useCallback } from 'react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';

const useWalletAccountSwitcher = () => {
    const { switchAccount: _switchAccount } = useAuthorize();
    const { data: walletAccounts } = useWalletAccountsList();

    const switchAccount = useCallback(
        (loginid: string) => {
            const dtradeAccount = walletAccounts
                ?.find(account => account.loginid === loginid)
                ?.linked_to?.find(linkedAccount => linkedAccount.platform === 'dtrade');

            _switchAccount(loginid);
            if (dtradeAccount?.loginid) localStorage.setItem('active_loginid', dtradeAccount.loginid);
        },
        [_switchAccount, walletAccounts]
    );

    return switchAccount;
};

export default useWalletAccountSwitcher;
