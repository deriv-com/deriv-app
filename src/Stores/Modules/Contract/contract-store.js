import {
    action,
    computed,
    extendObservable,
    observable }              from 'mobx';
import BinarySocket           from '_common/base/socket_base';
import { isEmptyObject }      from '_common/utility';
import { localize }           from 'App/i18n';
import { WS }                 from 'Services';
import { createChartBarrier } from './Helpers/chart-barriers';
import { createChartMarkers } from './Helpers/chart-markers';
import {
    getDetailsExpiry,
    getDetailsInfo }          from './Helpers/details';
import {
    getDigitInfo,
    isDigitContract }         from './Helpers/digits';
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
    isValidToSell }           from './Helpers/logic';
import { contractSold }       from '../Portfolio/Helpers/portfolio-notifcations';
import BaseStore              from '../../base-store';

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
    @observable replay_indicative_status;
    @observable replay_info = observable.object({});
    @observable is_replay_static_chart = false;

    // ---- Normal properties ---
    chart_type          = 'mountain';
    is_from_positions   = false;
    is_ongoing_contract = false;

    // Replay Contract Indicative Movement
    replay_prev_indicative   = 0;
    replay_indicative        = 0;

    // Forget old proposal_open_contract stream on account switch from ErrorComponent
    should_forget_first = false;

    // -------------------
    // ----- Actions -----
    // -------------------
    @action.bound
    drawChart() {
        const {
            date_expiry,
            date_start,
            tick_count,
        } = this.contract_info;

        const end_time = getEndTime(this.contract_info);

        // Set chart granularity and chart_type
        this.handleChartType(date_start, end_time || null);

        // Set chart view to date_start
        this.smart_chart.setChartView(date_start);

        if (!end_time) this.is_ongoing_contract = true;

        // finish contracts if end_time exists
        if (end_time) {
            const is_one_tick_contract = (tick_count < 2);
            if (!this.is_ongoing_contract && !is_one_tick_contract) {
                // set to static chart to true for non one tick contract
                // to avoid chart from reloading
                this.smart_chart.setStaticChart(true);
            } else {
                this.smart_chart.setStaticChart(false);
            }
            this.smart_chart.setContractStart(date_start);
            this.smart_chart.setContractEnd(end_time);

            // Clear chart loading status once ChartListener returns ready for completed contract
            if (!this.is_ongoing_contract) {
                this.smart_chart.setIsChartLoading(false);
            }

        // setters for ongoing contracts, will only init once onMount after left_epoch is set
        } else if (this.is_from_positions) {
            this.smart_chart.setContractStart(date_start);
        }

        this.smart_chart.updateMargin((end_time || date_expiry) - date_start);

        createChartBarrier(this.smart_chart, this.contract_info, this.root_store.ui.is_dark_mode_on);
        createChartMarkers(this.smart_chart, this.contract_info);

        if (this.smart_chart.is_chart_ready) {
            this.smart_chart.setIsChartLoading(false);
        }
    }

    handleSubscribeProposalOpenContract = (contract_id, cb) => {
        const proposal_open_contract_request = [contract_id, cb, false];

        if (this.should_forget_first) {
            WS.forgetAll('proposal_open_contract').then(() => {
                this.should_forget_first = false;
                WS.subscribeProposalOpenContract(...proposal_open_contract_request);
            });
        } else {
            WS.subscribeProposalOpenContract(...proposal_open_contract_request);
        }
    }

    @action.bound
    drawContractStartTime(date_start, longcode, contract_id) {
        this.contract_info.longcode = longcode;
        createChartMarkers(this.root_store.modules.smart_chart, { date_start });
        this.onMountBuy(contract_id);
    }

    @action.bound
    onMountBuy(contract_id) {
        if (contract_id === this.contract_id) return;
        this.contract_id = contract_id;
        BinarySocket.wait('authorize').then(() => {
            this.handleSubscribeProposalOpenContract(this.contract_id, this.updateProposal);
        });
    }

    @action.bound
    onMount(contract_id, is_from_positions) {
        if (contract_id === this.contract_id) return;
        this.onSwitchAccount(this.accountSwitcherListener.bind(null));
        this.smart_chart       = this.root_store.modules.smart_chart;
        if (this.smart_chart.is_contract_mode) this.onCloseContract();
        this.has_error         = false;
        this.error_message     = '';
        this.contract_id       = contract_id;
        this.is_from_positions = is_from_positions;

        if (contract_id) {
            this.replay_info = {};
            if (this.is_from_positions) {
                this.smart_chart.setIsChartLoading(true);
                this.smart_chart.switchToContractMode(true);
            }
            BinarySocket.wait('authorize').then(() => {
                this.handleSubscribeProposalOpenContract(this.contract_id, this.updateProposal);
            });
        }
    }

    @action.bound
    onMountReplay(contract_id) {
        if (contract_id) {
            this.contract_info = {};
            this.smart_chart = this.root_store.modules.smart_chart;
            this.smart_chart.setContractMode(true);
            this.replay_contract_id = contract_id;
            BinarySocket.wait('authorize').then(() => {
                this.handleSubscribeProposalOpenContract(this.replay_contract_id, this.populateConfig);
            });
        }
    }

    @action.bound
    onUnmountReplay() {
        this.forgetProposalOpenContract(this.replay_contract_id, this.populateConfig);
        this.replay_contract_id       = null;
        this.digits_info              = {};
        this.is_ongoing_contract      = false;
        this.is_replay_static_chart   = false;
        this.is_sell_requested        = false;
        this.replay_info              = {};
        this.replay_indicative_status = null;
        this.replay_prev_indicative   = 0;
        this.replay_indicative        = 0;
        this.sell_info                = {};
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
        this.forgetProposalOpenContract(this.contract_id, this.updateProposal);
        this.chart_type          = 'mountain';
        this.contract_id         = null;
        this.contract_info       = {};
        this.digits_info         = {};
        this.error_message       = '';
        this.has_error           = false;
        this.is_sell_requested   = false;
        this.is_from_positions   = false;
        this.is_ongoing_contract = false;
        this.sell_info           = {};

        if (!this.smart_chart) this.smart_chart = this.root_store.modules.smart_chart;
        this.smart_chart.cleanupContractChartView();
        this.smart_chart.applySavedTradeChartLayout();
        WS.forgetAll('proposal').then(this.root_store.modules.trade.requestProposal());
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        this.onCloseContract();
    }

    @action.bound
    populateConfig(response) {
        if ('error' in response) {
            this.has_error       = true;
            this.contract_config = {};
            this.smart_chart.setIsChartLoading(false);
            return;
        }
        if (isEmptyObject(response.proposal_open_contract)) {
            this.has_error           = true;
            this.error_message       = localize('Sorry, you can\'t view this contract because it doesn\'t belong to this account.');
            this.should_forget_first = true;
            this.contract_config     = {};
            this.smart_chart.setContractMode(false);
            this.smart_chart.setIsChartLoading(false);
            return;
        }
        if (+response.proposal_open_contract.contract_id !== this.replay_contract_id) return;

        this.replay_info = response.proposal_open_contract;

        // Add indicative status for contract
        const prev_indicative  = this.replay_prev_indicative;
        const new_indicative   = +this.replay_info.bid_price;
        this.replay_indicative = new_indicative;
        if (new_indicative > prev_indicative) {
            this.replay_indicative_status = 'profit';
        } else if (new_indicative < prev_indicative) {
            this.replay_indicative_status = 'loss';
        } else {
            this.replay_indicative_status = null;
        }
        this.replay_prev_indicative = this.replay_indicative;

        const end_time = getEndTime(this.replay_info);

        this.smart_chart.updateMargin(
            (end_time || this.replay_info.date_expiry) - this.replay_info.date_start);

        if (!end_time) this.is_ongoing_contract = true;

        // finish contracts if end_time exists
        if (end_time) {
            this.is_replay_static_chart = !this.is_ongoing_contract;
        }

        createChartBarrier(this.smart_chart, this.replay_info, this.root_store.ui.is_dark_mode_on);
        createChartMarkers(this.smart_chart, this.replay_info);
        this.handleDigits(this.replay_info);

        this.smart_chart.setIsChartLoading(false);
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
            this.has_error           = true;
            this.error_message       = localize('Sorry, you can\'t view this contract because it doesn\'t belong to this account.');
            this.should_forget_first = true;
            this.contract_info       = {};
            this.contract_id         = null;
            this.smart_chart.setContractMode(false);
            this.smart_chart.setIsChartLoading(false);
            return;
        }
        if (+response.proposal_open_contract.contract_id !== this.contract_id) return;

        this.contract_info = response.proposal_open_contract;

        // Set contract symbol if trade_symbol and contract_symbol don't match
        if (this.root_store.modules.trade.symbol !== this.contract_info.underlying) {
            this.root_store.modules.trade.updateSymbol(this.contract_info.underlying);
        }

        this.drawChart(this.contract_info);

        this.handleDigits(this.contract_info);
    }

    @action.bound
    async handleDigits(contract_info) {
        if (this.is_digit_contract) {
            const digit_info = await getDigitInfo(this.digits_info, contract_info);
            extendObservable(this.digits_info, digit_info);
        }
    }

    @action.bound
    onClickSell(contract_id) {
        const { bid_price } = this.replay_info;
        if (contract_id && bid_price) {
            this.is_sell_requested = true;
            WS.sell(contract_id, bid_price).then(this.handleSell);
        }
    }

    @action.bound
    handleSell(response) {
        if (response.error) {
            // If unable to sell due to error, give error via pop up if not in contract mode
            this.is_sell_requested = false;
            this.root_store.common.services_error = {
                type: response.msg_type,
                ...response.error,
            };
            this.root_store.ui.toggleServicesErrorModal(true);
        } else if (!response.error && response.sell) {
            this.is_sell_requested = false;
            // update contract store sell info after sell
            this.sell_info = {
                sell_price    : response.sell.sold_for,
                transaction_id: response.sell.transaction_id,
            };
            this.root_store.ui.addNotification(contractSold(this.root_store.client.currency, response.sell.sold_for));
        }
    }

    handleChartType(start, expiry) {
        if (!this.smart_chart) {
            this.smart_chart = this.root_store.modules.smart_chart;
        }

        const chart_type  = getChartType(start, expiry);
        const granularity = getChartGranularity(start, expiry);

        this.smart_chart.updateChartType(chart_type);
        this.smart_chart.updateGranularity(granularity);
    }

    forgetProposalOpenContract = (contract_id, cb) => {
        WS.forget('proposal_open_contract', cb, { contract_id });
    }

    @action.bound
    removeErrorMessage() {
        delete this.error_message;
    }

    @action.bound
    clearError() {
        this.error_message = null;
        this.has_error = false;
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
        return getChartConfig(this.replay_info,this.is_digit_contract);
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
