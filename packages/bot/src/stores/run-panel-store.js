import { observable, action } from 'mobx';
import { isEnded }            from '../utils/contract';
import { CONTRACT_STAGES }    from '../constants/contract-stage';
import { observer }           from '../utils/observer';

export default class RunPanelStore {
    constructor(root_store) {
        this.root_store = root_store;

        observer.register('bot.running', this.onBotRunningEvent);
        observer.register('bot.stop', this.onBotStopEvent);
        observer.register('contract.status', this.onContractStatusEvent);
        observer.register('bot.contract', this.onBotContractEvent);

        this.setContractStage(CONTRACT_STAGES.not_running);
    }

    @observable contract_stage = {};
    @observable is_run_button_clicked = false;
    @observable is_running = false;
    @observable is_dialog_visible = false;
    @observable is_drawer_open = false;

    @action.bound
    onBotRunningEvent() {
        this.is_running = true;
    }

    @action.bound
    onBotStopEvent() {
        this.is_running = false;
        this.setContractStage(CONTRACT_STAGES.not_running);
    }

    @action.bound
    onContractStatusEvent(data) {
        this.getContractStage(data);
    }

    @action.bound
    onBotContractEvent(data) {
        const isClosed = isEnded(data);
        if (isClosed) {
            this.getContractStage({ id: 'contract.closed' });
        }
    }

    @action.bound
    onRunButtonClick = () => {
        if (!this.root_store.core.client.is_logged_in) {
            this.is_dialog_visible = true;
            return;
        }

        if (!this.is_drawer_open) {
            this.is_drawer_open = true;
        }

        this.root_store.contract_card.is_loading = true;
        this.is_run_button_clicked = true;
        Blockly.BLOCKLY_CLASS_OLD.run();
        this.setContractStage(CONTRACT_STAGES.purchase_sent);
    }

    @action.bound
    setContractStage(contract_stage) {
        this.contract_stage = observable(contract_stage);
    }

    @action.bound
    onStopButtonClick() {
        if (!this.root_store.core.client.is_logged_in) {
            this.is_dialog_visible = true;
            return;
        }
        if (this.is_run_button_clicked) {
            this.setContractStage(CONTRACT_STAGES.bot_is_stopping);
            Blockly.BLOCKLY_CLASS_OLD.stop();
        }
        this.is_run_button_clicked = false;
    }

    @action.bound
    onClearStatClick() {
        // TODO: Wait for bot to finish.
        this.root_store.journal.clearMessages();
        this.root_store.contract_card.clear();
        this.root_store.summary.clear();
    }

    @action.bound
    toggleDrawer(is_open) {
        this.is_drawer_open = is_open;
    }

    @action.bound
    closeModal() {
        this.is_dialog_visible = false;
    }

    getContractStage(data) {
        switch (data.id) {
            case ('contract.purchase_sent'): {
                this.setContractStage(CONTRACT_STAGES.purchase_sent);
                break;
            }
            case ('contract.purchase_recieved'): {
                this.setContractStage(CONTRACT_STAGES.purchase_recieved);
                break;
            }
            case ('contract.closed'):
            case ('contract.sold'): {
                this.setContractStage(CONTRACT_STAGES.contract_closed);
                break;
            }
            default: {
                this.setContractStage(CONTRACT_STAGES.not_running);
            }
        }
    }

    onUnmount() {
        observer.unregister('bot.running', this.onBotRunningEvent);
        observer.unregister('bot.stop', this.onBotStopEvent);
        observer.unregister('contract.status', this.onContractStatusEvent);
        observer.unregister('bot.contract', this.onBotContractEvent);
    }
}
