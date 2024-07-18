import TradeStore from './Trading/trade-store';
import PositionsStore from './Positions/positions-store';
import { TCoreStores } from '@deriv/stores/types';
import { TRootStore } from 'Types';

export default class ModulesStore {
    positions: PositionsStore;
    trade: TradeStore;
    cashier: any;

    constructor(root_store: TRootStore, core_store: TCoreStores) {
        this.cashier = core_store.modules.cashier;
        this.trade = new TradeStore({ root_store });
        this.positions = new PositionsStore({ root_store });
    }
}
