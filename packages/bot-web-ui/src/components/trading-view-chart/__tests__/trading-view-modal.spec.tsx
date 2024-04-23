import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { TWebSocket } from 'Types';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TradingViewModal from '../trading-view-modal';

let mockFunction: boolean | jest.Mock;

jest.mock('lodash.debounce', () => (fn: jest.Mock) => {
    if (!mockFunction) mockFunction = fn;
    return mockFunction;
});

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('TradingViewModal', () => {
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

    it('should render the TradingViewModal component', () => {
        mock_DBot_store?.dashboard?.setTradingViewModalVisibility();
        render(<TradingViewModal />, { wrapper });

        const title = screen.getByText('TradingView Chart');
        expect(title).toBeInTheDocument();
    });
});
