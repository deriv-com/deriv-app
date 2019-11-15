import CashierStore        from './Cashier/cashier-store';

export default class ModulesStore {
    constructor(root_store) {
        this.cashier         = new CashierStore({ root_store });
    }
}
