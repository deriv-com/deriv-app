import React, { useCallback, useEffect } from 'react';
import { useActiveWalletAccount, useAuthorize, useTransferBetweenAccounts } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { TransferModule } from '../../modules';
import { TransferNotAvailable } from '../../screens/TransferNotAvailable';

const WalletTransfer = () => {
    const { data, isLoading: isTransferAccountsLoading, mutate } = useTransferBetweenAccounts();
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

    const requestTransferAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    useEffect(() => {
        requestTransferAccounts();
    }, [requestTransferAccounts]);

    if (isTransferAccountsLoading || !data?.accounts) return <Loader />;

    return (
        <TransferNotAvailable accounts={data.accounts}>
            <TransferModule accounts={data.accounts} />
        </TransferNotAvailable>
    );
};

export default WalletTransfer;
