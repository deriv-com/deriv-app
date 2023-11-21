import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api';
import type { THooks } from '../../../../../types';
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

type TProps = {
    accounts?: THooks.TransferAccount[];
};

const TransferProvider: React.FC<React.PropsWithChildren<TProps>> = ({ accounts: transferAccounts, children }) => {
    const { data, isLoading: isTransferAccountsLoading, mutate } = useTransferBetweenAccounts();
    const {
        accounts,
        activeWallet,
        isLoading: isModifiedAccountsLoading,
    } = useExtendedTransferAccountProperties(transferAccounts || data?.accounts);
    const sortedAccounts = useSortedTransferAccounts(accounts);
    const isLoading = (!data && !transferAccounts) || isTransferAccountsLoading || isModifiedAccountsLoading;

    const requestTransferAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    useEffect(() => {
        if (!transferAccounts) requestTransferAccounts();
    }, [requestTransferAccounts, transferAccounts]);

    return (
        <TransferContext.Provider value={{ accounts: sortedAccounts, activeWallet, isLoading, mutate }}>
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
