import {
    action,
    observable }              from 'mobx';
import ObjectUtils            from 'deriv-shared/utils/object';
import { WS }                 from 'Services/ws-methods';
import { localize }           from 'deriv-translations';
import ContractStore          from './contract-store';
import { contractSold }       from '../Portfolio/Helpers/portfolio-notifications';
import BaseStore              from '../../base-store';

export default class ContractReplayStore extends BaseStore {
    @observable is_chart_ready = false;
    @observable contract_store = { contract_info: {} };
    // --- Observable properties ---
    @observable is_sell_requested = false;
    @observable has_error         = false;
    @observable error_message     = '';
    @observable is_chart_loading  = true;
    // ---- chart props
    @observable margin;

    // ---- Replay Contract Config ----
    @observable contract_id;
    @observable indicative_status;
    @observable contract_info   = observable.object({});
    @observable is_static_chart = false;

    // ---- Normal properties ---
    is_ongoing_contract = false;
    prev_indicative = 0;

    // TODO: you view a contract and then share that link with another person,
    // when the person opens, try to switch account they get the error
    // Forget old proposal_open_contract stream on account switch from ErrorComponent
    should_forget_first = false;

    subscribers = {};

    // -------------------
    // ----- Actions -----
    // -------------------
    handleSubscribeProposalOpenContract = (contract_id, cb) => {
        if (this.should_forget_first) {
            // TODO; don't forget all ever
            WS.forgetAll('proposal_open_contract').then(() => {
                this.should_forget_first = false;
                WS.storage.proposalOpenContract({ contract_id }).then(cb);
                this.subscribers[contract_id] =
                    WS.subscribeProposalOpenContract(contract_id, cb);
            });
        } else {
            WS.storage.proposalOpenContract({ contract_id }).then(cb);
            this.subscribers[contract_id]
                = WS.subscribeProposalOpenContract(contract_id, cb);
        }
    };

    @action.bound
    onMount(contract_id) {
        if (contract_id) {
            this.contract_id = contract_id;
            this.contract_store = new ContractStore(this.root_store, { contract_id });
            WS.wait('authorize').then(() => {
                this.handleSubscribeProposalOpenContract(this.contract_id, this.populateConfig);
            });
            WS.storage.activeSymbols('brief');
        }
    }

    @action.bound
    onUnmount() {
        this.forgetProposalOpenContract(this.contract_id, this.populateConfig);
        this.contract_id         = null;
        this.is_ongoing_contract = false;
        this.is_static_chart     = false;
        this.is_chart_loading    = true;
        this.contract_info       = {};
        this.indicative_status   = null;
        this.prev_indicative     = 0;
    }

    @action.bound
    populateConfig(response) {
        if ('error' in response) {
            this.has_error        = true;
            this.is_chart_loading = false;
            return;
        }
        if (ObjectUtils.isEmptyObject(response.proposal_open_contract)) {
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
        if (new_indicative > prev_indicative) {
            this.indicative_status = 'profit';
        } else if (new_indicative < prev_indicative) {
            this.indicative_status = 'loss';
        } else {
            this.indicative_status = null;
        }
        this.prev_indicative = new_indicative;

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
    setIsChartReady(v) {
        // SmartChart has a bug with scroll_to_epoch
        // @morteza: It ignores the scroll_to_epoch if feed is not ready
        setTimeout(action(() => { this.is_chart_ready = v; }), 200);
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
            this.root_store.ui.addNotificationMessage(
                contractSold(this.root_store.client.currency, response.sell.sold_for)
            );
        }
    }

    forgetProposalOpenContract = (contract_id) => {
        if (!(contract_id in this.subscribers)) return;
        this.subscribers[contract_id].unsubscribe();
        delete this.subscribers[contract_id];
    }

    @action.bound
    removeErrorMessage() {
        this.error_message = '';
        this.has_error     = false;
    }
}
