import {
    observable,
    action,
    reaction }             from 'mobx';
import { CONTRACT_STAGES } from '../constants/contract-stage';
import { isEnded }         from '../utils/contract';
import { translate }       from '../utils/lang/i18n';
import { observer }        from '../utils/observer';

export default class RunPanelStore {
    constructor(root_store) {
        this.root_store = root_store;

        observer.register('bot.running', this.onBotRunningEvent);
        observer.register('bot.stop', this.onBotStopEvent);
        observer.register('contract.status', this.onContractStatusEvent);
        observer.register('bot.contract', this.onBotContractEvent);

        this.registerReactions();

        if (!this.root_store.core.client.is_virtual) {
            this.showRealAccountDialog();
        }
    }

    @observable active_index          = 0;
    @observable contract_stage        = CONTRACT_STAGES.not_running;
    @observable is_run_button_clicked = false;
    @observable is_running            = false;
    @observable is_dialog_visible     = false;
    @observable is_drawer_open        = false;
    dialog_content                    = '';

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
        if (isClosed) {
            this.getContractStage({ id: 'contract.closed' });
        }
    }

    @action.bound
    onRunButtonClick = () => {
        if (!this.root_store.core.client.is_logged_in) {
            this.dialog_content = translate('Please log in.');
            this.is_dialog_visible = true;
            return;
        }

        if (!this.root_store.core.client.is_virtual) {
            this.showRealAccountDialog();
            return;
        }

        if (!this.is_drawer_open) {
            this.is_drawer_open = true;
        }

        this.is_run_button_clicked = true;
        Blockly.BLOCKLY_CLASS_OLD.run();
    }

    @action.bound
    onStopButtonClick() {
        if (!this.root_store.core.client.is_logged_in) {
            this.dialog_content = translate('Please log in.');
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
        // TODO: Wait for bot to finish.
        this.root_store.journal.clear();
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

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;
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
                this.contract_stage = CONTRACT_STAGES.not_running;
            }
        }
    }

    @action.bound
    registerReactions() {
        const { client } = this.root_store.core;
        const reset = (condition) => {
            if (condition) {
                Blockly.BLOCKLY_CLASS_OLD.terminate();
                this.is_run_button_clicked = false;
            }
        };

        this.disposeLogoutListener = reaction(
            () => client.loginid,
            (loginid) => reset(!loginid),
        );
        this.disposeSwitchAccountListener = reaction(
            () => client.switch_broadcast,
            (switch_broadcast) => {
                if (switch_broadcast) {
                    reset(switch_broadcast);
                    
                    if (!client.is_virtual) {
                        this.showRealAccountDialog();
                    }
                }
            },
        );
    }

    @action.bound
    showRealAccountDialog() {
        this.dialog_content = translate('You cannot use your real money account with DBot at this time.');
        this.is_dialog_visible = true;
    }

    onUnmount() {
        observer.unregister('bot.running', this.onBotRunningEvent);
        observer.unregister('bot.stop', this.onBotStopEvent);
        observer.unregister('contract.status', this.onContractStatusEvent);
        observer.unregister('bot.contract', this.onBotContractEvent);

        if (typeof this.disposeLogoutListener === 'function') {
            this.disposeLogoutListener();
        }

        if (typeof this.disposeSwitchAccountListener === 'function') {
            this.disposeSwitchAccountListener();
        }
    }
}
