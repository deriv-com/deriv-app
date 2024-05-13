import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TContractInfo } from 'Components/summary/summary-card.types';
import { mock_ws } from 'Utils/mock';
import { mock_contract } from 'Utils/mock/contract';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Transaction from '../transaction';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const buy_id = 12345;
mock_contract.transaction_ids = { buy: buy_id, sell: 6789 };

const mock_click_transaction = jest.fn();

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
        render(
            <Transaction
                contract={mock_contract}
                active_transaction_id={buy_id}
                onClickTransaction={mock_click_transaction}
            />,
            {
                wrapper,
            }
        );

        const transaction_item = screen.getByTestId('dt_transactions_item');
        userEvent.click(transaction_item);
        expect(screen.getByText('Reference IDs')).toBeInTheDocument();
        expect(screen.getByText('12345 (Buy)')).toBeInTheDocument();
        expect(screen.getByText('6789 (Sell)')).toBeInTheDocument();
        expect(screen.getByText('100 ticks')).toBeInTheDocument();
    });

    it('should render the Transaction component with high low barriers and exit time', () => {
        const high_low_barrier: TContractInfo = {
            transaction_ids: { buy: buy_id, sell: 6789 },
            high_barrier: '2',
            low_barrier: '1',
            exit_tick: 6789,
            contract_type: 'HIGH_LOW',
            shortcode: 'HIGH_LOW',
        };

        render(
            <Transaction
                contract={high_low_barrier}
                active_transaction_id={buy_id}
                onClickTransaction={mock_click_transaction}
            />,
            {
                wrapper,
            }
        );

        const transaction_item = screen.getByTestId('dt_transactions_item');
        userEvent.click(transaction_item);
        expect(mock_click_transaction).toBeCalled();
    });
});
