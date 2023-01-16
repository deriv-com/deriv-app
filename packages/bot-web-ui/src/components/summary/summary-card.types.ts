import moment from 'moment';
import SummaryCardStore from 'Stores/summary-card-store';

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

type TToastConfig = {
    key?: number;
    content: string;
    timeout?: number;
    is_bottom?: boolean;
    type?: string;
};

export interface TSummaryCardProps {
    addToast: (toast_config: TToastConfig) => void;
    contract_info?: TContractInfo;
    contract_store: SummaryCardStore;
    current_focus: string | null;
    is_contract_completed: boolean;
    is_contract_loading: boolean;
    is_contract_inactive: boolean;
    is_multiplier: boolean;
    onClickSell: () => void;
    is_sell_requested: boolean;
    removeToast: (key: number) => void;
    server_time: moment.Moment;
    setCurrentFocus: (value: string) => void;
}
