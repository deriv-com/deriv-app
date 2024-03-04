import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Transaction from '../transaction';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mock_contract = {
    transaction_ids: { buy: '12345', sell: '6789' },
    underlying: 'EURUSD',
    entry_tick: 1.2345,
    exit_tick: 1.6789,
    entry_tick_time: '5pm',
    exit_tick_time: '6pm',
    date_start: 10,
    tick_count: 100,
    buy_price: 50,
    currency: 'USD',
    profit: 30,
    barrier: 3,
    is_completed: true,
    contract_type: 'CALL',
    shortcode: 'CALL_BARRIER',
};

describe('Transaction', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the Transaction component', () => {
        const { container } = render(<Transaction />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render transaction details when a contract is provided', () => {
        render(<Transaction contract={mock_contract} />, { wrapper });

        expect(screen.getByText('1.2345')).toBeInTheDocument();
        expect(screen.getByText('1.6789')).toBeInTheDocument();
        expect(screen.getByText('50.00 USD')).toBeInTheDocument();
        expect(screen.getByText('30.00 USD')).toBeInTheDocument();
    });

    it('should render the Transaction component and trigger onClick', () => {
        render(<Transaction contract={mock_contract} />, {
            wrapper,
        });

        const transaction_item = screen.getByTestId('dt_transactions_item');
        userEvent.click(transaction_item);
        expect(screen.getByText('Reference IDs')).toBeInTheDocument();
        expect(screen.getByText('12345 (Buy)')).toBeInTheDocument();
        expect(screen.getByText('6789 (Sell)')).toBeInTheDocument();
        expect(screen.getByText('100 ticks')).toBeInTheDocument();
    });

    it('should render the Transaction component with high low barriers and exit time', () => {
        const high_low_barrier = {
            transaction_ids: { buy: '12345', sell: '6789' },
            high_barrier: 2,
            low_barrier: 1,
            exit_tick: 6789,
            contract_type: 'HIGH_LOW',
            shortcode: 'HIGH_LOW',
        };

        render(<Transaction contract={high_low_barrier} />, {
            wrapper,
        });

        const transaction_item = screen.getByTestId('dt_transactions_item');
        userEvent.click(transaction_item);
        expect(screen.getByText('2 (High)')).toBeInTheDocument();
        expect(screen.getByText('1 (Low)')).toBeInTheDocument();
        expect(screen.getByText('Exit time')).toBeInTheDocument();
    });
});
