import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { ApiHelpers, config, load } from '@deriv/bot-skeleton';
import GTM from 'Utils/gtm';
import { getSetting, storeSetting } from 'Utils/settings';
import RootStore from './root-store';

export default class QuickStrategyStore {
    root_store: RootStore;
    is_open = false;
    selected_strategy = 'MARTINGALE';
    active_symbols: any[] = [];

    constructor(root_store: RootStore) {
        makeObservable(this, {
            is_open: observable,
            selected_strategy: observable,
            setFormVisibility: action,
            setSelectedStrategy: action,
        });
        this.root_store = root_store;
        // this.initSymbols();
    }

    setFormVisibility = (is_open: boolean) => {
        this.is_open = is_open;
    };

    setSelectedStrategy = (strategy: string) => {
        this.selected_strategy = strategy;
    };

    initSymbols = () => {
        const { active_symbols } = ApiHelpers.instance;
        const symbols = active_symbols.getAllSymbols(/* should_be_open */ true);
        // eslint-disable-next-line no-console
        console.log(active_symbols);
        const symbol_options = symbols
            // Until Crypto enabled for Dbot
            // .filter((symbol: TSymbol) => symbol.submarket !== 'non_stable_coin')
            .filter(
                (symbol: TSymbol) =>
                    !active_symbols.disabled_submarkets_for_quick_strategy.includes(symbol.submarket) &&
                    !active_symbols.disabled_symbols_for_quick_strategy.includes(symbol.symbol)
            )
            .map((symbol: TSymbol) => ({
                group: symbol.submarket_display,
                text: symbol.symbol_display,
                value: symbol.symbol,
            }));
        // eslint-disable-next-line no-console
        console.log(symbol_options);
    };
}
