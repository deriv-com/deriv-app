import React, { createContext, useContext, useEffect, useState } from 'react';
import { useExchangeRateSubscription, useTransferBetweenAccounts } from '@deriv/api-v2';
import { THooks } from '../../../hooks/types';
import { useExtendedTransferAccounts } from '../hooks';

export type TTransferContext = {
    accounts?: ReturnType<typeof useExtendedTransferAccounts>['accounts'];
    activeAccount?: ReturnType<typeof useExtendedTransferAccounts>['activeAccount'];
    isLoading?: boolean;
    setTransferReceipt?: React.Dispatch<React.SetStateAction<any>>;
    transferReceipt?: {
        amount: string;
        fromAccount: ReturnType<typeof useExtendedTransferAccounts>['accounts'][number];
        toAccount: ReturnType<typeof useExtendedTransferAccounts>['accounts'][number];
    };
};

const TransferContext = createContext<TTransferContext | null>(null);

export const useTransfer = () => {
    const context = useContext(TransferContext);

    if (!context) {
        throw new Error('useTransfer() must be called within a component wrapped in TransferProvider.');
    }

    return context;
};

type TTransferProviderProps = {
    accounts: THooks.TransferAccount;
};

const TransferProvider: React.FC<React.PropsWithChildren<TTransferProviderProps>> = ({ accounts, children }) => {
    const {
        accounts: transferAccounts,
        activeAccount,
        isLoading: isExtendedTransferAccountsLoading,
    } = useExtendedTransferAccounts(accounts);

    const { mutateAsync } = useTransferBetweenAccounts();

    const [transferReceipt, setTransferReceipt] = useState();

    const isLoading = isExtendedTransferAccountsLoading;

    const requestTransferBetweenAccounts = values => {
        const { fromAccount, fromAmount, toAccount } = values;

        mutateAsync({
            account_from: fromAccount.loginid,
            account_to: toAccount.loginid,
            amount: fromAccount ? parseFloat(fromAmount) : 0,
            currency: fromAccount.currency,
        });
    };

    return (
        <TransferContext.Provider
            value={{
                accounts: transferAccounts,
                activeAccount,
                isLoading,
                setTransferReceipt,
                transferReceipt,
            }}
        >
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
