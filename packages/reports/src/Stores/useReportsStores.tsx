import React from 'react';
import { useStore } from '@deriv/stores';
import type ProfitStores from './Modules/Profit/profit-store';
import type StatementStores from './Modules/Statement/statement-store';

type TReportsStore = {
    profit_table: Omit<ProfitStores, 'data'> & { data: string[] };
    statement: Omit<
        StatementStores,
        | 'account_statistics'
        | 'action_type'
        | 'date_from'
        | 'date_to'
        | 'filtered_date_range'
        | 'handleDateChange'
        | 'handleFilterChange'
        | 'suffix_icon'
    > & {
        account_statistics: { total_deposits: number; total_withdrawals: number };
        action_type: string;
        date_from: number;
        date_to: number;
        filtered_date_range: {
            duration: number;
            label: string;
            onClick?: () => void;
            value?: string;
        };
        handleDateChange: () => void;
        handleFilterChange: () => void;
        suffix_icon: string;
    };
};

const ReportsStoreContext = React.createContext<TReportsStore | null>(null);

export const ReportsStoreProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const { modules } = useStore();

    return (
        <ReportsStoreContext.Provider value={{ ...modules?.profit_table, ...modules?.statement }}>
            {children}
        </ReportsStoreContext.Provider>
    );
};

export const useReportsStore = () => {
    const store = React.useContext(ReportsStoreContext);

    if (!store) {
        throw new Error('useReportsStore must be used within ReportsStoreProvider');
    }

    return store;
};
