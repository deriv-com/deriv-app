import React from 'react';
import { render, screen } from '@testing-library/react';
import FavoriteSymbols from '../favorite-symbols';
import { useGetFavoriteSymbols } from 'AppV2/Hooks/useGetFavoriteSymbols';
import { TCoreStores } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';

jest.mock('AppV2/Hooks/useGetFavoriteSymbols');

const mockFavoriteSymbols = [
    { display_name: 'Symbol 1', symbol: 'SYMBOL1' },
    { display_name: 'Symbol 2', symbol: 'SYMBOL2' },
];

jest.mock('../../MarketCategoryItem', () => jest.fn(() => 'MockedMarketCategoryItem'));
jest.mock('../no-favorite-symbols', () => jest.fn(() => 'No favorite symbols'));

describe('FavoriteSymbols Component', () => {
    const mock_props = {
        selectedSymbol: '',
        setSelectedSymbol: jest.fn(),
        setIsOpen: jest.fn(),
    };
    const mocked_store = {
        modules: {
            markets: {
                favoriteSymbols: [
                    { display_name: 'Symbol 1', symbol: 'SYMBOL1' },
                    { display_name: 'Symbol 2', symbol: 'SYMBOL2' },
                ],
            },
        },
    };

    const MockFavoriteSymbols = (mocked_store: TCoreStores) => {
        return (
            <ModulesProvider store={mocked_store}>
                <FavoriteSymbols {...mock_props} />
            </ModulesProvider>
        );
    };
    it('should render favorite symbols when they exist', () => {
        (useGetFavoriteSymbols as jest.Mock).mockReturnValue(mockFavoriteSymbols);

        render(MockFavoriteSymbols(mockStore(mocked_store)));

        expect(screen.getByText(/MockedMarketCategoryItem/i)).toBeInTheDocument();
        expect(screen.queryByText('No favorite symbols')).not.toBeInTheDocument();
    });

    it('should render NoFavoriteSymbol component when there are no favorite symbols', () => {
        mocked_store.modules.markets.favoriteSymbols = [];
        (useGetFavoriteSymbols as jest.Mock).mockReturnValue([]);

        render(MockFavoriteSymbols(mockStore(mocked_store)));

        expect(screen.queryByText(/MockedMarketCategoryItem/i)).not.toBeInTheDocument();
        expect(screen.getByText('No favorite symbols')).toBeInTheDocument();
    });
});
