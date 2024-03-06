import React, { createContext, useContext, useState } from 'react';
import { useExchangeRateSubscription } from '@deriv/api-v2';
import { THooks } from '../../../hooks/types';
import { useExtendedTransferAccounts } from '../hooks';

type TActiveAccount = ReturnType<typeof useExtendedTransferAccounts>['activeAccount'];

export type TTransferContext = {
    accounts?: ReturnType<typeof useExtendedTransferAccounts>['accounts'];
    activeAccount?: TActiveAccount;
    isLoading?: boolean;
    setTransferReceipt?: React.Dispatch<React.SetStateAction<any>>;
    transferReceipt?: any;
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

    const [transferReceipt, setTransferReceipt] = useState();

    const isLoading = isExtendedTransferAccountsLoading;

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
