import {
    action,
    computed,
    observable, 
    toJS}         from 'mobx';
import BinarySocket      from '_common/base/socket_base';
import { isEmptyObject } from '_common/utility';
import { localize }      from 'App/i18n';
import { WS }            from 'Services';
import ContractStore     from './contract-store';
import BaseStore         from '../../base-store';

export default class ContractTradeStore extends BaseStore {
    // --- Observable properties ---
    @observable contracts = [];
    @observable has_error     = false;
    @observable error_message = '';

    // Chart specific observables
    @observable granularity;
    @observable chart_type;

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

    @computed
    get markers_array() {
        const markers = this.contracts
            .map(c => c.marker)
            .filter(m => m)
            .map(m => toJS(m));
        if (markers.length) {
            markers[markers.length - 1].is_last_contract = true;
        }
        return markers;
    }

    @computed
    get barriers_array() {
        return [];
        // const length = this.contracts.length;
        // const barriers = length > 0 ? this.contracts[length - 1].barriers_array  : [];
        // return toJS(barriers);
    }

    @action.bound
    addContract({ contract_id, contract_type, start_time, longcode }) {
        const contract = new ContractStore(this.root_store, { contract_id });
        contract.populateConfig({ date_start: start_time, longcode, contract_type });
        this.contracts.push(contract);
        BinarySocket.wait('authorize').then(() => {
            this.handleSubscribeProposalOpenContract(contract_id, this.updateProposal);
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
        // TODO: don't forget the POC when switching to contract-replay-store
        if (this.contracts.length > 0) {
            this.contracts.forEach(contract =>  {
                const { contract_id, is_forgotten, is_ended } = contract;
                if (contract_id && !is_forgotten && is_ended) {
                    this.forgetProposalOpenContract(contract_id, this.updateProposal);
                    // once contract for the id is forgotten, add flag to indicate it's already forgotten
                    contract.is_forgotten = true;
                }
            });
        }
    }

    @action.bound
    updateProposal(response) {
        if ('error' in response) {
            this.has_error     = true;
            this.error_message = response.error.message;
            return;
        }
        // Empty response means the contract belongs to a different account
        if (isEmptyObject(response.proposal_open_contract)) {
            this.has_error           = true;
            this.error_message       = localize('Sorry, you can\'t view this contract because it doesn\'t belong to this account.');
            this.should_forget_first = true;
            // If contract does not belong to this account
            this.contracts           = [];
            return;
        }
        // Update the contract-store corresponding to this POC
        if (response.proposal_open_contract) {
            const contract_id = +response.proposal_open_contract.contract_id;
            this.contracts.forEach(contract =>  {
                if (contract.contract_id === contract_id) {
                    contract.populateConfig(response.proposal_open_contract);
                }
            });
        }
    }

    @computed
    get last_contract() {
        const length = this.contracts.length;
        return length > 0 ? this.contracts[length - 1] : { };
    }

    forgetProposalOpenContract = (contract_id, cb) => {
        WS.forget('proposal_open_contract', cb, { contract_id });
    }

    @action.bound
    clearError() {
        this.has_error = false;
        this.error_message = null;
    }
}
