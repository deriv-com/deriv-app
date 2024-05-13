import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useExchangeRateSubscription, useTransferBetweenAccounts } from '@deriv/api-v2';
import { getCryptoFiatConverterValidationSchema } from '../../../components';
import type { THooks } from '../../../hooks/types';
import type { TCurrency } from '../../../types';
import { useExtendedTransferAccounts } from '../hooks';
import type { TTransferableAccounts, TTransferReceipt } from '../types';

export type TTransferContext = {
    accountLimits?: THooks.AccountLimits;
    accounts: TTransferableAccounts;
    activeAccount?: TTransferableAccounts[number];
    exchangeRates?: THooks.ExchangeRatesSubscribable;
    isTransferring: boolean;
    refetchAccountLimits: THooks.AccountLimitsRefetch;
    requestForTransfer: (
        amount: string,
        fromAccount?: TTransferableAccounts[number],
        toAccount?: TTransferableAccounts[number]
    ) => void;
    setTransferReceipt: React.Dispatch<React.SetStateAction<TTransferReceipt | undefined>>;
    setTransferValidationSchema: (
        fromAccount: TTransferableAccounts[number],
        toAccount: TTransferableAccounts[number]
    ) => void;
    subscribeToExchangeRate: (
        baseCurrency: TCurrency,
        targetCurrency: TCurrency,
        loginid: TTransferableAccounts[number]['loginid']
    ) => void;
    transferError: THooks.TransferBetweenAccounts['error'];
    transferReceipt?: TTransferReceipt;
    transferValidationSchema?: ReturnType<typeof getCryptoFiatConverterValidationSchema>;
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
    accountLimits: THooks.AccountLimits;
    accounts?: THooks.TransferAccounts;
    activeAccount: THooks.ActiveAccount;
    getConfig: THooks.GetCurrencyConfig;
    refetchAccountLimits: THooks.AccountLimitsRefetch;
};

const TransferProvider: React.FC<React.PropsWithChildren<TTransferProviderProps>> = ({
    accountLimits,
    accounts,
    activeAccount,
    children,
    getConfig,
    refetchAccountLimits,
}) => {
    const { data, error: transferError, isLoading: isTransferring, mutate, mutateAsync } = useTransferBetweenAccounts();
    const { data: exchangeRates, isSubscribed, subscribe, unsubscribe } = useExchangeRateSubscription();

    const { accounts: transferAccounts, activeAccount: transferActiveAccount } = useExtendedTransferAccounts(
        activeAccount,
        getConfig,
        data?.accounts ?? accounts
    );

    const [validationSchema, setValidationSchema] =
        useState<ReturnType<typeof getCryptoFiatConverterValidationSchema>>();
    const [transferReceipt, setTransferReceipt] = useState<TTransferReceipt>();

    const setTransferValidationSchema = useCallback(
        (fromAccount: TTransferableAccounts[number], toAccount: TTransferableAccounts[number]) => {
            const modifiedFromAccount = {
                balance: parseFloat(fromAccount.balance ?? ''),
                currency: fromAccount.currency as TCurrency,
                fractionalDigits: fromAccount.currencyConfig?.fractional_digits,
                limits: fromAccount.limits,
            };

            const modifiedToAccount = {
                currency: toAccount.currency as TCurrency,
                fractionalDigits: toAccount.currencyConfig?.fractional_digits,
            };

            setValidationSchema(
                getCryptoFiatConverterValidationSchema({
                    fromAccount: modifiedFromAccount,
                    toAccount: modifiedToAccount,
                })
            );
        },
        []
    );

    useEffect(() => {
        if (!accounts) mutate({ accounts: 'all' });
    }, [accounts, mutate]);

    const requestForTransfer = useCallback(
        (amount: string, fromAccount?: TTransferableAccounts[number], toAccount?: TTransferableAccounts[number]) => {
            // These nested mutateAsync calls are done for mitigating the issue for getting
            // the updated list of transferable accounts after performing a transfer as follows:
            // 1. make a call to perform transfer
            // 2. when the promise for (1) resolves, make another call to retrieve updated accounts
            // 3. when the promise for (2) resolves, display the TransferReceipt
            if (Number(amount) && fromAccount && toAccount) {
                mutateAsync({
                    account_from: fromAccount.loginid,
                    account_to: toAccount.loginid,
                    amount: Number(amount),
                    currency: fromAccount.currency,
                }).then(() => {
                    mutateAsync({ accounts: 'all' }).then(() => {
                        setTransferReceipt({
                            amount,
                            fromAccount,
                            toAccount,
                        });
                    });
                });
            }
        },
        [mutateAsync]
    );

    const subscribeToExchangeRate = (
        baseCurrency: TCurrency,
        targetCurrency: TCurrency,
        loginid: TTransferableAccounts[number]['loginid']
    ) => {
        if (isSubscribed) {
            unsubscribe();
        }
        subscribe({
            base_currency: baseCurrency,
            loginid,
            target_currency: targetCurrency,
        });
    };

    return (
        <TransferContext.Provider
            value={{
                accountLimits,
                accounts: transferAccounts,
                activeAccount: transferActiveAccount,
                exchangeRates,
                isTransferring,
                refetchAccountLimits,
                requestForTransfer,
                setTransferReceipt,
                setTransferValidationSchema,
                subscribeToExchangeRate,
                transferError,
                transferReceipt,
                transferValidationSchema: validationSchema,
            }}
        >
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
