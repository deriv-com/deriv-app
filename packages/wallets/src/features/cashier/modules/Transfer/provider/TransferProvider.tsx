import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api';
import type { THooks } from '../../../../../types';
import { useExtendedTransferAccountProperties, useSortedTransferAccounts } from '../hooks';
import type { TInitialTransferFormValues } from '../types';

type TReceipt = {
    feeAmount?: number;
    feePercentage?: number;
    fromAccount: TInitialTransferFormValues['fromAccount'];
    fromAmount: TInitialTransferFormValues['fromAmount'];
    toAccount: TInitialTransferFormValues['toAccount'];
    toAmount: TInitialTransferFormValues['toAmount'];
};

export type TTransferContext = {
    accounts: ReturnType<typeof useExtendedTransferAccountProperties>['accounts'];
    activeWallet: ReturnType<typeof useExtendedTransferAccountProperties>['activeWallet'];
    isLoading: boolean;
    receipt?: TReceipt;
    requestTransferBetweenAccounts: (values: TInitialTransferFormValues) => void;
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
    const { data, isLoading: isTransferAccountsLoading, mutate, mutateAsync } = useTransferBetweenAccounts();
    const {
        accounts,
        activeWallet,
        isLoading: isModifiedAccountsLoading,
    } = useExtendedTransferAccountProperties(transferAccounts || data?.accounts);
    const [receipt, setReceipt] = useState<TReceipt>();
    const sortedAccounts = useSortedTransferAccounts(accounts);
    const isLoading = (!data && !transferAccounts) || isTransferAccountsLoading || isModifiedAccountsLoading;

    const requestTransferAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    const requestTransferBetweenAccounts = useCallback(
        (values: TInitialTransferFormValues) => {
            const { fromAccount, fromAmount, toAccount, toAmount } = values;
            mutateAsync({
                account_from: fromAccount?.loginid,
                account_to: toAccount?.loginid,
                amount: fromAmount,
                currency: fromAccount?.currency,
            }).then(() => {
                const isSameCurrency = fromAccount?.currency === toAccount?.currency;
                let feePercentage, feeAmount;

                if (!isSameCurrency) {
                    feePercentage =
                        fromAccount?.currencyConfig?.transfer_between_accounts.fees[toAccount?.currency || ''] || 0;
                    feeAmount = Number(
                        (feePercentage * fromAmount).toFixed(fromAccount?.currencyConfig?.fractional_digits)
                    );
                }

                setReceipt({
                    feeAmount,
                    feePercentage,
                    fromAccount,
                    fromAmount,
                    toAccount,
                    toAmount,
                });
            });
        },
        [mutateAsync]
    );

    useEffect(() => {
        if (!transferAccounts) requestTransferAccounts();
    }, [requestTransferAccounts, transferAccounts]);

    return (
        <TransferContext.Provider
            value={{ accounts: sortedAccounts, activeWallet, isLoading, receipt, requestTransferBetweenAccounts }}
        >
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
