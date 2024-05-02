import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    useAccountLimits,
    useActiveAccount,
    useCryptoConfig,
    useCryptoWithdrawal,
    useCurrencyConfig,
    useExchangeRateSubscription,
    usePOA,
    usePOI,
} from '@deriv/api-v2';
import type { THooks } from '../../../hooks/types';
import { TWithdrawalReceipt } from '../types';

export type TWithdrawalCryptoContext = {
    accountLimits: ReturnType<typeof useAccountLimits>['data'];
    activeAccount: ReturnType<typeof useActiveAccount>['data'];
    cryptoConfig: ReturnType<typeof useCryptoConfig>['data'];
    exchangeRates: Partial<ReturnType<typeof useExchangeRateSubscription>>;
    fractionalDigits: {
        crypto?: number;
        fiat?: number;
    };
    getConvertedCryptoAmount: (fiatInput: number | string) => string;
    getConvertedFiatAmount: (cryptoInput: number | string) => string;
    getCurrencyConfig: ReturnType<typeof useCurrencyConfig>['getConfig'];
    isClientVerified: boolean | undefined;
    isWithdrawalError: ReturnType<typeof useCryptoWithdrawal>['isError'];
    isWithdrawalSuccess: ReturnType<typeof useCryptoWithdrawal>['isSuccess'];
    requestCryptoWithdrawal: (values: Parameters<THooks.CryptoWithdrawal>[0]) => void;
    resetWithdrawalVerification: () => void;
    withdrawalReceipt: TWithdrawalReceipt;
};

type TWithdrawalCryptoContextProps = {
    setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
    verificationCode: string;
};

const WithdrawalCryptoContext = createContext<TWithdrawalCryptoContext | null>(null);

export const useWithdrawalCryptoContext = () => {
    const context = useContext(WithdrawalCryptoContext);

    if (!context)
        throw new Error(
            'useWithdrawalCryptoContext() must be called within a component wrapped in WithdrawalCryptoProvider.'
        );

    return context;
};

const WithdrawalCryptoProvider: React.FC<React.PropsWithChildren<TWithdrawalCryptoContextProps>> = ({
    children,
    setVerificationCode,
    verificationCode,
}) => {
    const { data: accountLimits } = useAccountLimits();
    const { data: activeAccount } = useActiveAccount();
    const { data: cryptoConfig } = useCryptoConfig();
    const { data: poaStatus } = usePOA();
    const { data: poiStatus } = usePOI();
    const { isError: isWithdrawalError, isSuccess: isWithdrawalSuccess, mutateAsync } = useCryptoWithdrawal();
    const { getConfig } = useCurrencyConfig();
    const [withdrawalReceipt, setWithdrawalReceipt] = useState<TWithdrawalReceipt>({});
    const { data: exchangeRates, subscribe, unsubscribe } = useExchangeRateSubscription();
    const FRACTIONAL_DIGITS_CRYPTO = activeAccount?.currency_config?.fractional_digits;
    const FRACTIONAL_DIGITS_FIAT = getConfig('USD')?.fractional_digits;

    useEffect(() => {
        if (activeAccount?.currency)
            subscribe({
                base_currency: 'USD',
                loginid: activeAccount.loginid,
                target_currency: activeAccount.currency,
            });
        return () => unsubscribe();
    }, [activeAccount?.currency, activeAccount?.loginid, subscribe, unsubscribe]);

    const getClientVerificationStatus = () => {
        // eslint-disable-next-line sonarjs/prefer-immediate-return
        const isVerified = poaStatus?.is_verified && poiStatus?.is_verified;
        return isVerified;
    };

    const getConvertedCryptoAmount = (fiatInput: number | string) => {
        const value = typeof fiatInput === 'string' ? parseFloat(fiatInput) : fiatInput;
        const convertedValue =
            // eslint-disable-next-line sonarjs/prefer-immediate-return
            !Number.isNaN(value) && exchangeRates?.rates && activeAccount?.currency
                ? (value * exchangeRates?.rates[activeAccount?.currency]).toFixed(FRACTIONAL_DIGITS_CRYPTO)
                : '';
        return convertedValue;
    };

    const getConvertedFiatAmount = (cryptoInput: number | string) => {
        const value = typeof cryptoInput === 'string' ? parseFloat(cryptoInput) : cryptoInput;
        const convertedValue =
            // eslint-disable-next-line sonarjs/prefer-immediate-return
            !Number.isNaN(value) && exchangeRates?.rates && activeAccount?.currency
                ? (value / exchangeRates?.rates[activeAccount?.currency]).toFixed(FRACTIONAL_DIGITS_FIAT)
                : '';

        return convertedValue;
    };

    const requestCryptoWithdrawal = (values: Parameters<THooks.CryptoWithdrawal>[0]) => {
        const { address, amount } = values;
        mutateAsync({
            address,
            amount,
            verification_code: verificationCode,
        }).then(() =>
            setWithdrawalReceipt({
                address,
                amount: amount?.toFixed(activeAccount?.currency_config?.fractional_digits),
                fromAccount: {
                    currency: activeAccount?.currency,
                    loginid: activeAccount?.loginid,
                },
            })
        );
    };

    const resetWithdrawalVerification = () => {
        setVerificationCode('');
    };

    const value = {
        accountLimits,
        activeAccount,
        cryptoConfig,
        exchangeRates: {
            data: exchangeRates,
            subscribe,
            unsubscribe,
        },
        fractionalDigits: {
            crypto: FRACTIONAL_DIGITS_CRYPTO,
            fiat: FRACTIONAL_DIGITS_FIAT,
        },
        getConvertedCryptoAmount,
        getConvertedFiatAmount,
        getCurrencyConfig: getConfig,
        isClientVerified: getClientVerificationStatus(),
        isWithdrawalError,
        isWithdrawalSuccess,
        requestCryptoWithdrawal,
        resetWithdrawalVerification,
        withdrawalReceipt,
    };

    return <WithdrawalCryptoContext.Provider value={value}>{children}</WithdrawalCryptoContext.Provider>;
};

export default WithdrawalCryptoProvider;
