import AccountTransferStore from './account-transfer-store';
import CashierStoree from './Cashier/cashier-store';
import CryptoFiatConverterStore from './crypto-fiat-converter-store';
import ErrorDialog from './error-dialog-store';
import ErrorStore from './error-store';
import OnRampStore from './Cashier/on-ramp-store';
import PaymentAgentStore from './payment-agent-store';
import PaymentAgentTransferStore from './payment-agent-transfer-store';
import TransactionHistoryStore from './Cashier/transaction-history-store';
import VerificationStore from './verification-store';

export default class CashierStore {
    constructor({ root_store, WS }) {
        this.account_transfer_store = new AccountTransferStore({ root_store, WS });
        this.cashier_store = new CashierStoree({ root_store, WS });
        this.crypto_fiat_converter_store = new CryptoFiatConverterStore({ root_store, WS });
        this.error_dialog = new ErrorDialog();
        this.error_store = new ErrorStore();
        this.onramp = new OnRampStore({ root_store, WS });
        this.payment_agent_store = new PaymentAgentStore({ root_store, WS });
        this.payment_agent_transfer_store = new PaymentAgentTransferStore({ root_store, WS });
        this.transaction_history = new TransactionHistoryStore({ root_store, WS });
        this.verification_store = new VerificationStore({ root_store, WS });
    }
}
