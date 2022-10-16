import { WS } from '@deriv/shared';
import { observable, action, runInAction } from 'mobx';
import BaseStore from './base-store';

export default class ActiveSymbolsStore extends BaseStore {
    @observable active_symbols = [];

    @action.bound
    async setActiveSymbols() {
        const { active_symbols, error } = await WS.authorized.activeSymbols();
        runInAction(() => {
            if (!active_symbols.length || error) {
                this.active_symbols = [];
                return;
            }
            this.active_symbols = active_symbols;
        });
    }
}
