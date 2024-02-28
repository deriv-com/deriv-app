import React, { createContext, useContext, useState } from 'react';
import { useActiveAccount, useAllAccountsList, useExchangeRateSubscription } from '@deriv/api';

// export type TTransferContext = {};

const TransferContext = createContext<TTransferContext | null>(null);

export const useTransfer = () => {
    const context = useContext(TransferContext);

    if (!context) {
        throw new Error('useTransfer() must be called within a component wrapped in TransferProvider.');
    }
};

const TransferProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { data: accounts } = useAllAccountsList();
    const { data: activeAccount } = useActiveAccount();
    const { data: exchangeRates } = useExchangeRateSubscription();
    const [fromAccount, setFromAccount] = useState<TTransferContext['fromAccount']>(activeAccount);
    const [toAccount, setToAccount] = useState<TTransferContext['toAccount']>();

    return (
        <TransferContext.Provider value={{ accounts, fromAccount, setFromAccount, setToAccount, toAccount }}>
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
