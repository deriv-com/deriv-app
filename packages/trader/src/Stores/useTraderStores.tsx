import React from 'react';
import { useStore } from '@deriv/stores';
import TradeStore from './Modules/Trading/trade-store';

export type TTextValueStrings = {
    text: string;
    value: string;
};

type TContractTypesList = {
    [key: string]: {
        name: string;
        categories: TTextValueStrings[];
    };
};

type TOverrideTradeStore = Omit<TradeStore, 'contract_types_list'> & {
    contract_types_list: TContractTypesList;
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
