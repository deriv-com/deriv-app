import React, { useEffect } from 'react';
import { useActiveWalletAccount, useAuthorize } from '@deriv/api-v2';
import { TransactionsModule } from '../../modules';

const WalletTransactions = () => {
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const loginidQueryParam = queryParams.get('loginid');

        // if loginid query param doesn't match active wallet's loginid on mount, initiate account switching
        if (loginidQueryParam && loginidQueryParam !== activeWallet?.loginid) {
            switchAccount(loginidQueryParam);
        }

        const url = new URL(window.location.href);
        url.searchParams.delete('loginid');
        window.history.replaceState({}, document.title, url.toString());
    }, [activeWallet?.loginid, switchAccount]);

    return <TransactionsModule />;
};

export default WalletTransactions;
