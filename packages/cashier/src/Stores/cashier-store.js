import CashierStoree from './Cashier/cashier-store';
import OnRampStore from './Cashier/on-ramp-store';
import TransactionHistoryStore from './Cashier/transaction-history-store';
import ErrorDialog from './error-dialog-store';
import VerificationStore from './verification-store';
import ErrorStore from './error-store';
import PaymentAgentStore from './payment-agent-store';

export default class CashierStore {
    constructor({ root_store, WS }) {
        this.cashier_store = new CashierStoree({ root_store, WS });
        this.onramp = new OnRampStore({ root_store, WS });
        this.error_dialog = new ErrorDialog();
        this.transaction_history = new TransactionHistoryStore({ root_store, WS });
        this.verification_store = new VerificationStore();
        this.error_store = new ErrorStore();
        this.payment_agent_store = new PaymentAgentStore({ root_store, WS });
    }
}
