import { action, observable } from 'mobx';
import { routes, isEmptyObject } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import ContractStore from './contract-store';
import { contractCancelled, contractSold } from '../Portfolio/Helpers/portfolio-notifications';
import BaseStore from '../../base-store';

export default class ContractReplayStore extends BaseStore {
    @observable is_chart_ready = false;
    @observable contract_store = { contract_info: {} };
    // --- Observable properties ---
    @observable is_sell_requested = false;
    @observable has_error = false;
    @observable error_message = '';
    @observable is_chart_loading = true;
    // ---- chart props
    @observable margin;

    // ---- Replay Contract Config ----
    @observable contract_id;
    @observable indicative_status;
    @observable.ref contract_info = observable.object({});
    @observable is_static_chart = false;

    // ---- Normal properties ---
    is_ongoing_contract = false;
    prev_indicative = 0;

    @observable.ref contract_update = observable.object({});
    // TODO: you view a contract and then share that link with another person,
    // when the person opens, try to switch account they get the error
    // Forget old proposal_open_contract stream on account switch from ErrorComponent
    should_forget_first = false;

    // -------------------
    // ----- Actions -----
    // -------------------
    handleSubscribeProposalOpenContract = async (contract_id, cb) => {
        // expired contracts are cached and we can get the poc response from local storage
        const is_cached = await WS.storage.has({ proposal_open_contract: 1, contract_id });
        if (is_cached) {
            WS.storage.proposalOpenContract({ contract_id }).then(cb);
            return;
        }

        if (this.should_forget_first) {
            // TODO; don't forget all ever
            await WS.forgetAll('proposal_open_contract');
            this.should_forget_first = false;
        }

        // If the contract replay is opened from trade page, it should already have an ongoing subscription
        // Subscription is created only when the contract replay page is opened directly
        if (!this.root_store.modules.contract_trade.contracts_map[contract_id]) {
            this.subscriber = WS.subscribeProposalOpenContract(contract_id, cb);
        }
    };

    subscribeProposalOpenContract = () => {
        WS.wait('authorize').then(() => {
            this.handleSubscribeProposalOpenContract(this.contract_id, this.populateConfig);
        });
    };

    @action.bound
    onMount(contract_id) {
        if (contract_id) {
            this.contract_id = contract_id;
            this.contract_store = new ContractStore(this.root_store, { contract_id });
            this.subscribeProposalOpenContract();
            WS.storage.activeSymbols('brief');
            WS.setOnReconnect(() => {
                if (!this.root_store.client.is_switching) {
                    this.subscribeProposalOpenContract();
                }
            });
        }
    }

    @action.bound
    onUnmount() {
        this.forgetProposalOpenContract(this.contract_id, this.populateConfig);
        this.contract_id = null;
        this.is_ongoing_contract = false;
        this.is_static_chart = false;
        this.is_chart_loading = true;
        this.contract_info = {};
        this.indicative_status = null;
        this.prev_indicative = 0;
        // @shayan: for forcing chart to call scale 1:1 each time,
        // we should let SmartChart notify when its ready
        this.is_chart_ready = false;
        this.root_store.ui.toggleHistoryTab(false);
        WS.removeOnReconnect();
    }

    @action.bound
    populateConfig(response) {
        if (!this.switch_account_listener) return;

        if ('error' in response) {
            this.has_error = true;
            this.is_chart_loading = false;
            return;
        }
        if (isEmptyObject(response.proposal_open_contract)) {
            this.has_error = true;
            this.error_message = localize(
                "Sorry, you can't view this contract because it doesn't belong to this account."
            );
            this.should_forget_first = true;
            this.is_chart_loading = false;
            return;
        }
        if (+response.proposal_open_contract.contract_id !== this.contract_id) return;

        this.contract_info = response.proposal_open_contract;
        this.contract_update = response.proposal_open_contract.limit_order;

        // Add indicative status for contract
        const prev_indicative = this.prev_indicative;
        const new_indicative = +this.contract_info.bid_price;
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

        this.updateMargin((end_time || this.contract_info.date_expiry) - this.contract_info.date_start);

        if (!end_time) this.is_ongoing_contract = true;

        // finish contracts if end_time exists
        if (end_time) {
            if (!this.is_ongoing_contract) {
                this.is_static_chart = true;
            } else {
                this.is_static_chart = false;
            }
        }

        if (this.contract_info.is_sold) {
            this.contract_store.cacheProposalOpenContractResponse(response);
        }

        this.is_chart_loading = false;
    }

    @action.bound
    updateMargin(duration) {
        const granularity = this.contract_store.contract_config.granularity;

        this.margin = Math.floor(!granularity ? Math.max(300, (30 * duration) / (60 * 60) || 0) : 3 * granularity);
    }

    @action.bound
    setIsChartReady(v) {
        // SmartChart has a bug with scroll_to_epoch
        // @morteza: It ignores the scroll_to_epoch if feed is not ready
        setTimeout(
            action(() => {
                this.is_chart_ready = v;
            }),
            200
        );
    }

    @action.bound
    onClickCancel(contract_id) {
        if (contract_id) {
            WS.cancelContract(contract_id).then(response => {
                if (response.error) {
                    this.root_store.common.setServicesError({
                        type: response.msg_type,
                        ...response.error,
                    });
                } else {
                    this.root_store.ui.addNotificationMessage(contractCancelled());
                }
            });
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
            this.root_store.common.setServicesError({
                type: response.msg_type,
                ...response.error,
            });
        } else if (!response.error && response.sell) {
            this.is_sell_requested = false;
            // update contract store sell info after sell
            this.sell_info = {
                sell_price: response.sell.sold_for,
                transaction_id: response.sell.transaction_id,
            };
            this.root_store.ui.addNotificationMessage(
                contractSold(this.root_store.client.currency, response.sell.sold_for)
            );
        }
    }

    forgetProposalOpenContract = () => {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            delete this.subscriber;
        }
    };

    @action.bound
    removeErrorMessage() {
        this.error_message = '';
        this.has_error = false;
    }

    setAccountSwitcherListener = (contract_id, history) => {
        this.onSwitchAccount(() => this.accountSwitcherListener(contract_id, history));
    };

    accountSwitcherListener = (contract_id, history) => {
        // if contract had an error on the previous account
        // try fetching it again for the new account
        // in case it belongs to this account
        if (this.has_error) {
            this.removeErrorMessage();
            this.onMount(contract_id);
        } else {
            history.push(routes.reports);
        }
        return Promise.resolve();
    };

    removeAccountSwitcherListener = () => {
        this.disposeSwitchAccount();
    };
}
