import React, { createContext, useContext, useState } from 'react';
import { useActiveWalletAccount, useCryptoWithdrawal, useCurrencyConfig } from '@deriv/api';
import { THooks } from '../../../../../types';
import { TWithdrawalReceipt } from '../types';

export type TWithdrawalCrypto = {
    activeWallet: ReturnType<typeof useActiveWalletAccount>['data'];
    getCurrencyConfig: ReturnType<typeof useCurrencyConfig>['getConfig'];
    isWithdrawalSuccess: ReturnType<typeof useCryptoWithdrawal>['isSuccess'];
    requestCryptoWithdrawal: (values: Parameters<THooks.CryptoWithdrawal>[0]) => void;
    withdrawalReceipt: TWithdrawalReceipt;
};

const WithdrawalCryptoContext = createContext<TWithdrawalCrypto | null>(null);

export const useWithdrawalCryptoContext = () => {
    const context = useContext(WithdrawalCryptoContext);

    if (!context)
        throw new Error(
            'useWithdrawalCryptoContext() must be called within a component wrapped in WithdrawalCryptoProvider.'
        );

    return context;
};

const WithdrawalCryptoProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isSuccess: isWithdrawalSuccess, mutateAsync } = useCryptoWithdrawal();
    const { getConfig } = useCurrencyConfig();
    const [withdrawalReceipt, setWithdrawalReceipt] = useState<TWithdrawalReceipt>({});

    const requestCryptoWithdrawal = (values: Parameters<THooks.CryptoWithdrawal>[0]) => {
        const { address, amount, verification_code: verificationCode } = values;
        mutateAsync({
            address,
            amount,
            verification_code: verificationCode,
        }).then(() =>
            setWithdrawalReceipt({
                address,
                amount: amount?.toFixed(activeWallet?.currency_config?.fractional_digits),
                currency: activeWallet?.currency,
                landingCompany: activeWallet?.landing_company_name,
            })
        );
    };

    return (
        <WithdrawalCryptoContext.Provider
            value={{
                activeWallet,
                getCurrencyConfig: getConfig,
                isWithdrawalSuccess,
                requestCryptoWithdrawal,
                withdrawalReceipt,
            }}
        >
            {children}
        </WithdrawalCryptoContext.Provider>
    );
};

export default WithdrawalCryptoProvider;
