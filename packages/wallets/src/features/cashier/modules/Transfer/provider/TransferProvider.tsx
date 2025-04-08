import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAccountLimits, useGetExchangeRate, useTransferBetweenAccounts } from '@deriv/api-v2';
import type { THooks } from '../../../../../types';
import { DISABLED_PLATFORM_STATUSES } from '../../../../cfd/constants';
import { useExtendedTransferAccountProperties, useSortedTransferAccounts } from '../hooks';
import type { TInitialTransferFormValues } from '../types';

type TReceipt = {
    feeAmount?: string;
    fromAccount: TInitialTransferFormValues['fromAccount'];
    fromAmount: number;
    toAccount: TInitialTransferFormValues['toAccount'];
    toAmount: number;
};

export type TTransferContext = {
    USDExchangeRates?: THooks.ExchangeRate;
    accountLimits?: THooks.AccountLimits;
    accounts: ReturnType<typeof useExtendedTransferAccountProperties>['accounts'];
    activeWallet: ReturnType<typeof useExtendedTransferAccountProperties>['activeWallet'];
    activeWalletExchangeRates?: THooks.ExchangeRate;
    error: ReturnType<typeof useTransferBetweenAccounts>['error'];
    hasPlatformStatus: (account: TInitialTransferFormValues['fromAccount']) => boolean;
    isLoading: boolean;
    receipt?: TReceipt;
    refetchAccountLimits: ReturnType<typeof useAccountLimits>['refetch'];
    refetchExchangeRates: ReturnType<typeof useGetExchangeRate>['refetch'];
    requestTransferBetweenAccounts: (values: TInitialTransferFormValues) => void;
    resetTransfer: VoidFunction;
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
    const { data, error, isLoading: isTransferAccountsLoading, mutate, mutateAsync } = useTransferBetweenAccounts();
    const {
        accounts,
        activeWallet,
        isLoading: isModifiedAccountsLoading,
    } = useExtendedTransferAccountProperties(data?.accounts ?? transferAccounts);
    const [receipt, setReceipt] = useState<TReceipt>();
    const sortedAccounts = useSortedTransferAccounts(accounts);

    const hasPlatformStatus = (account: TInitialTransferFormValues['fromAccount']) =>
        DISABLED_PLATFORM_STATUSES.includes(
            (account?.status || account?.platformStatus) as (typeof DISABLED_PLATFORM_STATUSES)[number]
        );

    const { data: accountLimits, refetch: refetchAccountLimits } = useAccountLimits();

    const { data: activeWalletExchangeRates, refetch: refetchActiveWalletExchangeRates } = useGetExchangeRate({
        base_currency: activeWallet?.currency ?? 'USD',
        loginid: activeWallet?.loginid,
    });

    const { data: USDExchangeRates, refetch: refetchUSDExchangeRates } = useGetExchangeRate({
        base_currency: 'USD',
        loginid: activeWallet?.loginid,
    });

    const refetchExchangeRates = useCallback(() => {
        refetchUSDExchangeRates();
        const updatedActiveWalletExchangeRates = refetchActiveWalletExchangeRates();

        return updatedActiveWalletExchangeRates;
    }, [refetchUSDExchangeRates, refetchActiveWalletExchangeRates]);

    const isLoading = (!data?.accounts && !transferAccounts) || isTransferAccountsLoading || isModifiedAccountsLoading;

    const requestTransferAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    const requestTransferBetweenAccounts = useCallback(
        (values: TInitialTransferFormValues) => {
            const { fromAccount, fromAmount, toAccount, toAmount } = values;

            const parsedFromAmount = Number.parseFloat(fromAmount);
            const parsedToAmount = Number.parseFloat(toAmount);

            mutateAsync({
                account_from: fromAccount?.loginid,
                account_to: toAccount?.loginid,
                amount: parsedFromAmount,
                currency: fromAccount?.currency,
            }).then(() => {
                const isSameCurrency = fromAccount?.currency === toAccount?.currency;
                let feePercentage, feeAmount;

                if (!isSameCurrency) {
                    feePercentage =
                        fromAccount?.currencyConfig?.transfer_between_accounts.fees[toAccount?.currency || ''] || 0;
                    feeAmount = ((feePercentage / 100) * parsedFromAmount).toFixed(
                        fromAccount?.currencyConfig?.fractional_digits
                    );
                }

                setReceipt({
                    feeAmount,
                    fromAccount,
                    fromAmount: parsedFromAmount,
                    toAccount,
                    toAmount: parsedToAmount,
                });
            });
        },
        [mutateAsync]
    );

    const resetTransfer = useCallback(() => {
        setReceipt(undefined);
        refetchAccountLimits();
        requestTransferAccounts();
    }, [refetchAccountLimits, requestTransferAccounts]);

    useEffect(() => {
        if (!transferAccounts) requestTransferAccounts();
    }, [requestTransferAccounts, transferAccounts]);

    return (
        <TransferContext.Provider
            value={{
                accountLimits,
                accounts: sortedAccounts,
                activeWallet,
                activeWalletExchangeRates,
                error,
                hasPlatformStatus,
                isLoading,
                receipt,
                refetchAccountLimits,
                refetchExchangeRates,
                requestTransferBetweenAccounts,
                resetTransfer,
                USDExchangeRates,
            }}
        >
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
