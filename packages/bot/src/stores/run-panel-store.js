import {
    observable,
    action,
    reaction,
    computed,
}                          from 'mobx';
import { contract_stages } from '../constants/contract-stage';
import {
    error_types,
    unrecoverable_errors,
}                          from '../constants/messages';
import {
    runBot,
    stopBot,
    terminateBot,
}                          from '../scratch';
import { isEnded }         from '../utils/contract';
import { translate }       from '../utils/lang/i18n';
import { observer }        from '../utils/observer';

export default class RunPanelStore {
    constructor(root_store) {
        this.root_store = root_store;
        this.registerCoreReactions();
    }

    @observable active_index = 0;
    @observable contract_stage = contract_stages.NOT_RUNNING;
    @observable dialog_options = {};
    @observable has_open_contract = false;
    @observable is_running = false;
    @observable is_drawer_open = true;

    // when error happens, if it is unrecoverable_errors we reset run-panel
    // we activate run-button and clear trade info and set the ContractStage to NOT_RUNNING
    // otherwise we keep opening new contracts and set the ContractStage to PURCHASE_SENT
    error_type = undefined;

    // #region button clicks
    @computed
    get is_stop_button_disabled() {
        return this.contract_stage.index === contract_stages.IS_STOPPING.index;
    }

    @computed
    get is_stop_button_visible() {
        return this.is_running || this.has_open_contract;
    }

    @computed
    get is_clear_stat_disabled() {
        return this.is_running ||
            this.has_open_contract ||
            this.root_store.journal.messages.length === 0;
    }

    @action.bound
    onRunButtonClick = () => {
        const { client } = this.root_store.core;

        if (!client.is_logged_in) {
            this.showLoginDialog();
            return;
        }

        if (!client.is_virtual) {
            this.showRealAccountDialog();
            return;
        }

        this.registerBotListeners();
        this.is_running = true;
        this.is_drawer_open = true;
        this.root_store.contract_card.clear();
        this.setContractStage(contract_stages.STARTING);

        runBot();
    }

    @action.bound
    onStopButtonClick() {
        stopBot();

        this.is_running = false;

        if (this.error_type) {
            // when user click stop button when there is a error but bot is retrying
            this.setContractStage(contract_stages.NOT_RUNNING);
            this.error_type = undefined;
        } else if (this.has_open_contract) {
            // when user click stop button when bot is running
            this.setContractStage(contract_stages.IS_STOPPING);
        } else {
            // when user click stop button before bot start running
            this.setContractStage(contract_stages.NOT_RUNNING);
            this.unregisterBotListeners();
        }
    }

    @action.bound
    onClearStatClick() {
        this.showClearStatDialog();
    }

    @action.bound
    clearStat() {
        const { contract_card, journal, summary, transactions } = this.root_store;

        this.is_running = false;
        this.has_open_contract = false;
        journal.clear();
        contract_card.clear();
        summary.clear();
        transactions.clear();
        this.setContractStage(contract_stages.NOT_RUNNING);
    }
    // #endregion

    // #region Drawer
    @action.bound
    toggleDrawer(is_open) {
        this.is_drawer_open = is_open;
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;
    }
    // #endregion

    // #region Dialog
    @computed
    get is_dialog_open() {
        return Object.entries(this.dialog_options).length > 0;
    }

    @action.bound
    onCloseDialog() {
        this.dialog_options = {};
    }

    @action.bound
    showLoginDialog() {
        this.onOkButtonClick = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title  : translate('Please log in'),
            message: translate('You need to log in to run the bot.'),
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
    showIncompatibleStrategyDialog() {
        this.onOkButtonClick     = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title  : translate('Import error'),
            message: translate('This strategy is currently not compatible with DBot.'),
        };
    }
    // #endregion

    // #region Bot listenets
    registerBotListeners() {
        const { contract_card, journal, summary, transactions } = this.root_store;

        observer.register('bot.running', this.onBotRunningEvent);
        observer.register('bot.stop', this.onBotStopEvent);
        observer.register('bot.trade_again', this.onBotTradeAgain);
        observer.register('contract.status', this.onContractStatusEvent);
        observer.register('contract.status', summary.onContractStatusEvent);
        observer.register('bot.contract', this.onBotContractEvent);
        observer.register('bot.contract', contract_card.onBotContractEvent);
        observer.register('bot.contract', transactions.onBotContractEvent);
        observer.register('ui.log.success', journal.onLogSuccess);
        observer.register('ui.log.error', journal.onError);
        observer.register('Error', journal.onError);
        observer.register('ui.log.error', this.onError);
        observer.register('Error', this.onError);
        observer.register('Notify', journal.onNotify);
    }

    @action.bound
    onBotRunningEvent() {
        this.has_open_contract = true;
    }

    @action.bound
    onBotStopEvent() {
        if (this.error_type === error_types.RECOVERABLE_ERRORS) {
            // When error happens but its recoverable_errors, why we emit bot.stop here?
            this.setContractStage(contract_stages.PURCHASE_SENT);
            this.error_type = undefined;
        } else if (this.error_type === error_types.UNRECOVERABLE_ERRORS) {
            // When error happens and its recoverable_errors, bot should stop
            this.setContractStage(contract_stages.NOT_RUNNING);
            this.error_type = undefined;
            this.is_running = false;
            this.unregisterBotListeners();
        } else if (this.has_open_contract) {
            // When bot was running and it closes now
            this.setContractStage(contract_stages.CONTRACT_CLOSED);
            this.unregisterBotListeners();
        }
        this.has_open_contract = false;
    }

    @action.bound
    onBotTradeAgain(is_trade_again) {
        if (!is_trade_again) {
            this.onStopButtonClick();
        }
    }

    @action.bound
    onContractStatusEvent(data) {
        switch (data.id) {
            case ('contract.purchase_sent'): {
                this.setContractStage(contract_stages.PURCHASE_SENT);
                break;
            }
            case ('contract.purchase_received'): {
                this.setContractStage(contract_stages.PURCHASE_RECEIVED);
                break;
            }
            case ('contract.sold'): {
                this.setContractStage(contract_stages.CONTRACT_CLOSED);
                break;
            }
            default: {
                this.setContractStage(contract_stages.NOT_RUNNING);
                break;
            }
        }
    }

    @action.bound
    onBotContractEvent(data) {
        const isClosed = isEnded(data);
        if (isClosed) {
            this.setContractStage(contract_stages.CONTRACT_CLOSED);
        }
    }

    @action.bound
    onError(data) {
        if (unrecoverable_errors.includes(data.name)) {
            this.root_store.contract_card.clear();
            this.error_type = error_types.UNRECOVERABLE_ERRORS;
        } else {
            this.error_type = error_types.RECOVERABLE_ERRORS;
        }
        this.setActiveTabIndex(2);
    }

    unregisterBotListeners =() => {
        observer.unregisterAll('bot.running');
        observer.unregisterAll('bot.stop');
        observer.unregisterAll('bot.trade_again');
        observer.unregisterAll('contract.status');
        observer.unregisterAll('bot.contract');
        observer.unregisterAll('ui.log.success');
        observer.unregisterAll('ui.log.error');
        observer.unregisterAll('Error');
        observer.unregisterAll('Notify');
    }

    // #endregion

    @action.bound
    registerCoreReactions() {
        const { client, common } = this.root_store.core;
        const terminateAndClear = () => {
            // TODO: Handle more gracefully, e.g. ask user for confirmation instead
            // of killing and clearing everything instantly.
            // Core need to change to pass beforeswitch account event
            terminateBot();
            this.unregisterBotListeners();
            this.clearStat();
        };

        const register = () => {
            if (common.is_socket_opened) {
                this.disposeIsSocketOpenedListener = reaction(
                    () => client.loginid,
                    (loginid) => {
                        if (loginid) {
                            this.root_store.journal.pushMessage(translate('You have switched accounts.'));
                        }
                        terminateAndClear();
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
        this.unregisterBotListeners();
        this.disposeIsSocketOpenedListener();
    }
}
