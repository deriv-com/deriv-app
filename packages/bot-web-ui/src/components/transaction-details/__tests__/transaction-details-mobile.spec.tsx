import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, render, screen } from '@testing-library/react';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TransactionDetailsMobile from '../transaction-details-mobile';

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

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => true),
}));

jest.mock('../../../utils/session-storage', () => ({
    ...jest.requireActual('../../../utils/session-storage'),
    getStoredItemsByUser: jest.fn(() => [
        {
            type: 'contract',
            data: {
                ...mock_row_data,
            },
        },
        {
            type: 'divider',
        },
    ]),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mock_ws = {
    authorized: {
        subscribeProposalOpenContract: jest.fn(),
        send: jest.fn(),
    },
    storage: {
        send: jest.fn(),
    },
    contractUpdate: jest.fn(),
    subscribeTicksHistory: jest.fn(),
    forgetStream: jest.fn(),
    activeSymbols: jest.fn(),
    send: jest.fn(),
};

describe('TransactionDetailsMobile', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
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
    it('should render TransactionDetailsMobile', () => {
        const { container } = render(<TransactionDetailsMobile />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should open TransactionDetailsMobile modal', () => {
        mock_DBot_store?.transactions.toggleTransactionDetailsModal(true);
        render(<TransactionDetailsMobile />, {
            wrapper,
        });
        expect(screen.getByTestId('transaction_details_cards')).toBeInTheDocument();
    });

    it('should close TransactionDetailsMobile modal', () => {
        mock_DBot_store?.transactions.toggleTransactionDetailsModal(true);
        render(<TransactionDetailsMobile />, {
            wrapper,
        });
        const close_btn = screen.getByTestId('page_overlay_header_close');
        fireEvent.click(close_btn);
        expect(mock_DBot_store?.transactions.is_transaction_details_modal_open).toBeFalsy();
    });

    it('should render TransactionDetailsMobile with loader', () => {
        if (mock_DBot_store) {
            mock_DBot_store.transactions.toggleTransactionDetailsModal(true);
            mock_DBot_store.transactions.onBotContractEvent({
                ...mock_row_data,
                is_completed: false,
            });
        }
        render(<TransactionDetailsMobile />, {
            wrapper,
        });
        const loaderElements = screen.getAllByTestId('transaction_details_card_cell_loader');
        expect(loaderElements.length).toBeGreaterThan(0);
    });
});
