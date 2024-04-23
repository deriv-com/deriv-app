import { ReactElement } from 'react';

export type TColumn = {
    key: string;
    label: string;
    extra_class?: '--grow-big' | '--grow-mid';
};

export type TTransaction = {
    barrier: string;
    buy_price: number;
    contract_id: number;
    contract_type: string;
    currency: string;
    date_start: string;
    display_name: string;
    entry_tick: string;
    entry_tick_time: string;
    exit_tick: string;
    exit_tick_time: string;
    is_completed: boolean;
    payout: number;
    profit: number;
    run_id: string;
    shortcode: string;
    tick_count: number;
    transaction_ids: {
        buy: number;
        sell: number;
    };
    underlying: string;
};

export type TTransactions = {
    data: TTransaction;
    type: 'contract' | 'divider';
    loginid: string;
};

export type TStatistics = {
    lost_contracts: number;
    number_of_runs: number;
    total_payout: number;
    total_profit: number;
    total_stake: number;
    won_contracts: number;
};

export type TTransactionStore = {
    transactions: TTransactions[];
    is_transaction_details_modal_open: boolean;
    toggleTransactionDetailsModal: (is_open: boolean) => void;
    statistics: TStatistics;
};

export type TRunPanelStore = {
    statistics: TStatistics;
    toggleStatisticsInfoModal?: () => void;
};

export type TDesktopTransactionTable = {
    transaction_columns: TColumn[];
    transactions: TTransactions[] | undefined;
    result_columns: TColumn[];
    result: TStatistics | undefined;
    account: string;
    balance: string | number;
};

export type TTableCell = {
    label: string | number | ReactElement | undefined;
    loader?: boolean;
    extra_classes?: string[];
};
