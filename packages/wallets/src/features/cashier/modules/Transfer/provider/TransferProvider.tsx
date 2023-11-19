import React, { createContext, useContext, useEffect } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api';
import { useExtendedTransferAccountProperties, useSortedTransferAccounts } from '../hooks';

export type TTransferContext = {
    accounts: ReturnType<typeof useExtendedTransferAccountProperties>['accounts'];
    activeWallet: ReturnType<typeof useExtendedTransferAccountProperties>['activeWallet'];
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
    const {
        accounts,
        activeWallet,
        isLoading: isModifiedAccountsLoading,
    } = useExtendedTransferAccountProperties(data?.accounts);
    const sortedAccounts = useSortedTransferAccounts(accounts);
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
