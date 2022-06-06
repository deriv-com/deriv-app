import { WS } from '@deriv/shared';
import { observable, action } from 'mobx';
import BaseStore from './base-store';

export default class ActiveSymbolsStore extends BaseStore {
    @observable active_symbols = [];

    @action.bound
    async setActiveSymbols() {
        const { active_symbols } = await WS.authorized.activeSymbols();
        if (!active_symbols.lenght) {
            this.active_symbols = [];
            return;
        }
        this.active_symbols = active_symbols;
    }
}
