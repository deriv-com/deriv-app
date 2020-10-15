import { observable, action, reaction, computed, runInAction } from 'mobx';
import { localize } from '@deriv/translations';
import { error_types, unrecoverable_errors, observer, message_types } from '@deriv/bot-skeleton';
import { contract_stages } from '../constants/contract-stage';
import { journalError, switch_account_notification } from '../utils/bot-notifications';
import { run_panel } from '../constants/run-panel';

export default class RunPanelStore {
    constructor(root_store) {
        this.root_store = root_store;
        this.dbot = this.root_store.dbot;
        this.registerCoreReactions();

        this.statistics_storage_key = 'statistics_cache';
        this.empty_statistics = Object.freeze({
            lost_contracts: 0,
            number_of_runs: 0,
            total_profit: 0,
            total_payout: 0,
            total_stake: 0,
            won_contracts: 0,
        });

        this.disposeStatisticsListener = reaction(
            () => this.statistics,
            statistics => {
                const { client } = this.root_store.core;
                const stored_statistics = this.getSessionStorage(this.statistics_storage_key);

                const new_statistics = { statistics };
                stored_statistics[client.loginid] = new_statistics;

                sessionStorage.setItem(this.statistics_storage_key, JSON.stringify(stored_statistics));
            }
        );

        this.disposeSwitchAccountListener = reaction(
            () => this.root_store.core.client.loginid,
            () => {
                const { core, transactions, journal, summary_card } = this.root_store;
                const { client } = core;

                if (client.is_logged_in) {
                    this.statistics =
                        this.getAccountStatisticsInfo(this.statistics_storage_key, 'Statistics')?.statistics ??
                        this.empty_statistics;

                    journal.unfiltered_messages =
                        this.getAccountStatisticsInfo('journal_cache', 'Journals')?.journal_messages ?? [];

                    transactions.elements =
                        this.getAccountStatisticsInfo('transaction_cache', 'Transactions')?.transaction_elements ?? [];
                } else {
                    this.statistics = this.empty_statistics;
                    journal.unfiltered_messages = [];
                    transactions.elements = [];
                }

                this.is_running = false;
                this.has_open_contract = false;
                summary_card.clear();
                this.setContractStage(contract_stages.NOT_RUNNING);
            }
        );
    }

    run_id = '';

    @observable statistics =
        this.getAccountStatisticsInfo(this.statistics_storage_key, 'statistics')?.statistics ?? this.empty_statistics;

    @observable active_index = 0;
    @observable contract_stage = contract_stages.NOT_RUNNING;
    @observable dialog_options = {};
    @observable has_open_contract = false;
    @observable is_running = false;
    @observable is_statistics_info_modal_open = false;
    @observable is_drawer_open = true;
    @observable is_dialog_open = false;
    @observable is_sell_requested = false;

    // when error happens, if it is unrecoverable_errors we reset run-panel
    // we activate run-button and clear trade info and set the ContractStage to NOT_RUNNING
    // otherwise we keep opening new contracts and set the ContractStage to PURCHASE_SENT
    error_type = undefined;

    getSessionStorage = key => {
        return JSON.parse(sessionStorage.getItem(key)) ?? {};
    };

    getAccountStatisticsInfo = (key, type) => {
        const { client } = this.root_store.core;

        if (type === 'Statistics') {
            return this.getSessionStorage(key)?.[client.loginid] ?? this.empty_statistics;
        }
        return this.getSessionStorage(key)?.[client.loginid] ?? [];
    };

    // #region button clicks
    @computed
    get is_stop_button_visible() {
        return this.is_running || this.has_open_contract;
    }

    @computed
    get is_stop_button_disabled() {
        return this.contract_stage === contract_stages.IS_STOPPING;
    }

    @computed
    get is_clear_stat_disabled() {
        return this.is_running || this.has_open_contract || this.root_store.journal.unfiltered_messages.length === 0;
    }

    @action.bound
    async onRunButtonClick() {
        const { core, summary_card, route_prompt_dialog, self_exclusion } = this.root_store;
        const { client, ui } = core;

        this.dbot.unHighlightAllBlocks();
        if (!client.is_logged_in) {
            this.showLoginDialog();
            return;
        }
        await self_exclusion.checkRestriction();
        if (!self_exclusion.should_bot_run) {
            self_exclusion.setIsRestricted(true);
            return;
        }
        self_exclusion.setIsRestricted(false);

        this.registerBotListeners();

        if (!this.dbot.shouldRunBot()) {
            RunPanelStore.unregisterBotListeners();
            return;
        }

        ui.setAccountSwitcherDisabledMessage(
            localize(
                'Account switching is disabled while your bot is running. Please stop your bot before switching accounts.'
            )
        );
        runInAction(() => {
            this.is_running = true;
            ui.setPromptHandler(true, route_prompt_dialog.shouldNavigateAfterPrompt);
            this.toggleDrawer(true);
            this.run_id = `run-${Date.now()}`;

            summary_card.clear();
            this.setContractStage(contract_stages.STARTING);
            this.dbot.runBot();
        });
    }

    @action.bound
    onStopButtonClick() {
        const { ui } = this.root_store.core;
        this.dbot.stopBot();
        ui.setPromptHandler(false);

        if (this.error_type) {
            // when user click stop button when there is a error but bot is retrying
            this.setContractStage(contract_stages.NOT_RUNNING);
            ui.setAccountSwitcherDisabledMessage(false);
            this.is_running = false;
        } else if (this.has_open_contract) {
            // when user click stop button when bot is running
            this.setContractStage(contract_stages.IS_STOPPING);
        } else {
            // when user click stop button before bot start running
            this.setContractStage(contract_stages.NOT_RUNNING);
            RunPanelStore.unregisterBotListeners();
            ui.setAccountSwitcherDisabledMessage(false);
            this.is_running = false;
        }

        if (this.error_type) {
            this.error_type = undefined;
        }
    }

    @action.bound
    onClearStatClick() {
        this.showClearStatDialog();
    }

    @action.bound
    clearStat() {
        const { summary_card, journal, transactions } = this.root_store;

        this.is_running = false;
        this.has_open_contract = false;
        this.clear();
        journal.clear();
        summary_card.clear();
        transactions.clear();
        this.setContractStage(contract_stages.NOT_RUNNING);
    }
    // #endregion

    @action.bound
    toggleStatisticsInfoModal() {
        this.is_statistics_info_modal_open = !this.is_statistics_info_modal_open;
    }

    // #region Drawer
    @action.bound
    toggleDrawer(is_open) {
        this.is_drawer_open = is_open;
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;

        if (this.active_index !== 1) {
            this.root_store.transactions.setActiveTransactionId(null);
        }
    }
    // #endregion

    // #region Dialog
    @action.bound
    onCloseDialog() {
        this.is_dialog_open = false;
    }

    @action.bound
    showLoginDialog() {
        this.onOkButtonClick = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title: localize('Please log in'),
            message: localize('You need to log in to run the bot.'),
        };
        this.is_dialog_open = true;
    }

    @action.bound
    showRealAccountDialog() {
        this.onOkButtonClick = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title: localize("DBot isn't quite ready for real accounts"),
            message: localize('Please switch to your demo account to run your DBot.'),
        };
        this.is_dialog_open = true;
    }

    @action.bound
    showClearStatDialog() {
        this.onOkButtonClick = () => {
            this.clearStat();
            this.onCloseDialog();
        };
        this.onCancelButtonClick = this.onCloseDialog;
        this.dialog_options = {
            title: localize('Are you sure?'),
            message: localize(
                'This will clear all data in the summary, transactions, and journal panels. All counters will be reset to zero.'
            ),
        };
        this.is_dialog_open = true;
    }

    @action.bound
    showIncompatibleStrategyDialog() {
        this.onOkButtonClick = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title: localize('Import error'),
            message: localize('This strategy is currently not compatible with DBot.'),
        };
        this.is_dialog_open = true;
    }
    // #endregion

    // #region Bot listenets
    registerBotListeners() {
        const { summary_card, transactions } = this.root_store;

        observer.register('bot.running', this.onBotRunningEvent);
        observer.register('bot.sell', this.onBotSellEvent);
        observer.register('bot.stop', this.onBotStopEvent);
        observer.register('bot.click_stop', this.onStopButtonClick);
        observer.register('bot.trade_again', this.onBotTradeAgain);
        observer.register('contract.status', this.onContractStatusEvent);
        observer.register('bot.contract', this.onBotContractEvent);
        observer.register('bot.contract', summary_card.onBotContractEvent);
        observer.register('bot.contract', transactions.onBotContractEvent);
        observer.register('Error', this.onError);
    }

    @action.bound
    onBotRunningEvent() {
        this.has_open_contract = true;

        // prevent new version update
        const ignore_new_version = new Event('IgnorePWAUpdate');
        document.dispatchEvent(ignore_new_version);
        const { self_exclusion } = this.root_store;
        this.has_open_contract = true;

        if (self_exclusion.should_bot_run && self_exclusion.run_limit !== -1) {
            self_exclusion.run_limit -= 1;
            if (self_exclusion.run_limit < 0) {
                this.onStopButtonClick();
            }
        }
    }

    @action.bound
    onBotSellEvent() {
        this.is_sell_requested = true;
    }

    @action.bound
    onBotStopEvent() {
        const { self_exclusion } = this.root_store;
        const { ui } = this.root_store.core;
        const indicateBotStopped = () => {
            this.error_type = undefined;
            this.is_running = false;
            this.setContractStage(contract_stages.NOT_RUNNING);
            ui.setAccountSwitcherDisabledMessage(false);
            RunPanelStore.unregisterBotListeners();
            self_exclusion.resetSelfExclusion();
        };
        if (this.error_type === error_types.RECOVERABLE_ERRORS) {
            // Bot should indicate it started in below cases:
            // - When error happens it's a recoverable error
            const { shouldRestartOnError, timeMachineEnabled } = this.dbot.interpreter.bot.tradeEngine.options;
            const is_bot_recoverable = shouldRestartOnError || timeMachineEnabled;

            if (is_bot_recoverable) {
                this.error_type = undefined;
                this.setContractStage(contract_stages.PURCHASE_SENT);
            } else {
                indicateBotStopped();
            }
        } else if (this.error_type === error_types.UNRECOVERABLE_ERRORS) {
            // Bot should indicate it stopped in below cases:
            // - When error happens and it's an unrecoverable error
            indicateBotStopped();
        } else if (this.has_open_contract) {
            // Bot should indicate the contract is closed in below cases:
            // - When bot was running and an error happens
            this.error_type = undefined;
            this.is_running = false;
            this.is_sell_requested = false;
            this.setContractStage(contract_stages.CONTRACT_CLOSED);
            ui.setAccountSwitcherDisabledMessage(false);
            RunPanelStore.unregisterBotListeners();
            self_exclusion.resetSelfExclusion();
        }

        this.has_open_contract = false;

        // listen for new version update
        const listen_new_version = new Event('ListenPWAUpdate');
        document.dispatchEvent(listen_new_version);
    }

    @action.bound
    onBotTradeAgain(is_trade_again) {
        if (!is_trade_again) {
            this.onStopButtonClick();
        }
    }

    @action.bound
    onContractStatusEvent(contract_status) {
        switch (contract_status.id) {
            case 'contract.purchase_sent': {
                this.setContractStage(contract_stages.PURCHASE_SENT);
                break;
            }
            case 'contract.purchase_received': {
                this.setContractStage(contract_stages.PURCHASE_RECEIVED);

                // Close transaction-specific popover, if any.
                this.root_store.transactions.setActiveTransactionId(null);

                const { buy } = contract_status;
                this.statistics.total_stake += buy.buy_price;
                const { is_virtual } = this.root_store.core.client;
                if (!is_virtual) {
                    this.root_store.core.gtm.pushDataLayer({ event: 'dbot_purchase', buy_price: buy.buy_price });
                }

                break;
            }
            case 'contract.sold': {
                this.is_sell_requested = false;
                this.setContractStage(contract_stages.CONTRACT_CLOSED);

                const { contract } = contract_status;
                this.statistics.total_profit += contract.profit;
                this.statistics.number_of_runs += 1;

                switch (contract.status) {
                    case 'won': {
                        this.statistics.won_contracts += 1;
                        this.statistics.total_payout += contract.payout;
                        break;
                    }
                    case 'lost': {
                        this.statistics.lost_contracts += 1;
                        break;
                    }
                    case 'sold': {
                        if (contract.profit > 0) {
                            this.statistics.won_contracts += 1;
                            this.statistics.total_payout += contract.profit;
                        } else {
                            this.statistics.lost_contracts += 1;
                        }
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            default: {
                this.setContractStage(contract_stages.NOT_RUNNING);
                break;
            }
        }

        this.statistics = {
            lost_contracts: this.statistics.lost_contracts,
            number_of_runs: this.statistics.number_of_runs,
            total_profit: this.statistics.total_profit,
            total_payout: this.statistics.total_payout,
            total_stake: this.statistics.total_stake,
            won_contracts: this.statistics.won_contracts,
        };
    }

    @action.bound
    onClickSell() {
        this.dbot.interpreter.bot.getBotInterface().sellAtMarket();
    }

    @action.bound
    clear() {
        this.statistics = this.empty_statistics;
        observer.emit('statistics.clear');
    }

    @action.bound
    onBotContractEvent(data) {
        if (data?.is_sold) {
            this.is_sell_requested = false;
            this.setContractStage(contract_stages.CONTRACT_CLOSED);
        }
    }

    @action.bound
    onError(data) {
        if (unrecoverable_errors.includes(data.name)) {
            this.root_store.summary_card.clear();
            this.error_type = error_types.UNRECOVERABLE_ERRORS;
        } else {
            this.error_type = error_types.RECOVERABLE_ERRORS;
        }

        const error_message = data?.error?.error?.message ?? data?.message;
        this.showErrorMessage(error_message);
    }

    @action.bound
    showErrorMessage(data) {
        const { journal, ui } = this.root_store;
        journal.onError(data);
        if (journal.journal_filters.some(filter => filter === message_types.ERROR)) {
            this.toggleDrawer(true);
            this.setActiveTabIndex(run_panel.JOURNAL);
        } else {
            ui.addNotificationMessage(journalError(this.switchToJournal));
            ui.removeNotificationMessage({ key: 'bot_error' });
        }
    }

    @action.bound
    switchToJournal() {
        const { journal, ui } = this.root_store;
        journal.journal_filters.push(message_types.ERROR);
        this.setActiveTabIndex(run_panel.JOURNAL);
        this.toggleDrawer(true);
        ui.toggleNotificationsModal();
        ui.removeNotificationByKey({ key: 'bot_error' });
    }

    static unregisterBotListeners() {
        observer.unregisterAll('bot.running');
        observer.unregisterAll('bot.stop');
        observer.unregisterAll('bot.trade_again');
        observer.unregisterAll('contract.status');
        observer.unregisterAll('bot.contract');
        observer.unregisterAll('Error');
    }

    // #endregion

    @action.bound
    registerCoreReactions() {
        const { client, common, ui } = this.root_store.core;

        const register = () => {
            if (common.is_socket_opened) {
                this.disposeIsSocketOpenedListener = reaction(
                    () => client.loginid,
                    loginid => {
                        if (loginid && this.is_running) {
                            ui.addNotificationMessage(switch_account_notification);
                        }
                        this.dbot.terminateBot();
                        RunPanelStore.unregisterBotListeners();
                    }
                );
            } else if (typeof this.disposeLogoutListener === 'function') {
                this.disposeLogoutListener();
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

    @action.bound
    setContractStage(value) {
        this.contract_stage = value;
    }

    @action.bound
    onMount() {
        const { journal } = this.root_store;
        observer.register('ui.log.error', this.showErrorMessage);
        observer.register('ui.log.notify', journal.onNotify);
        observer.register('ui.log.success', journal.onLogSuccess);
    }

    @action.bound
    onUnmount() {
        const { journal, transactions } = this.root_store;

        RunPanelStore.unregisterBotListeners();
        this.disposeListeners();
        journal.disposeListeners();
        transactions.disposeListeners();

        observer.unregisterAll('ui.log.error');
        observer.unregisterAll('ui.log.notify');
        observer.unregisterAll('ui.log.success');
    }

    disposeListeners() {
        if (typeof this.disposeIsSocketOpenedListener === 'function') {
            this.disposeIsSocketOpenedListener();
        }

        if (typeof this.disposeStatisticsListener === 'function') {
            this.disposeStatisticsListener();
        }

        if (typeof this.disposeSwitchAccountListener === 'function') {
            this.disposeSwitchAccountListener();
        }
    }
}
