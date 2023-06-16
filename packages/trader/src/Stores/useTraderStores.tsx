import React from 'react';
import { useStore } from '@deriv/stores';
import TradeStore from './Modules/Trading/trade-store';

type TToastBoxListItem = {
    contract_category: string;
    contract_types: [
        {
            text: string;
            value: string;
        }
    ];
};

type TToastBoxObject = {
    key?: boolean;
    buy_price?: number;
    currency?: string;
    contract_type?: string;
    list?: TToastBoxListItem[];
};

type TOverrideTradeStore = Omit<
    TradeStore,
    | 'accumulator_range_list'
    | 'contract_purchase_toast_box'
    | 'clearContractPurchaseToastBox'
    | 'proposal_info'
    | 'ticks_history_stats'
> & {
    accumulator_range_list?: number[];
    contract_purchase_toast_box: TToastBoxObject;
    clearContractPurchaseToastBox: () => void;
    proposal_info: {
        [key: string]: {
            has_error?: boolean;
            id: string;
            has_increased?: boolean;
            message?: string;
            cancellation?: {
                ask_price: number;
                date_expiry: number;
            };
            growth_rate?: number;
            returns?: string;
            stake: string;
        };
    };
    ticks_history_stats: {
        ticks_stayed_in?: number[];
    };
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
