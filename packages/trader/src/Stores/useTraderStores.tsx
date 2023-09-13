import React from 'react';
import { useStore } from '@deriv/stores';
import TradeStore, { TValidationErrors } from './Modules/Trading/trade-store';

type TOverrideTradeStore = Omit<TradeStore, 'validation_errors'> & {
    //TODO: these types can be removed from here and trade-store after base-store is migrated to TS
    validation_errors?: TValidationErrors;
    validation_rules: TradeStore['validation_rules'];
};

const TraderStoreContext = React.createContext<TOverrideTradeStore | null>(null);

export const TraderStoreProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const { modules } = useStore();
    // const memoizedValue = useMemo(() => new TraderStore(), []);

    return <TraderStoreContext.Provider value={modules?.trade}>{children}</TraderStoreContext.Provider>;
};

export const useTraderStore = () => {
    const store = React.useContext(TraderStoreContext);

    if (!store) {
        throw new Error('useTraderStore must be used within TraderStoreProvider');
    }

    return store;
};
