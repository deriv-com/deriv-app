import {
    toJS,
    action,
    computed,
    extendObservable,
    observable }              from 'mobx';
import { setSmartChartsPublicPath } from 'smartcharts-beta';
import { getUrlBase }          from '_common/url';
import { localize }           from 'App/i18n';
import BinarySocket           from '_common/base/socket_base';
import ServerTime             from '_common/base/server_time';
import { isEmptyObject }      from '_common/utility';
import { WS }                 from 'Services';
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

import { BARRIER_COLORS, BARRIER_LINE_STYLES } from '../SmartChart/Constants/barriers';
import { isBarrierSupported } from '../SmartChart/Helpers/barriers';
import { ChartBarrierStore } from '../SmartChart/chart-barrier-store';

setSmartChartsPublicPath(getUrlBase('/js/smartcharts/'));



export default class ContractReplayStore extends BaseStore {
    // --- Observable properties ---
    @observable digits_info = observable.object({});
    @observable sell_info   = observable.object({});

    @observable has_error         = false;
    @observable error_message     = '';
    @observable is_chart_loading  = true;
    @observable is_sell_requested = false;

    // ---- Replay Contract Config ----
    @observable contract_id;
    @observable indicative_status;
    @observable contract_info   = observable.object({});
    @observable is_static_chart = false;


    // ---- chart props
    @observable margin;
    @observable barriers_array = [];
    @observable markers_array = [];

    // ---- Normal properties ---
    is_ongoing_contract = false;

    // Replay Contract Indicative Movement
    prev_indicative = 0;
    indicative      = 0;

    // Forget old proposal_open_contract stream on account switch from ErrorComponent
    should_forget_first = false;

    // -------------------
    // ----- Actions -----
    // -------------------
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
    onMount(contract_id) {
        if (contract_id) {
            this.contract_id = contract_id;
            BinarySocket.wait('authorize').then(() => {
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
        this.is_chart_loading    = true;
        this.contract_info       = {};
        this.indicative_status   = null;
        this.prev_indicative     = 0;
        this.indicative          = 0;
        this.sell_info           = {};
    }

    @action.bound
    populateConfig(response) {
        if ('error' in response) {
            this.has_error        = true;
            this.is_chart_loading = false;
            return;
        }
        if (isEmptyObject(response.proposal_open_contract)) {
            this.has_error           = true;
            this.error_message       = localize('Sorry, you can\'t view this contract because it doesn\'t belong to this account.');
            this.should_forget_first = true;
            this.is_chart_loading = false;
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

        this.updateMargin(
            (end_time || this.contract_info.date_expiry) - this.contract_info.date_start
        );

        if (!end_time) this.is_ongoing_contract = true;

        // finish contracts if end_time exists
        if (end_time) {
            if (!this.is_ongoing_contract) {
                this.is_static_chart = true;
            } else {
                this.is_static_chart = false;
            }
        }

        // TODO: don't update the barriers & markers if they are not changed
        this.barriers_array = this.createBarriersArray(this.contract_info, this.root_store.ui.is_dark_mode_on);
        this.markers_array = createChartMarkers(this.contract_info);

        this.handleDigits(this.contract_info);

        this.is_chart_loading = false;
    }

    @action.bound
    updateMargin(duration) {
        const granularity = this.contract_config.granularity;

        this.margin = Math.floor(
            !granularity ?  (Math.max(300, (30 * duration) / (60 * 60) || 0)) : 3 * granularity
        );
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

    createBarriersArray = (contract_info, is_dark_mode) => {
        let result = [];
        if (contract_info) {
            const { contract_type, barrier, high_barrier, low_barrier } = contract_info;

            if (isBarrierSupported(contract_type) && (barrier || high_barrier)) {
                // create barrier only when it's available in response
                const main_barrier = new ChartBarrierStore(
                    barrier || high_barrier,
                    low_barrier,
                    null,
                    {   color        : is_dark_mode ? BARRIER_COLORS.DARK_GRAY : BARRIER_COLORS.GRAY,
                        line_style   : BARRIER_LINE_STYLES.SOLID,
                        not_draggable: true,
                    },
                );

                main_barrier.updateBarrierShade(true, contract_type);
                result = [toJS(main_barrier)];
            }
        }
        return result;
    }


    // ---------------------------
    // ----- Computed values -----
    // ---------------------------
    // TODO: currently this runs on each response, even if contract_info is deep equal previous one

    @computed
    get contract_config() {
        return getChartConfig(this.contract_info);
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

    // TODO: these can be shared between contract-replay-store.js & contract-trade-store.js
    // ---------- WS ----------
    wsSubscribe = (request_object, callback) => {
        if (request_object.subscribe === 1) {
            WS.subscribeTicksHistory({ ...request_object }, callback);
        }
    };

    wsForget = (match_values, callback) => WS.forget('ticks_history', callback, match_values);
    wsForgetStream = (stream_id) => WS.forgetStream(stream_id);

    wsSendRequest = (request_object) => {
        if (request_object.time) {
            return ServerTime.timePromise.then(() => ({
                msg_type: 'time',
                time    : ServerTime.get().unix(),
            }));
        }
        return WS.sendRequest(request_object);
    };
}


