import {
    action,
    observable }              from 'mobx';
import { setSmartChartsPublicPath } from 'smartcharts-beta';
import { getUrlBase }          from '_common/url';
import { localize }           from 'App/i18n';
import BinarySocket           from '_common/base/socket_base';
import ServerTime             from '_common/base/server_time';
import { isEmptyObject }      from '_common/utility';
import { WS }                 from 'Services';
import ContractStore          from './contract-store';
import { contractSold }       from '../Portfolio/Helpers/portfolio-notifcations';
import BaseStore              from '../../base-store';

setSmartChartsPublicPath(getUrlBase('/js/smartcharts/'));

export default class ContractReplayStore extends BaseStore {
    @observable contract_store = { contract_info: {} };
    // --- Observable properties ---
    @observable digits_info = observable.object({});
    @observable sell_info   = observable.object({});

    @observable has_error         = false;
    @observable error_message     = '';
    @observable is_chart_loading  = true;

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
            this.contract_store = new ContractStore(this.root_store, { contract_id });
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
        this.is_chart_loading    = true;
        this.contract_info       = {};
        this.indicative_status   = null;
        this.prev_indicative     = 0;
        this.indicative          = 0;
        this.sell_info           = {};
        this.error_message       = null;
        this.has_error           = false;
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

        // update the contract_store here passing contract_info
        this.contract_store.populateConfig(this.contract_info);

        const end_time = this.contract_store.end_time;

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
        this.barriers_array = this.contract_store.barriers_array;
        this.markers_array = this.contract_store.markers_array;

        this.is_chart_loading = false;
    }

    @action.bound
    updateMargin(duration) {
        const granularity = this.contract_store.contract_config.granularity;

        this.margin = Math.floor(
            !granularity ?  (Math.max(300, (30 * duration) / (60 * 60) || 0)) : 3 * granularity
        );
    }

    @action.bound
    onClickSell(contract_id) {
        const { bid_price } = this.contract_info;
        if (contract_id && bid_price) {
            this.constract_store.is_sell_requested = true;
            WS.sell(contract_id, bid_price).then(this.handleSell);
        }
    }

    @action.bound
    handleSell(response) {
        if (response.error) {
            // If unable to sell due to error, give error via pop up if not in contract mode
            this.contract_store.is_sell_requested = false;
            this.root_store.common.services_error = {
                type: response.msg_type,
                ...response.error,
            };
            this.root_store.ui.toggleServicesErrorModal(true);
        } else if (!response.error && response.sell) {
            this.contract_store.is_sell_requested = false;
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


