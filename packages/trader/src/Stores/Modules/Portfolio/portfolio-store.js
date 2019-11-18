import {
    action,
    computed,
    observable,
    reaction }                     from 'mobx';
import { createTransformer }       from 'mobx-utils';
import { WS }                      from 'Services/ws-methods';
import ObjectUtils                 from 'deriv-shared/utils/object';
import { formatPortfolioPosition } from './Helpers/format-response';
import { contractSold }            from './Helpers/portfolio-notifications';
import {
    getCurrentTick,
    getDurationPeriod,
    getDurationTime,
    getDurationUnitText }          from './Helpers/details';
import {
    getDisplayStatus,
    getEndTime,
    isEnded,
    isUserSold,
    isValidToSell }                from '../Contract/Helpers/logic';
import BaseStore                   from '../../base-store';

export default class PortfolioStore extends BaseStore {
    @observable positions  = [];
    @observable is_loading = false;
    @observable error      = '';
    getPositionById        = createTransformer((id) => this.positions.find((position) => +position.id === +id));

    subscribers = {};

    @action.bound
    initializePortfolio = async () => {
        this.is_loading = true;
        await WS.wait('authorize');
        WS.portfolio().then(this.portfolioHandler);
        WS.subscribeProposalOpenContract(null, this.proposalOpenContractHandler);
        WS.subscribeTransaction(this.transactionHandler);
    };

    @action.bound
    clearTable() {
        this.positions  = [];
        this.is_loading = false;
        this.error      = '';
        WS.forgetAll('proposal_open_contract', 'transaction');
    }

    @action.bound
    portfolioHandler(response) {
        this.is_loading = false;
        if ('error' in response) {
            this.error = response.error.message;
            return;
        }
        this.error = '';
        if (response.portfolio.contracts) {
            this.positions = response.portfolio.contracts
                .map(pos => formatPortfolioPosition(pos, this.root_store.modules.trade.active_symbols))
                .sort((pos1, pos2) => pos2.reference - pos1.reference); // new contracts first
        }
    }

    @action.bound
    onBuyResponse({ contract_id, longcode, contract_type }) {
        if (this.subscribers[contract_id]) {
            return /* do nothing */;
        }
        const new_pos = {
            contract_id,
            longcode,
            contract_type,
        };
        this.pushNewPosition(new_pos);
        this.subscribers[contract_id] =
            WS.subscribeProposalOpenContract(contract_id, this.proposalOpenContractHandler);
    }

    @action.bound
    async transactionHandler(response) {
        if ('error' in response) {
            this.error = response.error.message;
        }
        if (!response.transaction) return;
        const { contract_id, action: act, longcode } = response.transaction;

        if (act === 'buy') {
            this.onBuyResponse({
                contract_id,
                longcode,
                contract_type: '', // TODO: figure out the icon not showing
            });
        } else if (act === 'sell') {
            const i = this.getPositionIndexById(contract_id);

            if (!this.positions[i]) {
                // On a page refresh, portfolio call has returend empty,
                // even though we we get a transaction.sell response.
                return;
            }
            this.positions[i].is_loading = true;
            const subscriber = WS.subscribeProposalOpenContract(contract_id, (poc) => {
                this.updateContractTradeStore(poc);
                this.populateResultDetails(poc);
                subscriber.unsubscribe();
            });
        }
    }

    deepClone = obj => JSON.parse(JSON.stringify(obj));
    updateContractTradeStore(response) {
        const contract_trade = this.root_store.modules.contract_trade;
        const has_poc = !ObjectUtils.isEmptyObject(response.proposal_open_contract);
        const has_error = !!response.error;
        if (!has_poc && !has_error) return;
        if (has_poc) {
            contract_trade.addContract(this.deepClone(response.proposal_open_contract));
            contract_trade.updateProposal(this.deepClone(response));
        }
    }

    @action.bound
    proposalOpenContractHandler(response) {
        if ('error' in response) {
            this.updateContractTradeStore(response);
            return;
        }

        const proposal = response.proposal_open_contract;
        const portfolio_position = this.positions.find((position) => +position.id === +proposal.contract_id);

        if (!portfolio_position) return;
        this.updateContractTradeStore(response);

        const formatted_position = formatPortfolioPosition(
            proposal,
            this.root_store.modules.trade.active_symbols,
            portfolio_position.indicative
        );
        Object.assign(portfolio_position, formatted_position);

        const prev_indicative = portfolio_position.indicative;
        const new_indicative  = +proposal.bid_price;
        const profit_loss     = +proposal.profit;

        // fix for missing barrier and entry_spot in proposal_open_contract API response, only re-assign if valid
        if (proposal.barrier) portfolio_position.barrier = +proposal.barrier;
        if (proposal.entry_spot) portfolio_position.entry_spot = +proposal.entry_spot;

        // store contract proposal details that require modifiers
        portfolio_position.indicative       = new_indicative;
        portfolio_position.profit_loss      = profit_loss;
        portfolio_position.is_valid_to_sell = isValidToSell(proposal);

        // store contract proposal details that do not require modifiers
        portfolio_position.contract_info    = proposal;

        // for tick contracts
        if (proposal.tick_count) {
            const current_tick = (portfolio_position.current_tick > getCurrentTick(proposal)) ?
                portfolio_position.current_tick : getCurrentTick(proposal);
            portfolio_position.current_tick = current_tick;
        }

        if (new_indicative > prev_indicative) {
            portfolio_position.status = 'profit';
        } else if (new_indicative < prev_indicative) {
            portfolio_position.status = 'loss';
        } else {
            portfolio_position.status = null;
        }
    }

    @action.bound
    onClickSell(contract_id) {
        const i = this.getPositionIndexById(contract_id);
        const { bid_price } = this.positions[i].contract_info;
        this.positions[i].is_sell_requested = true;
        if (contract_id && bid_price) {
            WS.sell(contract_id, bid_price).then(this.handleSell);
        }
    }

    @action.bound
    handleSell(response) {
        if (response.error) {
            // If unable to sell due to error, give error via pop up if not in contract mode
            const i = this.getPositionIndexById(response.echo_req.sell);
            this.positions[i].is_sell_requested = false;

            // invalidToken error will handle in socket-general.js
            if (response.error.code !== 'InvalidToken') {
                this.root_store.common.services_error = {
                    type: response.msg_type,
                    ...response.error,
                };
                this.root_store.ui.toggleServicesErrorModal(true);
            }
        } else if (!response.error && response.sell) {
            const i = this.getPositionIndexById(response.sell.contract_id);
            this.positions[i].is_sell_requested = false;
            // update contract store sell info after sell
            this.root_store.modules.contract_trade.sell_info = {
                sell_price    : response.sell.sold_for,
                transaction_id: response.sell.transaction_id,
            };
            this.root_store.ui.addNotificationMessage(
                contractSold(this.root_store.client.currency, response.sell.sold_for)
            );
        }
    }

    @action.bound
    populateResultDetails = (response) => {
        const contract_response = response.proposal_open_contract;
        const i = this.getPositionIndexById(contract_response.contract_id);

        this.positions[i].contract_info    = contract_response;
        this.positions[i].duration         = getDurationTime(contract_response);
        this.positions[i].duration_unit    = getDurationUnitText(getDurationPeriod(contract_response));
        this.positions[i].exit_spot        = contract_response.exit_tick || contract_response.current_spot; // workaround if no exit_tick in proposal_open_contract, use latest spot
        this.positions[i].is_valid_to_sell = isValidToSell(contract_response);
        this.positions[i].result           = getDisplayStatus(contract_response);
        this.positions[i].profit_loss      = +contract_response.profit;
        this.positions[i].sell_time        = getEndTime(contract_response) || contract_response.current_spot_time; // same as exit_spot, use latest spot time if no exit_tick_time
        this.positions[i].sell_price       = contract_response.sell_price;
        this.positions[i].status           = 'complete';

        // fix for missing barrier and entry_spot
        if (!this.positions[i].contract_info.barrier || !this.positions[i].contract_info.entry_spot) {
            this.positions[i].contract_info.barrier    = this.positions[i].barrier;
            this.positions[i].contract_info.entry_spot = this.positions[i].entry_spot;
        }

        // remove exit_spot for manually sold contracts
        if (isUserSold(contract_response)) this.positions[i].exit_spot = '-';

        this.positions[i].is_loading = false;

        if (isEnded(contract_response)) {
            // also forget for buy
            [this.populateResultDetails, this.proposalOpenContractHandler].forEach(() => {
                if (!(contract_response.contract_id in this.subscribers)) return;
                this.subscribers[contract_response.contract_id].unsubscribe();
                delete this.subscribers[contract_response.contract_id];
            });
        }
    };

    @action.bound
    pushNewPosition(new_pos) {
        this.positions.unshift(formatPortfolioPosition(new_pos, this.root_store.modules.trade.active_symbols));
    }

    @action.bound
    removePositionById(contract_id) {
        const contract_idx = this.getPositionIndexById(contract_id);

        this.positions.splice(contract_idx, 1);
        this.root_store.modules.contract_trade.removeContract({ contract_id });
    }

    @action.bound
    accountSwitcherListener () {
        return new Promise(async (resolve) => {
            return resolve(this.initializePortfolio());
        });
    }

    @action.bound
    preSwitchAccountListener () {
        this.clearTable();

        return Promise.resolve();
    }

    @action.bound
    logoutListener() {
        this.clearTable();
        return Promise.resolve();
    }

    @action.bound
    onMount() {
        this.onPreSwitchAccount(this.preSwitchAccountListener);
        this.onSwitchAccount(this.accountSwitcherListener);
        this.onLogout(this.logoutListener);
        if (this.positions.length === 0) {
            // TODO: Optimise the way is_logged_in changes are detected for "logging in" and "already logged on" states
            if (this.root_store.client.is_logged_in) {
                this.initializePortfolio();
            } else {
                reaction(() => this.root_store.client.is_logged_in, () => {
                    if (this.root_store.client.is_logged_in) {
                        this.initializePortfolio();
                    }
                });
            }
        }
    }

    @action.bound
    onUnmount() {
        this.disposePreSwitchAccount();
        this.disposeSwitchAccount();
        this.disposeLogout();
        // keep data and connections for portfolio drawer on desktop
        if (this.root_store.ui.is_mobile) {
            // this.clearTable();
        }
    }

    getPositionIndexById(contract_id) {
        return this.positions.findIndex(pos => +pos.id === +contract_id);
    }

    @computed
    get totals() {
        let indicative = 0;
        let payout     = 0;
        let purchase   = 0;

        this.positions.forEach((portfolio_pos) => {
            indicative += (+portfolio_pos.indicative);
            payout     += (+portfolio_pos.payout);
            purchase   += (+portfolio_pos.purchase);
        });
        return {
            indicative,
            payout,
            purchase,
        };
    }

    @computed
    get active_positions_totals() {
        let indicative = 0;
        let purchase   = 0;

        this.active_positions.forEach((portfolio_pos) => {
            indicative += (+portfolio_pos.indicative);
            purchase   += (+portfolio_pos.purchase);
        });
        return {
            indicative,
            purchase,
        };
    }

    @computed
    get active_positions() {
        return this.positions.filter(portfolio_pos => !getEndTime(portfolio_pos.contract_info));
    }

    @computed
    get all_positions() {
        return this.positions;
    }

    @computed
    get is_active_empty() {
        return !this.is_loading && this.active_positions.length === 0;
    }

    @computed
    get active_positions_count() {
        return this.active_positions.length || 0;
    }

    @computed
    get is_empty() {
        return !this.is_loading && this.all_positions.length === 0;
    }
}
