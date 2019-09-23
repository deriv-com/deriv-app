
import { observable, action } from 'mobx';
import { isEnded }            from '../utils/contract';
import { CONTRACT_STAGES }    from '../constants/contract-stage';
import { observer }           from '../utils/observer';

export default class RunPanelStore {
    constructor() {
        observer.register('bot.running', this.onBotRunningEvent);
        observer.register('bot.stop', this.onBotStopEvent);
        observer.register('contract.status', this.onContractStatusEvent);
        observer.register('bot.contract', this.onBotContractEvent);
    }

    @observable is_running = false;
    @observable contract_stage = CONTRACT_STAGES.not_running‌;

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
        if (isClosed) this.getContractStage('contract.closed');
    }

    onRunButtonClick = () => {
        if (this.is_running) {
            Blockly.BLOCKLY_CLASS_OLD.stop();
        } else {
            Blockly.BLOCKLY_CLASS_OLD.run();
        }
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
            default : {
                this.contract_stage = CONTRACT_STAGES.not_running‌;
            }
        }
        console.log('__________' , this.contract_stage); // eslint-disable-line no-console
    }
}
