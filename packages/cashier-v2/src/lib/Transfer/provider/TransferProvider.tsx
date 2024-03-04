import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useExchangeRateSubscription, useTransferBetweenAccounts } from '@deriv/api';
import { THooks } from '../../../hooks/types';
import { useExtendedTransferAccounts } from '../hooks';

type TTransferAccount = ReturnType<typeof useExtendedTransferAccounts>['accounts'][number];

type TFromAccount = ReturnType<typeof useExtendedTransferAccounts>['activeAccount'] | TTransferAccount;

export type TTransferContext = {
    accounts?: ReturnType<typeof useExtendedTransferAccounts>['accounts'];
    fromAccount?: TFromAccount;
    isLoading?: boolean;
    setFromAccount: React.Dispatch<React.SetStateAction<TTransferAccount>>;
    toAccount?: ReturnType<typeof useExtendedTransferAccounts>['accounts'][number];
};

const TransferContext = createContext<TTransferContext | null>(null);

export const useTransfer = () => {
    const context = useContext(TransferContext);

    if (!context) {
        throw new Error('useTransfer() must be called within a component wrapped in TransferProvider.');
    }

    return context;
};

type TProps = {
    accounts: THooks.TransferAccount;
};

const getInitialToAccount = (
    accounts: ReturnType<typeof useExtendedTransferAccounts>['accounts'],
    activeAccount: ReturnType<typeof useExtendedTransferAccounts>['activeAccount']
) => {
    if (!accounts || !activeAccount) return;

    if (activeAccount.loginid !== accounts[0].loginid) return accounts[0];

    return accounts[1];
};

const TransferProvider: React.FC<React.PropsWithChildren<TProps>> = ({ accounts, children }) => {
    const {
        accounts: transferAccounts,
        activeAccount,
        isLoading: isExtendedTransferAccountsLoading,
    } = useExtendedTransferAccounts(accounts);
    const { data: exchangeRates, isLoading: isExchangeRateLoading } = useExchangeRateSubscription();
    const [fromAccount, setFromAccount] = useState<TTransferContext['fromAccount']>(activeAccount);
    const [toAccount, setToAccount] = useState<TTransferContext['toAccount']>(
        getInitialToAccount(transferAccounts, activeAccount)
    );

    const isLoading = isExtendedTransferAccountsLoading || isExchangeRateLoading;

    // console.log('=> rerender');

    return (
        <TransferContext.Provider
            value={{
                activeAccount,
                accounts: transferAccounts,
                fromAccount,
                isLoading,
                setFromAccount,
                setToAccount,
                toAccount,
            }}
        >
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
