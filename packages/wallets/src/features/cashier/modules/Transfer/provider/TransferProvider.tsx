import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
    useAccountLimits,
    useGetExchangeRate,
    useTradingPlatformStatus,
    useTransferBetweenAccounts,
} from '@deriv/api-v2';
import type { THooks } from '../../../../../types';
import { MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '../../../../cfd/constants';
import { useExtendedTransferAccountProperties, useSortedTransferAccounts } from '../hooks';
import type { TAccount, TInitialTransferFormValues } from '../types';

type TReceipt = {
    feeAmount?: string;
    fromAccount: TInitialTransferFormValues['fromAccount'];
    fromAmount: TInitialTransferFormValues['fromAmount'];
    toAccount: TInitialTransferFormValues['toAccount'];
    toAmount: TInitialTransferFormValues['toAmount'];
};

export type TTransferContext = {
    USDExchangeRates?: THooks.ExchangeRate;
    accountLimits?: THooks.AccountLimits;
    accounts: ReturnType<typeof useExtendedTransferAccountProperties>['accounts'];
    activeWallet: ReturnType<typeof useExtendedTransferAccountProperties>['activeWallet'];
    activeWalletExchangeRates?: THooks.ExchangeRate;
    error: ReturnType<typeof useTransferBetweenAccounts>['error'];
    hasPlatformStatus: (account: TAccount) => boolean;
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
    } = useExtendedTransferAccountProperties(
        data?.accounts?.map(account => {
            if (account.account_type === 'mt5') {
                return {
                    ...account,
                    status: 'unavailable',
                };
            }
            return account;
        }) ?? transferAccounts
    );
    const [receipt, setReceipt] = useState<TReceipt>();
    const sortedAccounts = useSortedTransferAccounts(accounts);
    const { getPlatformStatus } = useTradingPlatformStatus();

    const hasPlatformStatus = (account: TInitialTransferFormValues['fromAccount']) => {
        const platformStatus = getPlatformStatus(account?.account_type ?? '');
        return (
            account?.status === TRADING_PLATFORM_STATUS.UNAVAILABLE ||
            account?.status === MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE ||
            platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE
        );
    };

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
                    feeAmount = ((feePercentage / 100) * fromAmount).toFixed(
                        fromAccount?.currencyConfig?.fractional_digits
                    );
                }

                setReceipt({
                    feeAmount,
                    fromAccount,
                    fromAmount,
                    toAccount,
                    toAmount,
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
