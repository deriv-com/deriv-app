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
    getDigitInfo,
    isDigitContract }         from './Helpers/digits';
import {
    getChartGranularity,
    getChartType,
    getDisplayStatus,
    getEndTime,
    isEnded }                 from './Helpers/logic';
import ContractStore          from './contract-store';
import BaseStore              from '../../base-store';

export default class ContractTradeStore extends BaseStore {
    // --- Observable properties ---
    @observable contract_id;
    @observable contract_info = observable.object({});
    @observable digits_info   = observable.object({});

    @observable has_error     = false;
    @observable error_message = '';

    // ---- Normal properties ---
    is_from_positions   = false;
    is_ongoing_contract = false;

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
            // this.smart_chart.setContractStart(date_start);
            // this.smart_chart.setContractEnd(end_time);

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
        const markers = createChartMarkers(this.contract_info);
        markers.forEach(marker => {
            if (!(marker.type in this.smart_chart.markers)) {
                this.smart_chart.createMarker(marker);
            }
        });

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

    @observable contracts = [];


    @computed
    get markers_array() {
        return this.contracts.reduce((array, contract) => {
            array.push(...contract.markers_array);
            return array;
        }, []);
    }

    @computed
    get barriers_array() {
        const length = this.contracts.length;
        return length > 0 ? this.contracts[length - 1].barriers_array  : [];
    }

    @action.bound
    addContract({ contract_id, start_time }) {
        const contract = new ContractStore(this.root_store, { contract_id });
        contract.populateConfig({ date_start: start_time });
        this.contracts.push(contract);
    }

    @action.bound
    drawContractStartTime(date_start, longcode, contract_id) {
        this.contract_info.longcode = longcode;
        const smart_chart = this.root_store.modules.smart_chart;
        const markers = createChartMarkers({ date_start });
        markers.forEach(marker => {
            if (!(marker.type in smart_chart.markers)) {
                smart_chart.createMarker(marker);
            }
        });
        this.onMountBuy(contract_id);
    }

    @action.bound
    onMountBuy(contract_id) {
        if (contract_id === this.contract_id) return;
        this.contract_id = contract_id;
        // clear proposal and purchase info once contract is mounted
        this.root_store.modules.trade.proposal_info = {};
        this.root_store.modules.trade.purchase_info = {};
        BinarySocket.wait('authorize').then(() => {
            this.handleSubscribeProposalOpenContract(this.contract_id, this.updateProposal);
        });
    }

    @action.bound
    onMount(contract_id, is_from_positions) {
        if (contract_id === this.contract_id) return;
        this.smart_chart       = this.root_store.modules.smart_chart;
        const has_existing_id  = this.smart_chart.is_contract_mode && !!(this.contract_id);
        if (has_existing_id) this.resetValues(this.smart_chart);
        this.has_error         = false;
        this.error_message     = '';
        this.contract_id       = contract_id;
        this.is_from_positions = is_from_positions;

        // clear proposal and purchase info once contract is mounted
        this.root_store.modules.trade.proposal_info = {};
        this.root_store.modules.trade.purchase_info = {};

        if (contract_id) {
            if (this.is_from_positions) {
                this.smart_chart.setIsChartLoading(true);
                // this.smart_chart.switchToContractMode(true, has_existing_id);
            }
            BinarySocket.wait('authorize').then(() => {
                this.handleSubscribeProposalOpenContract(this.contract_id, this.updateProposal);
            });
        }
    }

    @action.bound
    resetValues(SmartChartStore) {
        this.forgetProposalOpenContract(this.contract_id, this.updateProposal);
        this.contract_id         = null;
        this.contract_info       = {};
        this.digits_info         = {};
        this.error_message       = '';
        this.has_error           = false;
        this.is_from_positions   = false;
        this.is_ongoing_contract = false;
        SmartChartStore.cleanupContractChartView();
    }

    @action.bound
    onCloseContract() {
        if (!this.smart_chart) this.smart_chart = this.root_store.modules.smart_chart;
        this.resetValues(this.smart_chart);
        this.smart_chart.applySavedTradeChartLayout();
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        this.onCloseContract();
    }

    @action.bound
    updateProposal(response) {
        const contract_id = +response.proposal_open_contract.contract_id;
        this.contracts.forEach(contract =>  {
            if (contract.contract_id === contract_id) {
                contract.populateConfig(response.proposal_open_contract);
            }
        });
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

        // Set chart granularity and chart_type
        this.handleChartType(this.contract_info.date_start, getEndTime(this.contract_info) || null);

        // Set chart view to date_start
        if (this.is_from_positions) {
            if (this.smart_chart.granularity !== 0) {
                this.smart_chart.setChartView(this.contract_info.date_start);
            }
        }

        // Set contract symbol if trade_symbol and contract_symbol don't match
        if (this.root_store.modules.trade.symbol !== this.contract_info.underlying) {
            this.root_store.modules.trade.symbol = this.contract_info.underlying;
        }

        this.drawChart(this.contract_info);

        this.handleDigits(this.contract_info);
    }

    @action.bound
    handleDigits(contract_info) {
        if (this.is_digit_contract) {
            extendObservable(this.digits_info, getDigitInfo(this.digits_info, contract_info));
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
    get display_status() {
        return getDisplayStatus(this.contract_info);
    }

    @computed
    get is_ended() {
        return isEnded(this.contract_info);
    }

    @computed
    get is_digit_contract() {
        return isDigitContract(this.contract_info.contract_type);
    }
}
