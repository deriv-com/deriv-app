import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { TWebSocket } from 'Types';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TransactionDetailsDesktop from '../transaction-details-desktop';

let mockFunction: boolean | jest.Mock;

jest.mock('lodash.debounce', () => (fn: jest.Mock) => {
    if (!mockFunction) mockFunction = fn;
    return mockFunction;
});

jest.useFakeTimers();

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

describe('TransactionDetailsDesktop', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_websocket = mock_ws as unknown as TWebSocket;

    beforeEach(() => {
        mockFunction = false;
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_websocket);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_websocket} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
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
        jest.advanceTimersByTime(300);

        const draggable_element = screen.getByTestId('dt_react_draggable_content');
        const computedStyle = window.getComputedStyle(draggable_element);
        const transformValue = computedStyle.getPropertyValue('width');

        expect(transformValue).toBe('882px');
        mock_DBot_store?.transactions.toggleTransactionDetailsModal(false);
    });

    it('should close DesktopTransactionTable modal', () => {
        mock_DBot_store?.transactions.toggleTransactionDetailsModal(true);
        const resizeEvent = new Event('resize');
        render(<TransactionDetailsDesktop />, {
            wrapper,
        });
        act(() => {
            window.dispatchEvent(resizeEvent);
        });
        jest.advanceTimersByTime(300);
        const close_btn = screen.getByTestId('dt_react_draggable-close-modal');
        fireEvent.click(close_btn);
        expect(mock_DBot_store?.transactions.is_transaction_details_modal_open).toBeFalsy();
    });
});
