import {
    action,
    computed,
    extendObservable,
    observable }                  from 'mobx';
import { isEmptyObject }          from '_common/utility';
import { localize }               from '_common/localize';
import { WS }                     from 'Services';
import { createChartBarrier }     from './Helpers/chart-barriers';
import { createChartMarkers }     from './Helpers/chart-markers';
import {
    getDetailsExpiry,
    getDetailsInfo }             from './Helpers/details';
import {
    getDigitInfo,
    isDigitContract }            from './Helpers/digits';
import {
    getChartConfig,
    getChartGranularity,
    getChartType,
    getDisplayStatus,
    getEndTime,
    getFinalPrice,
    getIndicativePrice,
    isEnded,
    isSoldBeforeStart,
    isStarted,
    isUserSold,
    isValidToSell }              from './Helpers/logic';
import BaseStore                 from '../../base-store';

export default class ContractStore extends BaseStore {
    // --- Observable properties ---
    @observable contract_id;
    @observable contract_info = observable.object({});
    @observable digits_info   = observable.object({});
    @observable sell_info     = observable.object({});

    @observable has_error         = false;
    @observable error_message     = '';
    @observable is_sell_requested = false;

    // ---- Replay Contract Config ----
    @observable replay_contract_id;
    @observable replay_info = observable.object({});

    // ---- Normal properties ---
    forget_id;
    chart_type          = 'mountain';
    is_granularity_set  = false;
    is_left_epoch_set   = false;
    is_from_positions   = false;
    is_ongoing_contract = false;

    // -------------------
    // ----- Actions -----
    // -------------------
    @action.bound
    drawChart(SmartChartStore, contract_info) {
        this.forget_id = contract_info.id;

        const { date_start }           = contract_info;
        const end_time                 = getEndTime(contract_info);
        const should_update_chart_type = (!contract_info.tick_count && !this.is_granularity_set);

        if (!end_time) this.is_ongoing_contract = true;

        // finish contracts if end_time exists
        if (end_time) {
            if (!this.is_ongoing_contract) {
                SmartChartStore.setStaticChart(true);
            } else {
                SmartChartStore.setStaticChart(false);
            }
            SmartChartStore.setContractStart(date_start);
            SmartChartStore.setContractEnd(end_time);

            if (should_update_chart_type) {
                this.handleChartType(SmartChartStore, date_start, end_time);
            } else {
                SmartChartStore.updateGranularity(0);
                SmartChartStore.updateChartType('mountain');
            }
            // Clear chart loading status once ChartListener returns ready for completed contract
            if (!this.is_ongoing_contract) {
                this.waitForChartListener(SmartChartStore);
            }

        // setters for ongoing contracts, will only init once onMount after left_epoch is set
        } else if (!this.is_left_epoch_set) {
            if (this.is_from_positions) {
                SmartChartStore.setContractStart(date_start);
            }

            if (contract_info.tick_count) {
                SmartChartStore.updateGranularity(0);
                SmartChartStore.updateChartType('mountain');
            }
            this.is_left_epoch_set = true;
            SmartChartStore.setChartView(contract_info.purchase_time);
        }
        if (should_update_chart_type && !contract_info.tick_count) {
            this.handleChartType(SmartChartStore, date_start, null);
        }
        if (this.is_granularity_set) {
            if (getChartType(date_start, null) !== this.chart_type) {
                this.is_granularity_set = false;
            }
        }

        createChartBarrier(SmartChartStore, contract_info);
        createChartMarkers(SmartChartStore, contract_info);

        if (this.smart_chart.is_chart_ready) {
            this.smart_chart.setIsChartLoading(false);
        }
    }

    @action.bound
    onMount(contract_id, is_from_positions) {
        if (contract_id === +this.contract_id) return;
        if (this.root_store.modules.smart_chart.is_contract_mode) this.onCloseContract();
        this.onSwitchAccount(this.accountSwitcherListener.bind(null));
        this.has_error         = false;
        this.error_message     = '';
        this.contract_id       = contract_id;
        this.smart_chart       = this.root_store.modules.smart_chart;
        this.is_from_positions = is_from_positions;

        if (contract_id) {
            this.replay_info = {};
            if (this.is_from_positions) {
                this.smart_chart.setIsChartLoading(true);
            }
            this.smart_chart.saveAndClearTradeChartLayout('contract');
            this.smart_chart.setContractMode(true);
            WS.subscribeProposalOpenContract(this.contract_id.toString(), this.updateProposal, false);
        }
    }

    @action.bound
    onMountReplay(contract_id) {
        if (contract_id) {
            this.contract_info = {};
            this.smart_chart = this.root_store.modules.smart_chart;
            this.smart_chart.setContractMode(true);
            this.replay_contract_id = contract_id;
            WS.subscribeProposalOpenContract(this.replay_contract_id.toString(), this.populateConfig, false);
        }
    }

    @action.bound
    onUnmountReplay() {
        this.forgetProposalOpenContract();
        this.forget_id          = null;
        this.replay_contract_id = null;
        this.digits_info        = {};
        this.replay_info        = {};
        this.smart_chart.setContractMode(false);
        this.smart_chart.cleanupContractChartView();
    }

    @action.bound
    accountSwitcherListener () {
        this.smart_chart.setContractMode(false);
        return new Promise((resolve) => resolve(this.onCloseContract()));
    }

    @action.bound
    onCloseContract() {
        this.forgetProposalOpenContract();
        this.chart_type          = 'mountain';
        this.contract_id         = null;
        this.contract_info       = {};
        this.digits_info         = {};
        this.error_message       = '';
        this.forget_id           = null;
        this.has_error           = false;
        this.is_granularity_set  = false;
        this.is_sell_requested   = false;
        this.is_left_epoch_set   = false;
        this.is_from_positions   = false;
        this.is_ongoing_contract = false;
        this.sell_info           = {};

        this.smart_chart.cleanupContractChartView();
        this.smart_chart.applySavedTradeChartLayout();
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        this.onCloseContract();
    }

    @action.bound
    populateConfig(response) {
        if ('error' in response) {
            this.has_error     = true;
            this.contract_config = {};
            this.smart_chart.setIsChartLoading(false);
            return;
        }
        if (isEmptyObject(response.proposal_open_contract)) {
            this.has_error       = true;
            this.error_message   = localize('Contract does not exist or does not belong to this client.');
            this.contract_config = {};
            this.smart_chart.setContractMode(false);
            this.smart_chart.setIsChartLoading(false);
            return;
        }
        if (+response.proposal_open_contract.contract_id !== +this.replay_contract_id) return;

        this.forget_id   = response.proposal_open_contract.id;
        this.replay_info = response.proposal_open_contract;

        createChartBarrier(this.smart_chart, this.replay_info);
        createChartMarkers(this.smart_chart, this.replay_info);
        this.handleDigits(this.replay_info);

        this.waitForChartListener(this.smart_chart);

    }

    @action.bound
    updateProposal(response) {
        if ('error' in response) {
            this.has_error     = true;
            this.error_message = response.error.message;
            this.contract_info = {};
            this.smart_chart.setIsChartLoading(false);
            return;
        }
        if (isEmptyObject(response.proposal_open_contract)) {
            this.has_error     = true;
            this.error_message = localize('Contract does not exist or does not belong to this client.');
            this.contract_info = {};
            this.contract_id   = null;
            this.smart_chart.setContractMode(false);
            this.smart_chart.setIsChartLoading(false);
            return;
        }
        if (+response.proposal_open_contract.contract_id !== +this.contract_id) return;

        this.contract_info = response.proposal_open_contract;

        // Set contract symbol if trade_symbol and contract_symbol don't match
        if (this.root_store.modules.trade.symbol !== this.contract_info.underlying) {
            this.root_store.modules.trade.updateSymbol(this.contract_info.underlying);
        }

        this.drawChart(this.smart_chart, this.contract_info);

        this.handleDigits(this.contract_info);
    }

    @action.bound
    handleDigits(contract_info) {
        if (this.is_digit_contract) {
            extendObservable(this.digits_info, getDigitInfo(this.digits_info, contract_info));
        }
    }

    @action.bound
    onClickSell() {
        if (this.contract_id && !this.is_sell_requested && isEmptyObject(this.sell_info)) {
            this.is_sell_requested = true;
            WS.sell(this.contract_id, this.contract_info.bid_price).then(this.handleSell);
        }
    }

    @action.bound
    handleSell(response) {
        if (response.error) {
            this.sell_info = {
                error_message: response.error.message,
            };

            this.is_sell_requested = false;
        } else {
            this.forgetProposalOpenContract();
            WS.proposalOpenContract(this.contract_id).then(action((proposal_response) => {
                this.updateProposal(proposal_response);
                this.sell_info = {
                    sell_price    : response.sell.sold_for,
                    transaction_id: response.sell.transaction_id,
                };
            }));
        }
    }

    handleChartType(SmartChartStore, start, expiry) {
        const chart_type  = getChartType(start, expiry);
        const granularity = getChartGranularity(start, expiry);

        if (chart_type === 'candle' && granularity !== 0) {
            SmartChartStore.updateChartType(chart_type);
            this.chart_type = chart_type;
        } else {
            SmartChartStore.updateChartType('mountain');
            this.chart_type = 'mountain';
        }
        SmartChartStore.updateGranularity(granularity);
        this.is_granularity_set = true;
    }

    forgetProposalOpenContract() {
        WS.forget('proposal_open_contract', this.updateProposal, { id: this.forget_id });
    }

    waitForChartListener = (SmartChartStore) => {
        // TODO: Refactor, timeout interval is required for completed contracts.
        // There is an issue when we receive the proposal_open_contract response
        // for a completed contract and chartListener returns false for that single instance / single response.
        // Hence, we need to set an interval to keep checking the chartListener until it returns true

        let timer;
        if (!SmartChartStore.is_chart_ready) {
            // console.log('waiting for listener');
            timer = setTimeout(() => this.waitForChartListener(SmartChartStore), 500);
        } else {
            // console.log('cleared listener');
            SmartChartStore.setIsChartLoading(false);
            clearTimeout(timer);
        }
    };

    @action.bound
    removeErrorMessage() {
        delete this.error_message;
    }

    @action.bound
    setIsDigitContract(contract_type) {
        this.contract_info.contract_type = contract_type;
    }
    // ---------------------------
    // ----- Computed values -----
    // ---------------------------
    // TODO: currently this runs on each response, even if contract_info is deep equal previous one

    @computed
    get replay_config() {
        return getChartConfig(this.replay_info, this.is_digit_contract);
    }

    @computed
    get details_expiry() {
        return getDetailsExpiry(this);
    }

    @computed
    get details_info() {
        return getDetailsInfo(this.contract_info);
    }

    @computed
    get display_status() {
        return getDisplayStatus(this.contract_info.status ? this.contract_info : this.replay_info);
    }

    @computed
    get end_spot() {
        return this.contract_info.exit_tick;
    }

    @computed
    get end_spot_time() {
        const { exit_tick_time, sell_time } = this.contract_info;
        return isUserSold(this.contract_info) ? sell_time : exit_tick_time;
    }

    @computed
    get final_price() {
        return getFinalPrice(this.contract_info);
    }

    @computed
    get indicative_price() {
        return getIndicativePrice(this.contract_info);
    }

    @computed
    get is_ended() {
        return isEnded(this.contract_info.is_expired ? this.contract_info : this.replay_info);
    }

    @computed
    get is_sold_before_start() {
        return isSoldBeforeStart(this.contract_info);
    }

    @computed
    get is_started() {
        return isStarted(this.contract_info);
    }

    @computed
    get is_user_sold() {
        return isUserSold(this.contract_info);
    }

    @computed
    get is_valid_to_sell() {
        return isValidToSell(this.contract_info);
    }

    @computed
    get is_digit_contract() {
        return isDigitContract(this.contract_info.contract_type || this.replay_info.contract_type);
    }
}
