import AccountPromptDialogStore from './account-prompt-dialog-store';
import AccountTransferStore from './account-transfer-store';
import CryptoFiatConverterStore from './crypto-fiat-converter-store';
import DepositStore from './deposit-store';
import ErrorDialogStore from './error-dialog-store';
import ErrorStore from './error-store';
import GeneralStore from './general-store';
import IframeStore from './iframe-store';
import OnRampStore from './on-ramp-store';
import PaymentAgentStore from './payment-agent-store';
import PaymentAgentTransferStore from './payment-agent-transfer-store';
import TransactionHistoryStore from './transaction-history-store';
import VerificationStore from './verification-store';
import WithdrawStore from './withdraw-store';
import { TRootStore, TWebSocket } from 'Types';

type TCashierStoreArgs = {
    root_store: TRootStore;
    WS: TWebSocket;
};

export default class CashierStore {
    account_prompt_dialog: AccountPromptDialogStore;
    account_transfer: AccountTransferStore;
    crypto_fiat_converter: CryptoFiatConverterStore;
    deposit: DepositStore;
    error_dialog: ErrorDialogStore;
    error: ErrorStore;
    general_store: GeneralStore;
    iframe: IframeStore;
    onramp: OnRampStore;
    payment_agent: PaymentAgentStore;
    payment_agent_transfer: PaymentAgentTransferStore;
    transaction_history: TransactionHistoryStore;
    verification: VerificationStore;
    withdraw: WithdrawStore;

    constructor({ root_store, WS }: TCashierStoreArgs) {
        this.account_prompt_dialog = new AccountPromptDialogStore(root_store);
        this.account_transfer = new AccountTransferStore(WS, root_store);
        this.crypto_fiat_converter = new CryptoFiatConverterStore(WS, root_store);
        this.deposit = new DepositStore({ root_store, WS });
        this.error = new ErrorStore();
        this.error_dialog = new ErrorDialogStore();
        this.general_store = new GeneralStore(WS, root_store);
        this.iframe = new IframeStore({ root_store, WS });
        this.onramp = new OnRampStore(WS, root_store);
        this.payment_agent = new PaymentAgentStore({ root_store, WS });
        this.payment_agent_transfer = new PaymentAgentTransferStore({ root_store, WS });
        this.transaction_history = new TransactionHistoryStore(WS, root_store);
        this.verification = new VerificationStore(WS, root_store);
        this.withdraw = new WithdrawStore({ root_store, WS });
    }
}
