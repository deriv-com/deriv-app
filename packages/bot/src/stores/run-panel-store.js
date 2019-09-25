
import { observable, action }  from 'mobx';
import { isEnded }             from '../utils/contract';
import { CONTRACT_STAGES }     from '../constants/contract-stage';
import { observer }            from '../utils/observer';

export default class RunPanelStore {
    constructor(rootstore) {
        this.rootstore = rootstore;

        observer.register('bot.running', this.onBotRunningEvent);
        observer.register('bot.stop', this.onBotStopEvent);
        observer.register('contract.status', this.onContractStatusEvent);
        observer.register('bot.contract', this.onBotContractEvent);
    }

    @observable contract_stage = CONTRACT_STAGES.not_running‌;
    @observable is_run_button_clicked = false;
    @observable is_running = false;
    @observable is_dialog_visible = false;

    @action.bound
    onBotRunningEvent() {
        this.is_running = true;
    }

    @action.bound
    onBotStopEvent() {
        this.is_running = false;
        this.contract_stage = CONTRACT_STAGES.bot_is_stopping;
    }

    @action.bound
    onContractStatusEvent(data) {
        this.getContractStage(data);
    }

    @action.bound
    onBotContractEvent(data) {
        const isClosed = isEnded(data);
        if (isClosed) this.getContractStage({ id: 'contract.closed' });
    }

    @action.bound
    onRunButtonClick = () => {
        if (!this.rootstore.core.client.is_logged_in) {
            this.is_dialog_visible = true;
            return;
        }

        this.is_run_button_clicked = true;
        Blockly.BLOCKLY_CLASS_OLD.run();
    }

    @action.bound
    onStopButtonClick() {
        if (!this.rootstore.core.client.is_logged_in) {
            this.is_dialog_visible = true;
            return;
        }
        if (this.is_run_button_clicked) {
            Blockly.BLOCKLY_CLASS_OLD.stop();
        }
        this.is_run_button_clicked = false;
    }

    @action.bound
    onClearStatClick() {
        this.rootstore.journal.clearMessages();
    }

    @action.bound
    closeModal() {
        this.is_dialog_visible = false;
    }

    getContractStage(data) {
        switch (data.id) {
            case ('contract.purchase_sent'): {
                this.contract_stage = CONTRACT_STAGES.purchase_sent;
                break;
            }
            case ('contract.purchase_recieved'): {
                this.contract_stage = CONTRACT_STAGES.purchase_recieved;

                break;
            }
            case ('contract.closed'): {
                this.contract_stage = CONTRACT_STAGES.contract_closed;
                break;
            }
            default: {
                this.contract_stage = CONTRACT_STAGES.not_running‌;
            }
        }
    }
}
