import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Transactions from '../transactions';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('Utils/session-storage', () => ({
    ...jest.requireActual('Utils/session-storage'),
    getStoredItemsByUser: jest.fn(() => [
        {
            type: 'contract',
            data: {
                ...mock_contract,
            },
        },
        {
            type: 'divider',
        },
    ]),
}));

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

Object.defineProperties(window.HTMLElement.prototype, {
    offsetHeight: {
        get() {
            return 100;
        },
    },
    offsetWidth: {
        get() {
            return 100;
        },
    },
});

describe('Transactions', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
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
        const { container } = render(<Transactions is_drawer_open />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('There are no transactions to display')).toBeInTheDocument();
        expect(screen.getByText('The bot is not running')).toBeInTheDocument();
    });

    it('should render the Transaction component while bot is starting', () => {
        mock_DBot_store?.run_panel?.setContractStage(1);

        render(<Transactions is_drawer_open />, { wrapper });
        expect(screen.getByText('Entry/Exit spot')).toBeInTheDocument();
    });

    it('should render toggle transaction details modal on view details click', () => {
        mock_DBot_store?.transactions?.transactions.push({
            type: 'contract',
            data: {
                ...mock_contract,
            },
        });

        render(<Transactions is_drawer_open />, { wrapper });

        const detail = screen.getByRole('button', { name: /View Detail/i });
        userEvent.click(detail);

        expect(mock_DBot_store?.transactions?.toggleTransactionDetailsModal).toBeTruthy();
    });

    it('should render transactions with contract rows', () => {
        mock_DBot_store?.transactions?.transactions.push(
            {
                type: 'contract',
                data: {
                    ...mock_contract,
                },
            },
            {
                type: 'divider',
                data: {
                    ...mock_contract,
                },
            }
        );

        render(<Transactions is_drawer_open />, { wrapper });
        expect(screen.getByText('1.2345')).toBeInTheDocument();
    });

    it('should render transactions component with transaction element type null', () => {
        mock_DBot_store?.transactions?.transactions.push({
            type: '',
            data: {
                ...mock_contract,
            },
        });

        render(<Transactions is_drawer_open />, { wrapper });
        expect(screen.getByText('Buy price and P/L')).toBeInTheDocument();
    });

    it('should render transactions component on mobile', () => {
        mock_store.ui.is_mobile = true;
        render(<Transactions is_drawer_open />, { wrapper });

        expect(screen.getByText('There are no transactions to display')).toBeInTheDocument();
    });
});
