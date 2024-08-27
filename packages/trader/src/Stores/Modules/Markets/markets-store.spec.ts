import { mockStore } from '@deriv/stores';
import MarketsStore from './markets-store';
import { configure } from 'mobx';
import { TRootStore } from 'Types';

configure({ safeDescriptors: false });

let mockedMarketsStore: MarketsStore;

describe('MarketsStore', () => {
    beforeEach(() => {
        localStorage.clear();
        mockedMarketsStore = new MarketsStore({
            root_store: mockStore({}) as unknown as TRootStore,
        });
    });
    it('should initialize localStorage if it does not exist', () => {
        const storedFavorites = JSON.parse(localStorage.getItem('cq-favorites') || '{}');

        expect(storedFavorites).toEqual({
            indicators: [],
            'chartTitle&Comparison': [],
        });
    });
    it('should initialize favoriteIndicators and favoriteSymbols from localStorage', () => {
        const initialData = {
            indicators: ['indicator1', 'indicator2'],
            'chartTitle&Comparison': ['symbol1', 'symbol2'],
        };
        localStorage.setItem('cq-favorites', JSON.stringify(initialData));
        mockedMarketsStore = new MarketsStore({
            root_store: mockStore({}) as unknown as TRootStore,
        });

        expect(mockedMarketsStore.favoriteIndicators).toEqual(initialData.indicators);
        expect(mockedMarketsStore.favoriteSymbols).toEqual(initialData['chartTitle&Comparison']);
    });
    it('should set favoriteIndicators and sync with localStorage', () => {
        const indicators = ['indicator1', 'indicator2'];
        mockedMarketsStore.setFavoriteIndicators(indicators);

        expect(mockedMarketsStore.favoriteIndicators).toEqual(indicators);
        const storedFavorites = JSON.parse(localStorage.getItem('cq-favorites') || '{}');
        expect(storedFavorites.indicators).toEqual(indicators);
    });
    it('should set favoriteSymbols and sync with localStorage', () => {
        const symbols = ['symbol1', 'symbol2'];
        mockedMarketsStore.setFavoriteSymbols(symbols);

        expect(mockedMarketsStore.favoriteSymbols).toEqual(symbols);
        const storedFavorites = JSON.parse(localStorage.getItem('cq-favorites') || '{}');
        expect(storedFavorites['chartTitle&Comparison']).toEqual(symbols);
    });
    it('should remove favoriteIndicator and sync with localStorage', () => {
        const indicators = ['indicator1', 'indicator2'];
        mockedMarketsStore.setFavoriteIndicators(indicators);
        mockedMarketsStore.removeFavoriteIndicator('indicator1');

        expect(mockedMarketsStore.favoriteIndicators).toEqual(['indicator2']);
        const storedFavorites = JSON.parse(localStorage.getItem('cq-favorites') || '{}');
        expect(storedFavorites.indicators).toEqual(['indicator2']);
    });
    it('should remove favoriteSymbol and sync with localStorage', () => {
        const symbols = ['symbol1', 'symbol2'];
        mockedMarketsStore.setFavoriteSymbols(symbols);
        mockedMarketsStore.removeFavoriteSymbol('symbol1');

        expect(mockedMarketsStore.favoriteSymbols).toEqual(['symbol2']);
        const storedFavorites = JSON.parse(localStorage.getItem('cq-favorites') || '{}');
        expect(storedFavorites['chartTitle&Comparison']).toEqual(['symbol2']);
    });
});
