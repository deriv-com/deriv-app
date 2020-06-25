import CashierStore from './Cashier/cashier-store';
import P2pStore from './P2P/p2p-store';

export default class ModulesStore {
    constructor(root_store) {
        this.cashier = new CashierStore({ root_store });
        this.p2p = new P2pStore({ root_store });
    }
}
