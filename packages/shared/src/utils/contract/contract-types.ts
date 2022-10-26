import { ContractUpdate } from '@deriv/api-types';

export type TStatus = 'open' | 'sold' | 'won' | 'lost' | 'cancelled';

export type TGetFinalPrice = {
    sell_price: number;
    bid_price: number;
};

export type TIsEnded = Partial<TGetFinalPrice> & {
    is_valid_to_sell?: 0 | 1;
    status?: TStatus;
    is_expired?: 0 | 1;
    is_settleable?: 0 | 1;
};

export type TContractInfo = {
    tick_stream?: TTickItem[];
    cancellation?: {
        ask_price?: number;
        date_expiry?: number;
    };
    status?: TStatus;
    is_expired?: 0 | 1;
    is_settleable?: 0 | 1;
    is_valid_to_cancel?: 0 | 1;
    entry_spot?: number;
    profit?: number;
    entry_tick_time?: number;
    entry_tick?: number;
    current_spot_time?: number;
    current_spot?: number;
    barrier?: string;
    contract_type?: string;
    exit_tick_time?: number;
    date_expiry?: number;
    is_path_dependent?: 0 | 1;
    sell_time?: number | null;
    tick_count?: number;
    date_start?: number;
    is_forward_starting?: 0 | 1;
};

export type TIsValidToSell = TIsEnded & {
    is_valid_to_sell: 0 | 1;
};

export type TTickItem = {
    epoch?: number;
    tick?: null | number;
    tick_display_value?: null | string;
};

export type TDigitsInfo = { [key: number]: { digit: number; spot: string } };

export type TGetTotalProfit = {
    bid_price: number;
    buy_price: number;
};

type TLimitProperty = {
    display_name?: string;
    order_amount?: null | number;
    order_date?: number;
    value?: null | string;
};

export type TLimitOrder = Partial<Record<'stop_loss' | 'stop_out' | 'take_profit', TLimitProperty>>;

export type TGetDisplayStatus = TGetTotalProfit & {
    status: TStatus;
};

export type TGetContractUpdateConfig = {
    contract_update: ContractUpdate;
    limit_order: TLimitOrder;
};
