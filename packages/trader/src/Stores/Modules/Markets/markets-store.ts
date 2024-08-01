import { makeObservable, observable, action } from 'mobx';
import { TRootStore } from 'Types';
import BaseStore from 'Stores/base-store';

export default class MarketsStore extends BaseStore {
    // favorites
    favoriteIndicators: string[] = [];
    favoriteSymbols: string[] = [];

    constructor({ root_store }: { root_store: TRootStore }) {
        super({ root_store });

        makeObservable(this, {
            favoriteSymbols: observable,
            favoriteIndicators: observable,
            setFavoriteSymbols: action.bound,
            setFavoriteIndicators: action.bound,
            removeFavoriteSymbol: action.bound,
            removeFavoriteIndicator: action.bound,
        });

        // Initialize localStorage if it doesn't exist
        const existingFavorites = localStorage.getItem('cq-favorites');
        if (!existingFavorites) {
            const initialData = {
                indicators: [],
                'chartTitle&Comparison': [],
            };
            localStorage.setItem('cq-favorites', JSON.stringify(initialData));
        } else {
            const indicators = JSON.parse(existingFavorites).indicators;
            const favoriteSymbols = JSON.parse(existingFavorites)['chartTitle&Comparison'];
            this.favoriteIndicators = indicators;
            this.favoriteSymbols = favoriteSymbols;
        }
    }

    setFavoriteIndicators(indicators: string[]) {
        this.favoriteIndicators = indicators;
        this.syncLocalStorage();
    }

    setFavoriteSymbols(symbols: string[]) {
        this.favoriteSymbols = symbols;
        this.syncLocalStorage();
    }

    removeFavoriteIndicator(indicator: string) {
        this.favoriteIndicators = this.favoriteIndicators.filter(favIndicator => favIndicator !== indicator);
        this.syncLocalStorage();
    }

    removeFavoriteSymbol(symbol: string) {
        this.favoriteSymbols = this.favoriteSymbols.filter(favSymbol => favSymbol !== symbol);
        this.syncLocalStorage();
    }

    syncLocalStorage() {
        const favorites = {
            indicators: this.favoriteIndicators,
            'chartTitle&Comparison': this.favoriteSymbols,
        };
        localStorage.setItem('cq-favorites', JSON.stringify(favorites));
    }
}
