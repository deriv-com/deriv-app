import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import NoSearchResult from '../no-search-result';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('<NoSearchResult />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render tutorials tab', () => {
        render(<NoSearchResult />, { wrapper });

        const no_search_result_component = screen.getByTestId('no-search-result');
        expect(no_search_result_component).toBeInTheDocument();
    });
});
