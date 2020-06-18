import CashierStore from './Cashier/cashier-store';
import SendbirdStore from './SendBird/sendbird-store';

export default class ModulesStore {
    constructor(root_store) {
        this.cashier = new CashierStore({ root_store });
        this.sendbird = new SendbirdStore({ root_store });
    }
}
