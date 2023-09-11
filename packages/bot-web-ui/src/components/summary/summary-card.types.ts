type TTransactionIds = {
    buy: number;
};

export type TContractInfo = {
    accountID?: number;
    account_id: number;
    barrier: string;
    barrier_count: number;
    bid_price: number;
    buy_price: number;
    contract_id: number;
    contract_type: string;
    currency: string;
    current_spot: number;
    current_spot_display_value: string;
    current_spot_time: number;
    date_expiry: number;
    date_settlement: number;
    date_start: number;
    display_name: string;
    entry_spot: number;
    entry_spot_display_value: string;
    entry_tick: number;
    entry_tick_display_value: string;
    entry_tick_time: number;
    expiry_time: number;
    id: string;
    is_expired: number;
    is_forward_starting: number;
    is_intraday: number;
    is_path_dependent: number;
    is_settleable: number;
    is_sold: number;
    is_valid_to_cancel: number;
    is_valid_to_sell: number;
    longcode: string;
    payout: number;
    profit: number;
    profit_percentage: number;
    purchase_time: number;
    shortcode: string;
    status: string;
    transaction_ids: TTransactionIds;
    underlying: string;
    validation_error: string;
};

export interface TSummaryCardProps {
    contract_info?: TContractInfo | null;
    is_contract_loading: boolean;
}
