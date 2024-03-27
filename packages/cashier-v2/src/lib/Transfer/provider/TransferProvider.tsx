import React, { createContext, useContext, useState } from 'react';
import { THooks } from '../../../hooks/types';
import { useExtendedTransferAccounts } from '../hooks';
import { TTransferableAccounts, TTransferReceipt } from '../types';

export type TTransferContext = {
    accounts?: TTransferableAccounts;
    activeAccount?: TTransferableAccounts[number];
    isLoading?: boolean;
    setTransferReceipt?: React.Dispatch<React.SetStateAction<TTransferReceipt | undefined>>;
    transferReceipt?: TTransferReceipt;
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
    accounts: THooks.TransferAccounts;
};

const TransferProvider: React.FC<React.PropsWithChildren<TTransferProviderProps>> = ({ accounts, children }) => {
    const {
        accounts: transferAccounts,
        activeAccount: transferActiveAccount,
        isLoading,
    } = useExtendedTransferAccounts(accounts);

    const [transferReceipt, setTransferReceipt] = useState<TTransferReceipt>();

    return (
        <TransferContext.Provider
            value={{
                accounts: transferAccounts,
                activeAccount: transferActiveAccount,
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
