import React, { createContext, useContext, useEffect, useState } from 'react';
import { useExchangeRateSubscription } from '@deriv/api-v2';
import { THooks } from '../../../hooks/types';
import { useExtendedTransferAccounts } from '../hooks';
import { getTransferValidationSchema } from '../utils';

type TExtendedTransferAccount = ReturnType<typeof useExtendedTransferAccounts>;

type TActiveAccount = ReturnType<typeof useExtendedTransferAccounts>['activeAccount'];

type TFromAccount = TActiveAccount | TExtendedTransferAccount['accounts'][number];

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

    // const validationSchema = !isLoading
    //     ? getTransferValidationSchema({
    //           fromAccount: {
    //               balance: parseFloat(fromAccount?.balance ?? '0'),
    //               currency: fromAccount?.currency,
    //               fractionalDigits: fromAccount?.currencyConfig?.fractional_digits,
    //               limits: {
    //                   max: 1000,
    //                   min: 1,
    //               },
    //           },
    //           toAccount: {
    //               currency: toAccount?.currency,
    //               fractionalDigits: toAccount?.currencyConfig?.fractional_digits,
    //           },
    //       })
    //     : undefined;

    // console.log('=> Provider - fromAccount', fromAccount, ', toAccount', toAccount);

    return (
        <TransferContext.Provider
            value={{
                accounts: transferAccounts,
                activeAccount,
                isLoading,
                transferReceipt,
                setTransferReceipt,
            }}
        >
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
