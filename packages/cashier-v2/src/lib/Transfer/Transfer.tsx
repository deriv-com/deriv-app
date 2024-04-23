import React, { useCallback, useEffect } from 'react';
import { useActiveAccount, useCurrencyConfig, useTransferBetweenAccounts } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { TransferForm } from './components';
import { TransferProvider } from './provider';

const Transfer = () => {
    return <TransferForm />;
};

const TransferModule = () => {
    const { data: activeAccount } = useActiveAccount();
    const { getConfig } = useCurrencyConfig();
    const { data: transferAccounts, mutate } = useTransferBetweenAccounts();
    const accounts = transferAccounts?.accounts;

    const requestForAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    useEffect(() => {
        requestForAccounts();
    }, [requestForAccounts]);

    const isLoading = !accounts || !activeAccount || !getConfig;

    if (isLoading) return <Loader />;

    return (
        <TransferProvider accounts={accounts} activeAccount={activeAccount} getConfig={getConfig}>
            <Transfer />
        </TransferProvider>
    );
};

export default TransferModule;
