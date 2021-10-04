import CashierStoree from './Cashier/cashier-store';
import OnRampStore from './Cashier/on-ramp-store';
import TransactionHistoryStore from './Cashier/transaction-history-store';
import ErrorDialog from './error-dialog-store';

export default class CashierStore {
    constructor({ root_store, WS }) {
        this.cashier_store = new CashierStoree({ root_store, WS });
        this.onramp = new OnRampStore({ root_store, WS });
        this.error_dialog = new ErrorDialog();
        this.transaction_history = new TransactionHistoryStore(WS);
    }
}
