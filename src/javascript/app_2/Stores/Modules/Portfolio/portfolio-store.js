import {
    action,
    computed,
    observable }                   from 'mobx';
import { WS }                      from 'Services';
import { formatPortfolioPosition } from './Helpers/format-response';
import {
    getCurrentTick,
    getDurationPeriod,
    getDurationTime,
    getDurationUnitText }          from './Helpers/details';
import {
    getDisplayStatus,
    getEndSpot,
    getEndSpotTime,
    isValidToSell }                from '../Contract/Helpers/logic';
import BaseStore                   from '../../base-store';

export default class PortfolioStore extends BaseStore {
    @observable positions  = [];
    @observable is_loading = false;
    @observable error      = '';

    @action.bound
    initializePortfolio = () => {
        if (!this.root_store.client.is_logged_in) return;
        this.is_loading = true;

        WS.portfolio().then(this.portfolioHandler);
        WS.subscribeProposalOpenContract(null, this.proposalOpenContractHandler, false);
        WS.subscribeTransaction(this.transactionHandler, false);
    };

    @action.bound
    clearTable() {
        this.positions  = [];
        this.is_loading = false;
        this.error      = '';
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
                .map(pos => formatPortfolioPosition(pos))
                .sort((pos1, pos2) => pos2.reference - pos1.reference); // new contracts first
        }
    }

    @action.bound
    transactionHandler(response) {
        if ('error' in response) {
            this.error = response.error.message;
        }
        if (!response.transaction) return;
        const { contract_id, action: act } = response.transaction;

        if (act === 'buy') {
            WS.portfolio().then((res) => {
                const new_pos = res.portfolio.contracts.find(pos => +pos.contract_id === +contract_id);
                if (!new_pos) return;
                this.pushNewPosition(new_pos);
            });
            // subscribe to new contract:
            WS.subscribeProposalOpenContract(contract_id, this.proposalOpenContractHandler, false);
        } else if (act === 'sell') {
            const i = this.getPositionIndexById(contract_id);
            this.positions[i].is_loading = true;
            WS.subscribeProposalOpenContract(contract_id, this.populateResultDetails, false);
        }
    }

    @action.bound
    proposalOpenContractHandler(response) {
        if ('error' in response) return;

        const proposal = response.proposal_open_contract;
        const portfolio_position = this.positions.find((position) => +position.id === +proposal.contract_id);

        if (!portfolio_position) return;

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
        this.positions[i].is_sell_requested = false;
        if (contract_id && bid_price) {
            WS.sell(contract_id, bid_price).then(this.handleSell);
        }
    }

    @action.bound
    handleSell(response) {
        // Toast messages are temporary UI for prompting user of sold contracts
        if (response.error) {
            // If unable to sell due to error, give error via pop up if not in contract mode
            const i = this.getPositionIndexById(response.echo_req.sell);
            this.positions[i].is_sell_requested = false;
            this.root_store.common.services_error = {
                type: response.msg_type,
                ...response.error,
            };
            this.root_store.ui.toggleServicesErrorModal(true);
        } else if (!response.error && response.sell) {
            const i = this.getPositionIndexById(response.sell.contract_id);
            this.positions[i].is_sell_requested = false;
            // update contract store sell info after sell
            this.root_store.modules.contract.sell_info = {
                sell_price    : response.sell.sold_for,
                transaction_id: response.sell.transaction_id,
            };
            this.root_store.ui.addToastMessage({
                message: `Contract was sold for ${response.sell.sold_for}.`,
                type   : 'info',
            });
        }
    }

    @action.bound
    populateResultDetails = (response) => {
        const contract_response = response.proposal_open_contract;
        const i = this.getPositionIndexById(contract_response.contract_id);

        this.positions[i].contract_info    = contract_response;
        this.positions[i].exit_spot        = getEndSpot(contract_response) || contract_response.current_spot; // workaround if no exit_spot in proposal_open_contract, use latest spot
        this.positions[i].duration         = getDurationTime(contract_response);
        this.positions[i].duration_unit    = getDurationUnitText(getDurationPeriod(contract_response));
        this.positions[i].is_valid_to_sell = isValidToSell(contract_response);
        this.positions[i].result           = getDisplayStatus(contract_response);
        this.positions[i].sell_time        = getEndSpotTime(contract_response) || contract_response.current_spot_time; // same as exit_spot, use latest spot time if no exit_tick_time
        this.positions[i].status           = 'complete';

        // fix for missing barrier and entry_spot
        if (!this.positions[i].contract_info.barrier || !this.positions[i].contract_info.entry_spot) {
            this.positions[i].contract_info.barrier    = this.positions[i].barrier;
            this.positions[i].contract_info.entry_spot = this.positions[i].entry_spot;
        }

        this.positions[i].is_loading = false;
    }

    @action.bound
    pushNewPosition(new_pos) {
        this.positions.unshift(formatPortfolioPosition(new_pos));
    }

    @action.bound
    removePositionById(contract_id) {
        const is_contract_mode = this.root_store.modules.smart_chart.is_contract_mode;
        let i = this.getPositionIndexById(contract_id);
        // check if position to be removed is out of range from the maximum amount rendered in drawer
        if (this.positions.length > 4) i += 1;
        this.positions.splice(i, 1);
        // check if chart is in contract_mode before removing contract details from chart
        if (is_contract_mode) {
            this.root_store.modules.contract.onCloseContract();
            this.root_store.modules.trade.requestProposal();
        }
    }

    @action.bound
    accountSwitcherListener () {
        return new Promise((resolve) => {
            this.clearTable();
            WS.forgetAll('proposal_open_contract', 'transaction');
            return resolve(this.initializePortfolio());
        });
    }

    @action.bound
    onMount() {
        this.onSwitchAccount(this.accountSwitcherListener.bind(null));
        if (this.positions.length === 0) {
            this.initializePortfolio();
        }
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        // keep data and connections for portfolio drawer on desktop
        if (this.root_store.ui.is_mobile) {
            this.clearTable();
            WS.forgetAll('proposal_open_contract', 'transaction');
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
    get active_positions() {
        return this.positions.filter((portfolio_pos) => !portfolio_pos.result);
    }

    @computed
    get all_positions() {
        return this.positions;
    }

    @computed
    get is_empty() {
        return !this.is_loading && this.all_positions.length === 0;
    }
}
