import {
    action,
    computed,
    observable }              from 'mobx';
import BinarySocket           from '_common/base/socket_base';
import { isEmptyObject }      from '_common/utility';
import { localize }           from 'App/i18n';
import { WS }                 from 'Services';
import { isEnded }                 from './Helpers/logic';
import ContractStore          from './contract-store';
import BaseStore              from '../../base-store';

export default class ContractTradeStore extends BaseStore {
    // --- Observable properties ---

    // Chart specific observables
    @observable granularity;
    @observable chart_type;

    @observable contract_id;
    @observable contract_info = observable.object({});
    // @observable digits_info   = observable.object({});

    @observable has_error     = false;
    @observable error_message = '';

    // ---- Normal properties ---
    is_ongoing_contract = false;

    // Forget old proposal_open_contract stream on account switch from ErrorComponent
    should_forget_first = false;

    // -------------------
    // ----- Actions -----
    // -------------------
    @action.bound
    updateChartType(type) {
        this.chart_type = type;
    }

    @action.bound
    updateGranularity(granularity) {
        this.granularity = granularity;
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
            array.push(...contract.markers_array_v2);
            return array;
        }, []);
    }

    @computed
    get barriers_array() {
        return [];
        // const length = this.contracts.length;
        // const barriers = length > 0 ? this.contracts[length - 1].barriers_array  : [];
        // return toJS(barriers);
    }

    @action.bound
    addContract({ contract_id, start_time, longcode }) {
        const contract = new ContractStore(this.root_store, { contract_id });
        contract.populateConfig({ date_start: start_time, longcode });
        this.contracts.push(contract);

        // TODO: handle proposal for mulitple contracts.
        if (this.contract_id) {
            this.forgetProposalOpenContract(this.contract_id, this.updateProposal);
            this.contract_id = null;
        }
        this.contract_id = contract_id;
        BinarySocket.wait('authorize').then(() => {
            this.handleSubscribeProposalOpenContract(this.contract_id, this.updateProposal);
        });
    }

    @action.bound
    removeContract({ contract_id }) {
        this.contracts = this.contracts.filter(c => c.contract_id !== contract_id);
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        // TODO: don't forget the tick history when switching to contract-replay-store
        // TODO: don't forget the POC when swithcing to contract-replay-store
        if (this.contract_id) {
            this.forgetProposalOpenContract(this.contract_id, this.updateProposal);
            this.contract_id = null;
        }
    }

    @action.bound
    updateProposal(response) {
        // Update the contract-store corresponding to this POC
        if (response.proposal_open_contract) {
            const contract_id = +response.proposal_open_contract.contract_id;
            this.contracts.forEach(contract =>  {
                if (contract.contract_id === contract_id) {
                    contract.populateConfig(response.proposal_open_contract);
                }
            });
        }
        if ('error' in response) {
            this.has_error     = true;
            this.error_message = response.error.message;
            this.contract_info = {};
            return;
        }
        // Empty response means the contract belongs to a different account
        if (isEmptyObject(response.proposal_open_contract)) {
            this.has_error           = true;
            this.error_message       = localize('Sorry, you can\'t view this contract because it doesn\'t belong to this account.');
            this.should_forget_first = true;
            this.contract_info       = {};
            this.contract_id         = null;
            return;
        }
        if (+response.proposal_open_contract.contract_id !== this.contract_id) return;

        this.contract_info = response.proposal_open_contract;
        if (isEnded(this.contract_info)) {
            WS.forget('proposal_open_contract', this.updateProposal);
        }

        // TODO: fix this for multiple contracts
        // Set contract symbol if trade_symbol and contract_symbol don't match
        if (this.root_store.modules.trade.symbol !== this.contract_info.underlying) {
            this.root_store.modules.trade.symbol = this.contract_info.underlying;
        }
    }

    @computed
    get last_contract() {
        const len = this.contracts.length;
        return len > 0 ? this.contracts[len - 1] : { };
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
}
