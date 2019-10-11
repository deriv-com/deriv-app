import {
    observable,
    action,
    reaction,
    computed }             from 'mobx';
import { CONTRACT_STAGES } from '../constants/contract-stage';
import {
    runBot,
    stopBot,
    terminateBot }         from '../scratch';
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
        observer.register('bot.trade_again', this.onBotNotTradeAgain);

        this.registerReactions();
    }

    @observable active_index          = 0;
    @observable contract_stage        = CONTRACT_STAGES.not_running;
    @observable dialog_options        = {};
    @observable is_run_button_clicked = false;
    @observable is_running            = false;
    @observable is_drawer_open        = true;

    // when error happens, if it is unrecoverable_errors we reset run-panel
    // we activate run-button and clear trade info and set the ContractStage to not_running
    // otherwise we keep opening new contracts and set the ContractStage to purchase_sent
    is_error_happened   = false;
    is_continue_trading = true;

    @action.bound
    onBotNotTradeAgain(is_trade_again) {
        if (!is_trade_again) {
            this.is_run_button_clicked = false;
            this.onBotStopEvent();
        }
    }

    @action.bound
    onBotStopEvent() {
        this.is_running = false;

        if (this.is_error_happened && this.is_continue_trading) {
            this.setContractStage(CONTRACT_STAGES.purchase_sent);
        } else if (this.is_running) {
            this.setContractStage(CONTRACT_STAGES.contract_closed);
        } else {
            this.setContractStage(CONTRACT_STAGES.not_running);
            this.is_run_button_clicked = false;
        }
    }

    @action.bound
    onBotRunningEvent() {
        this.is_running = true;
    }

    @action.bound
    onContractStatusEvent(data) {
        switch (data.id) {
            case ('contract.purchase_sent'): {
                this.setContractStage(CONTRACT_STAGES.purchase_sent);
                break;
            }
            case ('contract.purchase_recieved'): {
                this.setContractStage(CONTRACT_STAGES.purchase_recieved);
                break;
            }
            case ('contract.sold'): {
                this.setContractStage(CONTRACT_STAGES.contract_closed);
                break;
            }
            default: {
                this.setContractStage(CONTRACT_STAGES.not_running);
                break;
            }
        }
    }

    @action.bound
    onBotContractEvent(data) {
        const isClosed = isEnded(data);
        if (isClosed) {
            this.setContractStage(CONTRACT_STAGES.contract_closed);
        }
    }

    @action.bound
    onRunButtonClick = () => {
        const { client } = this.root_store.core;
        this.root_store.contract_card.is_loading = true;

        if (!client.is_logged_in) {
            this.showLoginDialog();
            return;
        }

        if (!client.is_virtual) {
            this.showRealAccountDialog();
            return;
        }

        if (!this.is_drawer_open) {
            this.is_drawer_open = true;
        }

        runBot();
        this.setContractStage(CONTRACT_STAGES.starting);
        this.is_run_button_clicked = true;
    }

    @action.bound
    onStopButtonClick() {
        if (this.is_run_button_clicked) {
            stopBot();
            if (this.is_error_happened) {
                // when user click stop button when there is a error but bot is retrying
                this.setContractStage(CONTRACT_STAGES.not_running);
                this.is_error_happened = false;
                this.is_continue_trading = true;
            } else if (this.is_running) {
                // when user click stop button when bot is running
                this.setContractStage(CONTRACT_STAGES.is_stopping);
            } else {
                // when user click stop button before bot start running
                this.setContractStage(CONTRACT_STAGES.not_running);
            }
        }

        this.is_run_button_clicked = false;
        this.root_store.contract_card.is_loading = false;
    }

    @action.bound
    onClearStatClick() {
        this.showClearStatDialog();
    }

    @action.bound
    clearStat() {
        this.is_run_button_clicked = false;
        this.root_store.journal.clear();
        this.root_store.contract_card.clear();
        this.root_store.summary.clear();
        this.root_store.transactions.clear();
        this.setContractStage(CONTRACT_STAGES.not_running);
    }

    @action.bound
    toggleDrawer(is_open) {
        this.is_drawer_open = is_open;
    }

    @action.bound
    onCloseDialog() {
        this.dialog_options = {};
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;
    }

    @computed
    get is_dialog_open() {
        return Object.entries(this.dialog_options).length > 0;
    }

    @action.bound
    showLoginDialog() {
        this.onOkButtonClick = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title  : translate('Run error'),
            message: translate('Please log in.'),
        };
    }

    @action.bound
    showRealAccountDialog() {
        this.onOkButtonClick = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title  : translate('DBot isn\'t quite ready for real accounts'),
            message: translate('Please switch to your demo account to run your DBot.'),
        };
    }

    @action.bound
    showClearStatDialog() {
        this.onOkButtonClick = () => {
            this.clearStat();
            this.onCloseDialog();
        };
        this.onCancelButtonClick = this.onCloseDialog;
        this.dialog_options = {
            title  : translate('Are you sure?'),
            message: translate('This will clear all data in the summary, transactions, and journal panels. All counters will be reset to zero.'),
        };
    }

    @action.bound
    registerReactions() {
        const { client, common } = this.root_store.core;
        const terminateAndClear = () => {
            // TODO: Handle more gracefully, e.g. ask user for confirmation instead
            // of killing and clearing everything instantly.
            // Core need to change to pass beforeswitch account event
            terminateBot();
            this.clearStat();
        };

        const register = () => {
            if (common.is_socket_opened) {
                this.disposeIsSocketOpenedListener = reaction(
                    () => client.loginid,
                    (loginid) => {
                        if (loginid) {
                            this.root_store.journal.pushMessage(translate('You have switched accounts.'));
                        } else {
                            terminateAndClear();
                        }
                        this.root_store.summary.currency = client.currency;
                    },
                );

                this.disposeSwitchAccountListener = reaction(
                    () => client.switched,
                    (switched) => {
                        if (switched) {
                            if (client.is_logged_in && !/^VRTC/.test(switched)) {
                                // TODO: temporary fix to not showing modal when another modal is open
                                const is_modal_open = document.getElementById('modal_root').hasChildNodes();
                                if (!is_modal_open) {
                                    this.showRealAccountDialog();
                                }
                                terminateAndClear();
                            }
                        }
                    },
                );
            } else {
                if (typeof this.disposeLogoutListener === 'function') {
                    this.disposeLogoutListener();
                }

                if (typeof this.disposeSwitchAccountListener === 'function') {
                    this.disposeSwitchAccountListener();
                }
            }
        };

        register();

        this.disposeLogoutListener = reaction(
            () => common.is_socket_opened,
            () => {
                register();
            }
        );
    }

    setContractStage(value) {
        this.contract_stage = value;
    }

    onUnmount() {
        observer.unregister('bot.running', this.onBotRunningEvent);
        observer.unregister('bot.stop', this.onBotStopEvent);
        observer.unregister('contract.status', this.onContractStatusEvent);
        observer.unregister('bot.contract', this.onBotContractEvent);

        this.disposeIsSocketOpenedListener();

    }
}
