import type { TRootStore } from '@deriv/stores/types';
import type TradeStore from './src/Stores/Modules/Trading/trade-store';

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

type TOverrideTradeStore = Omit<TradeStore, 'clearContractPurchaseToastBox' | 'contract_purchase_toast_box'> & {
    clearContractPurchaseToastBox: () => void;
    contract_purchase_toast_box: TToastBoxObject;
};

declare module '@deriv/stores' {
    export function useStore(): TRootStore & {
        modules: {
            trade: TOverrideTradeStore;
        };
    };
}
