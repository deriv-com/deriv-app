import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TradingViewComponent from '../trading-view';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('TradingViewComponent', () => {
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

    it('should render the TradingViewComponent', () => {
        const { container } = render(<TradingViewComponent />, { wrapper });
        expect(container).toBeInTheDocument();
    });
});
