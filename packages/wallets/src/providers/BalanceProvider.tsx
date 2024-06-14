import React, { createContext, FC, PropsWithChildren, useContext } from 'react';
import { useBalanceSubscription } from '@deriv/api-v2';

type TBalanceContext = Omit<ReturnType<typeof useBalanceSubscription>, 'subscribe' | 'unsubscribe'>;

type TBalanceProviderProps = {
    balanceData: TBalanceContext;
};

const BalanceContext = createContext<TBalanceContext | null>(null);

const BalanceProvider: FC<PropsWithChildren<TBalanceProviderProps>> = ({ balanceData, children }) => {
    return <BalanceContext.Provider value={balanceData}>{children}</BalanceContext.Provider>;
};

export const useBalanceContext = () => {
    const context = useContext(BalanceContext);
    if (!context) {
        throw new Error('useBalanceContext must be used within BalanceProvider');
    }
    return context;
};

export default BalanceProvider;
