import React from 'react';
import { screen, render } from '@testing-library/react';
import ActiveSymbolsList from '../active-symbols-list';
import TraderProviders from '../../../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';

jest.mock('AppV2/Components/SymbolSearchResults', () => jest.fn(() => <div>MockedSymbolSearchResults</div>));
jest.mock('AppV2/Components/SymbolsSearchField', () => jest.fn(() => <div>MockedSymbolsSearchField</div>));
jest.mock('AppV2/Components/MarketCategories', () => jest.fn(() => <div>MockedMarketCategories</div>));

jest.mock('AppV2/Hooks/useActiveSymbols', () => ({
    ...jest.requireActual('AppV2/Hooks/useActiveSymbols'),
    __esModule: true,
    default: jest.fn(() => ({
        activeSymbols: [],
    })),
}));

describe('<ActiveSymbolsList />', () => {
    const mocked_props = {
        isOpen: true,
        setIsOpen: jest.fn(),
    };
    const mocked_store = {
        modules: {
            trade: {
                symbol: '',
                setTickData: jest.fn(),
            },
        },
    };
    const MockActiveSymbolsList = (
        mocked_store: TCoreStores,
        mocked_props: Parameters<typeof ActiveSymbolsList>[0]
    ) => {
        return (
            <TraderProviders store={mocked_store}>
                <ActiveSymbolsList {...mocked_props} />
            </TraderProviders>
        );
    };
    it('renders SymbolsSearchField', () => {
        render(MockActiveSymbolsList(mockStore(mocked_store), mocked_props));
        expect(screen.getByText('MockedSymbolsSearchField')).toBeInTheDocument();
    });
    it('renders MarketCategories when not searching', () => {
        render(MockActiveSymbolsList(mockStore(mocked_store), mocked_props));
        expect(screen.getByText('MockedMarketCategories')).toBeInTheDocument();
    });
});
