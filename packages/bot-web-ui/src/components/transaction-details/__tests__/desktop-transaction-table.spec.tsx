import React from 'react';
import { render, screen } from '@testing-library/react';
import DesktopTransactionTable from '../desktop-transaction-table';
import { TTransactions } from '../transaction-details.types';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mock_row_data = {
    barrier: '8641.67',
    buy_price: 1,
    contract_id: 211133945828,
    contract_type: 'CALL',
    currency: 'USD',
    date_start: '2023-6-21 06:10:20 GMT',
    display_name: 'Volatility 10 (1s) Index',
    entry_tick: '8641.67',
    entry_tick_time: '2023-6-21 06:10:21 GMT',
    exit_tick: '8641.36',
    exit_tick_time: '2023-6-21 06:10:22 GMT',
    is_completed: true,
    payout: 1.95,
    profit: -1,
    run_id: 'run-1687327817157',
    shortcode: 'CALL_1HZ10V_1.95_1687327820_1T_S0P_0',
    tick_count: 1,
    transaction_ids: {
        buy: 421306672788,
        sell: 421306674448,
    },
    underlying: '1HZ10V',
};

const mock_statistics = {
    lost_contracts: 0,
    number_of_runs: 0,
    total_payout: 0,
    total_profit: 0,
    total_stake: 0,
    won_contracts: 0,
};
describe('DesktopTransactionTable', () => {
    it('should render DesktopTransactionTable', () => {
        const transactions: TTransactions[] = [
            {
                type: 'contract',
                data: {
                    ...mock_row_data,
                },
            },
        ];
        render(
            <DesktopTransactionTable
                result_columns={[]}
                result={{
                    ...mock_statistics,
                }}
                transaction_columns={[]}
                transactions={transactions}
            />
        );
        expect(screen.getByTestId('transaction_details_tables')).toBeInTheDocument();
    });

    it('should render DesktopTransactionTable with loader', () => {
        const transactions: TTransactions[] = [
            {
                type: 'contract',
                data: {
                    ...mock_row_data,
                    is_completed: false,
                },
            },
        ];
        render(
            <DesktopTransactionTable
                result_columns={[]}
                result={{
                    ...mock_statistics,
                }}
                transaction_columns={[]}
                transactions={transactions}
            />
        );

        const loaderElements = screen.getAllByTestId('transaction_details_table_cell_loader');
        expect(loaderElements.length).toBeGreaterThan(0);
    });

    it('should render DesktopTransactionTable with profit shown upto 2 decimal', () => {
        const transactions: TTransactions[] = [
            {
                type: 'divider',
                data: {
                    ...mock_row_data,
                },
            },
        ];
        render(
            <DesktopTransactionTable
                result_columns={[]}
                result={{
                    ...mock_statistics,
                    total_profit: 2.5005,
                }}
                transaction_columns={[]}
                transactions={transactions}
            />
        );
        expect(screen.getByTestId('transaction_details_table_profit')).toHaveTextContent('2.50');
    });
});
