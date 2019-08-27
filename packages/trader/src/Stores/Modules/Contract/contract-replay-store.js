import {
    action,
    computed,
    extendObservable,
    observable }              from 'mobx';
import { localize }           from 'App/i18n';
import BinarySocket           from '_common/base/socket_base';
import { isEmptyObject }      from '_common/utility';
import { WS }                 from 'Services';
import { createChartBarrier } from './Helpers/chart-barriers';
import { createChartMarkers } from './Helpers/chart-markers';
import {
    getDigitInfo,
    isDigitContract }         from './Helpers/digits';
import {
    getChartConfig,
    getDisplayStatus,
    getEndTime,
    isEnded }                 from './Helpers/logic';
import { contractSold }       from '../Portfolio/Helpers/portfolio-notifcations';
import BaseStore              from '../../base-store';

export default class ContractReplayStore extends BaseStore {
    // --- Observable properties ---
    @observable digits_info = observable.object({});
    @observable sell_info   = observable.object({});

    @observable has_error         = false;
    @observable error_message     = '';
    @observable is_sell_requested = false;

    // ---- Replay Contract Config ----
    @observable contract_id;
    @observable indicative_status;
    @observable contract_info   = observable.object({});
    @observable is_static_chart = false;

    // ---- Normal properties ---
    chart_type          = 'mountain';
    is_ongoing_contract = false;

    // Replay Contract Indicative Movement
    prev_indicative = 0;
    indicative      = 0;

    // Forget old proposal_open_contract stream on account switch from ErrorComponent
    should_forget_first = false;

    subscribers = {};

    // -------------------
    // ----- Actions -----
    // -------------------
    handleSubscribeProposalOpenContract = (contract_id, cb) => {
        const proposal_open_contract_request = [contract_id, cb, false];

        if (this.should_forget_first) {
            WS.forgetAll('proposal_open_contract').then(() => {
                this.should_forget_first = false;
                WS.storage.proposalOpenContract({contract_id: proposal_open_contract_request[0]})
                    .then(proposal_open_contract_request[1]);
                this.subscribers[proposal_open_contract_request[0]] =
                    WS.subscribeProposalOpenContract(...proposal_open_contract_request);
            });
        } else {
            WS.storage.proposalOpenContract({contract_id: proposal_open_contract_request[0]})
                .then(proposal_open_contract_request[1]);
            this.subscribers[proposal_open_contract_request[0]]
                = WS.subscribeProposalOpenContract(...proposal_open_contract_request);
        }
    }

    @action.bound
    onMount(contract_id) {
        if (contract_id) {
            this.smart_chart = this.root_store.modules.smart_chart;
            this.smart_chart.setContractMode(true);
            this.contract_id = contract_id;
            BinarySocket.expectResponse('authorize').then(() => {
                this.handleSubscribeProposalOpenContract(this.contract_id, this.populateConfig);
            });
            WS.activeSymbols({ skip_cache_update: true });
        }
    }

    @action.bound
    onUnmount() {
        this.forgetProposalOpenContract(this.contract_id, this.populateConfig);
        this.contract_id         = null;
        this.digits_info         = {};
        this.is_ongoing_contract = false;
        this.is_static_chart     = false;
        this.is_sell_requested   = false;
        this.contract_info       = {};
        this.indicative_status   = null;
        this.prev_indicative     = 0;
        this.indicative          = 0;
        this.sell_info           = {};
        this.smart_chart.setContractMode(false);
        this.smart_chart.cleanupContractChartView();
    }

    @action.bound
    populateConfig(response) {
        if ('error' in response) {
            this.has_error       = true;
            this.smart_chart.setIsChartLoading(false);
            return;
        }
        if (isEmptyObject(response.proposal_open_contract)) {
            this.has_error           = true;
            this.error_message       = localize('Sorry, you can\'t view this contract because it doesn\'t belong to this account.');
            this.should_forget_first = true;
            this.smart_chart.setContractMode(false);
            this.smart_chart.setIsChartLoading(false);
            return;
        }
        if (+response.proposal_open_contract.contract_id !== this.contract_id) return;

        this.contract_info = response.proposal_open_contract;

        // Add indicative status for contract
        const prev_indicative  = this.prev_indicative;
        const new_indicative   = +this.contract_info.bid_price;
        this.indicative = new_indicative;
        if (new_indicative > prev_indicative) {
            this.indicative_status = 'profit';
        } else if (new_indicative < prev_indicative) {
            this.indicative_status = 'loss';
        } else {
            this.indicative_status = null;
        }
        this.prev_indicative = this.indicative;

        const end_time = getEndTime(this.contract_info);

        this.smart_chart.updateMargin(
            (end_time || this.contract_info.date_expiry) - this.contract_info.date_start);

        if (!end_time) this.is_ongoing_contract = true;

        // finish contracts if end_time exists
        if (end_time) {
            if (!this.is_ongoing_contract) {
                this.is_static_chart = true;
            } else {
                this.is_static_chart = false;
            }
        }

        createChartBarrier(this.smart_chart, this.contract_info, this.root_store.ui.is_dark_mode_on);
        createChartMarkers(this.smart_chart, this.contract_info);
        this.handleDigits(this.contract_info);

        this.smart_chart.setIsChartLoading(false);
    }

    @action.bound
    handleDigits(contract_info) {
        if (this.is_digit_contract) {
            extendObservable(this.digits_info, getDigitInfo(this.digits_info, contract_info));
        }
    }

    @action.bound
    onClickSell(contract_id) {
        const { bid_price } = this.contract_info;
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

    forgetProposalOpenContract = (contract_id) => {
        if (!(contract_id in this.subscribers)) return;
        this.subscribers[contract_id].unsubscribe();
        delete this.subscribers[contract_id];
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

    // ---------------------------
    // ----- Computed values -----
    // ---------------------------
    // TODO: currently this runs on each response, even if contract_info is deep equal previous one

    @computed
    get contract_config() {
        return getChartConfig(this.contract_info, this.is_digit_contract, false);
    }

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
