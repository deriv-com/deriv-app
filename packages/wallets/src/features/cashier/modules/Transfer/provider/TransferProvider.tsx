import React, { createContext, useContext, useEffect } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api';
import { useModifyTransferAccounts, useSortTransferAccounts } from '../hooks';

export type TTransferContext = {
    accounts: ReturnType<typeof useModifyTransferAccounts>['accounts'];
    activeWallet: ReturnType<typeof useModifyTransferAccounts>['activeWallet'];
    isLoading: boolean;
    mutate: ReturnType<typeof useTransferBetweenAccounts>['mutate'];
};

const TransferContext = createContext<TTransferContext | null>(null);

export const useTransfer = () => {
    const context = useContext(TransferContext);

    if (!context) throw new Error('useTransfer() must be called within a component wrapped in TransferProvider.');

    return context;
};

const TransferProvider = ({ children }: React.PropsWithChildren) => {
    const { data, isLoading: isTransferAccountsLoading, mutate } = useTransferBetweenAccounts();
    const { accounts, activeWallet, isLoading: isModifiedAccountsLoading } = useModifyTransferAccounts(data?.accounts);
    const sortedAccounts = useSortTransferAccounts(accounts);
    const isLoading = isTransferAccountsLoading || isModifiedAccountsLoading || !data;

    useEffect(() => {
        if (!data) mutate({ accounts: 'all' });
    }, [data, mutate]);

    return (
        <TransferContext.Provider value={{ accounts: sortedAccounts, activeWallet, isLoading, mutate }}>
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
