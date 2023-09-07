import React from 'react';
import { useStore } from '@deriv/stores';
import TradeStore from './Modules/Trading/trade-store';
import moment from 'moment';

type TTextValueStrings = {
    text: string;
    value: string;
};

type TContractTypesList = {
    [key: string]: {
        name: string;
        categories: TTextValueStrings[];
    };
};

type TContractCategoriesList = {
    Multipliers: TContractTypesList;
    'Ups & Downs': TContractTypesList;
    'Highs & Lows': TContractTypesList;
    'Ins & Outs': TContractTypesList;
    'Look Backs': TContractTypesList;
    Digits: TContractTypesList;
    Vanillas: TContractTypesList;
    Accumulators: TContractTypesList;
};

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
    | 'barriers'
    | 'basis_list'
    | 'cancellation_price'
    | 'cancellation_range_list'
    | 'clearContractPurchaseToastBox'
    | 'contract_purchase_toast_box'
    | 'contract_types_list'
    | 'duration_min_max'
    | 'duration_units_list'
    | 'expiry_date'
    | 'expiry_time'
    | 'expiry_type'
    | 'form_components'
    | 'market_close_times'
    | 'market_open_times'
    | 'multiplier_range_list'
    | 'sessions'
    | 'start_dates_list'
    | 'start_time'
    | 'proposal_info'
    | 'trade_types'
    | 'ticks_history_stats'
> & {
    accumulator_range_list?: number[];
    basis_list: Array<TTextValueStrings>;
    cancellation_price?: number;
    cancellation_range_list: Array<TTextValueStrings>;
    clearContractPurchaseToastBox: () => void;
    contract_purchase_toast_box: TToastBoxObject;
    contract_types_list: TContractCategoriesList;
    duration_min_max: {
        [key: string]: { min: number; max: number };
    };
    duration_units_list: Array<TTextValueStrings>;
    expiry_date: string | null;
    expiry_time: string | null;
    expiry_type: string | null;
    form_components: string[];
    market_open_times: string[];
    market_close_times: string[];
    multiplier_range_list: number[];
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
    sessions: Array<{ open: moment.Moment; close: moment.Moment }>;
    start_dates_list: Array<{ text: string; value: number }>;
    start_time: string | null;
    ticks_history_stats: {
        ticks_stayed_in?: number[];
        last_tick_epoch?: number;
    };
    trade_types: { [key: string]: string };
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
