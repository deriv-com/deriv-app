import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TradingViewModal from '../trading-view-modal';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('TradingViewModal', () => {
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

    it('should render the TradingViewModal component', () => {
        mock_DBot_store?.dashboard?.setTradingViewModalVisibility();
        render(<TradingViewModal />, { wrapper });

        const title = screen.getByText('TradingView Chart');
        expect(title).toBeInTheDocument();
    });

    it('should render the TradingViewModal resize', () => {
        mock_DBot_store?.dashboard?.setTradingViewModalVisibility();
        const { container } = render(<TradingViewModal />, { wrapper });

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(container).toBeInTheDocument();
    });
});
