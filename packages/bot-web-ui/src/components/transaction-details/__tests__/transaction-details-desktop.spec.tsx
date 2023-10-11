import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, fireEvent, render, screen } from '@testing-library/react';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TransactionDetailsDesktop from '../transaction-details-desktop';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
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

describe('TransactionDetailsDesktop', () => {
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

    it('should render TransactionDetailsDesktop', () => {
        const { container } = render(<TransactionDetailsDesktop />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should open DesktopTransactionTable modal', () => {
        mock_DBot_store?.transactions.toggleTransactionDetailsModal(true);
        render(<TransactionDetailsDesktop />, {
            wrapper,
        });
        expect(screen.getByTestId('transaction_details_tables')).toBeInTheDocument();
    });

    it('should open DesktopTransactionTable modal after resizing screen', () => {
        mock_DBot_store?.transactions.toggleTransactionDetailsModal(true);
        const resizeEvent = new Event('resize');
        render(<TransactionDetailsDesktop />, {
            wrapper,
        });

        act(() => {
            window.dispatchEvent(resizeEvent);
        });

        const draggable_element = screen.getByTestId('react-rnd-wrapper');
        const computedStyle = window.getComputedStyle(draggable_element);
        const transformValue = computedStyle.getPropertyValue('transform');

        expect(transformValue).toBe('translate(-1034px,0px)');
    });

    it('should close DesktopTransactionTable modal', () => {
        mock_DBot_store?.transactions.toggleTransactionDetailsModal(true);
        render(<TransactionDetailsDesktop />, {
            wrapper,
        });
        const close_btn = screen.getByTestId('react-rnd-close-modal');
        fireEvent.click(close_btn);
        expect(mock_DBot_store?.transactions.is_transaction_details_modal_open).toBeFalsy();
    });
});
