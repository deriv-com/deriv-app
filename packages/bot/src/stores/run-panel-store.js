import {
    observable,
    action,
    reaction,
    computed }             from 'mobx';
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
    }

    @observable active_index          = 0;
    @observable contract_stage        = CONTRACT_STAGES.not_running;
    @observable dialog_options        = {};
    @observable is_run_button_clicked = false;
    @observable is_running            = false;
    @observable is_drawer_open        = false;
    
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
        const { client } = this.root_store.core;

        if (!client.is_logged_in) {
            this.dialog_options = {
                title  : translate('Run error'),
                message: translate('Please log in.'),
            };
            return;
        }

        if (!client.is_virtual) {
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
            this.dialog_options = {
                title  : translate('Run error'),
                message: translate('Please log in.'),
            };
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
    onCloseModal() {
        this.dialog_options = {};
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;
    }

    @computed
    get is_dialog_visible() {
        return Object.entries(this.dialog_options).length > 0;
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
                // TODO: Handle more gracefully, e.g. ask user for confirmation instead
                // of killing and clearing everything instantly.
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
        this.dialog_options = {
            title  : translate('DBot isn\'t quite ready for real accounts'),
            message: translate('Please switch to your demo account to run your DBot.'),
        };
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
