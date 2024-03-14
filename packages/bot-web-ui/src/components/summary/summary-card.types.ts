import { ProposalOpenContract } from '@deriv/api-types';

type TTransactionIds = {
    buy: number;
    sell?: number;
};

type TTickStream = {
    epoch: number;
    tick: number;
    tick_display_value: string;
};

export type TContractInfo = {
    accountID?: number | string;
    account_id: number;
    audit_details?: any;
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
    exit_tick_display_value?: string;
    entry_tick_display_value: string;
    entry_tick_time: number;
    exit_tick_time?: number;
    expiry_time: number;
    exit_tick?: number;
    id: string;
    is_completed?: boolean;
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
    sell_price?: number;
    sell_spot?: number;
    sell_spot_display_value?: string;
    sell_spot_time?: number;
    sell_time?: number;
    shortcode: string;
    status: string;
    tick_count?: number;
    tick_stream?: Array<TTickStream>;
    transaction_ids: TTransactionIds;
    underlying: string;
    validation_error: string;
    validation_error_code?: string;
};

export interface TSummaryCardProps {
    contract_info?: ProposalOpenContract | null;
    is_contract_loading: boolean;
}
