import React, { useEffect } from 'react';
import { useActiveWalletAccount, useAuthorize } from '@deriv/api-v2';
import { DepositCryptoModule, DepositFiatModule } from '../../modules';

const WalletDeposit = () => {
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const isCrypto = activeWallet?.currency_config?.is_crypto;

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

    return isCrypto ? <DepositCryptoModule /> : <DepositFiatModule />;
};

export default WalletDeposit;
