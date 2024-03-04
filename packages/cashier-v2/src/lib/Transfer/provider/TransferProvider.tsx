import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useExchangeRateSubscription, useTransferBetweenAccounts } from '@deriv/api';
import { THooks } from '../../../hooks/types';
import { useExtendedTransferAccounts } from '../hooks';
import { getTransferValidationSchema } from '../utils';

type TExtendedTransferAccount = ReturnType<typeof useExtendedTransferAccounts>;

type TFromAccount =
    | ReturnType<typeof useExtendedTransferAccounts>['activeAccount']
    | TExtendedTransferAccount['accounts'][number];

export type TTransferContext = {
    accounts?: ReturnType<typeof useExtendedTransferAccounts>['accounts'];
    fromAccount?: TFromAccount;
    isLoading?: boolean;
    setFromAccount: React.Dispatch<React.SetStateAction<TExtendedTransferAccount['accounts'][number]>>;
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

type TTransferProviderProps = {
    accounts: THooks.TransferAccount;
};

const getInitialToAccount = (
    accounts: TExtendedTransferAccount['accounts'],
    activeAccount: TExtendedTransferAccount['activeAccount']
) => {
    if (!accounts || !activeAccount) return;

    if (activeAccount.loginid !== accounts[0].loginid) return accounts[0];

    return accounts[1];
};

const TransferProvider: React.FC<React.PropsWithChildren<TTransferProviderProps>> = ({ accounts, children }) => {
    const {
        accounts: transferAccounts,
        activeAccount,
        isLoading: isExtendedTransferAccountsLoading,
    } = useExtendedTransferAccounts(accounts);
    const { data: exchangeRates, isLoading: isExchangeRateLoading } = useExchangeRateSubscription();
    const [fromAccount, setFromAccount] = useState<
        TExtendedTransferAccount['accounts'][number] | TExtendedTransferAccount['activeAccount']
    >(activeAccount);
    const [toAccount, setToAccount] = useState<TExtendedTransferAccount['accounts'][number]>(
        getInitialToAccount(transferAccounts, activeAccount)
    );
    const validationSchema = getTransferValidationSchema({
        fromAccount: {
            balance: parseFloat(fromAccount?.balance ?? '0'),
            currency: fromAccount?.currency,
            fractionalDigits: fromAccount?.currencyConfig?.fractional_digits,
            limits: {
                max: 1000,
                min: 1,
            },
        },
        toAccount: {
            currency: toAccount?.currency,
            fractionalDigits: toAccount?.currencyConfig?.fractional_digits,
        },
    });
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
                validationSchema,
            }}
        >
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
