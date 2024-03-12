import React, { createContext, useContext, useEffect } from 'react';
import { useExchangeRateSubscription } from '@deriv/api-v2';

const TransferAmountConverterContext = createContext(null);

export const useTransferAmountConverter = () => {
    const context = useContext(TransferAmountConverterContext);

    if (!context) {
        throw new Error(
            'useTransferAmountConverter() must be called within a component wrapped in TransferAmountConverterProvider.'
        );
    }
};

export const TransferAmountConverterProvider: React.FC<React.PropsWithChildren> = ({
    children,
    fromAccount,
    toAccount,
    values,
}) => {
    const { data: exchangeRates, isLoading, subscribe, unsubscribe } = useExchangeRateSubscription();

    // useEffect(() => {
    //     console.log('=> from', fromAccount);
    //     if (!isLoading && fromAccount && toAccount) {
    //         subscribe({
    //             base_currency: fromAccount.currency,
    //             target_currency: toAccount.currency,
    //         });
    //     }
    //     return () => unsubscribe();
    // }, [fromAccount, toAccount]);

    return (
        <TransferAmountConverterContext.Provider
            value={{
                exchangeRates,
                isLoading,
            }}
        >
            {children}
        </TransferAmountConverterContext.Provider>
    );
};
