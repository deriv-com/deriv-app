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
    account_id?: number;
    barrier?: string;
    barrier_count?: number;
    bid_price: number;
    buy_price: number;
    cancellation?: {
        ask_price?: number;
        date_expiry?: number;
    };
    contract_id: number;
    contract_type?: string;
    currency?: string;
    current_spot?: number;
    current_spot_display_value?: string;
    current_spot_time?: number;
    date_expiry?: number;
    date_settlement?: number;
    date_start?: number;
    display_name?: string;
    entry_spot?: number;
    entry_spot_display_value?: string;
    entry_tick?: number;
    entry_tick_display_value?: string;
    entry_tick_time?: number;
    exit_tick_time?: number;
    expiry_time?: number;
    id?: string;
    is_expired?: 0 | 1;
    is_forward_starting?: 0 | 1;
    is_intraday?: number;
    is_path_dependent?: 0 | 1;
    is_settleable?: 0 | 1;
    is_sold?: number;
    is_valid_to_cancel?: 0 | 1;
    is_valid_to_sell: 0 | 1;
    longcode?: string;
    profit: number;
    profit_percentage?: number;
    purchase_time?: number;
    sell_time?: number | null;
    sell_spot?: number;
    shortcode?: string;
    status?: TStatus;
    tick_count?: number;
    tick_stream?: TTickItem[];
    transaction_ids?: { buy?: number };
    underlying?: string;
    validation_error?: string;
    validation_error_code?: string;
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
