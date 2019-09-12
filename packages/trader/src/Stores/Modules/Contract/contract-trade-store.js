import {
    action,
    computed,
    observable,
    toJS }               from 'mobx';
import BinarySocket      from '_common/base/socket_base';
import { isEmptyObject } from '_common/utility';
import { localize }      from 'App/i18n';
import { WS }            from 'Services';
import ContractStore     from './contract-store';
import BaseStore         from '../../base-store';
import { getContractTypesConfig } from '../Trading/Constants/contract';
import { clientNotifications }         from '../../Helpers/client-notifications.js';

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
        const tick_chart_types = ['mountain','line', 'colored_line', 'spline', 'baseline'];
        // TODO: fix this in smartcharts
        if (granularity === 0
            && tick_chart_types.indexOf(this.chart_type) === -1) {
                this.chart_type = 'mountain';
        }
        if (granularity !== 0
            && tick_chart_types.indexOf(this.chart_type) !== -1) {
                this.chart_type = 'candle';
        }
        this.granularity = granularity;
        if(this.granularity === 0) {
            this.root_store.ui.removeNotification(
                clientNotifications.switch_to_tick_chart
            );
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

    applicable_contracts = () => {
        const { symbol: underlying, contract_type: trade_type } = this.root_store.modules.trade;
        if (!trade_type || !underlying) { return []; }
        const { trade_types } = getContractTypesConfig()[trade_type];
        return this.contracts
            .filter(c => c.contract_info.underlying === underlying)
            .filter(c => {
                const info = c.contract_info;
                let ok = trade_types.indexOf(info.contract_type) !== -1;
                // both high_low & rise_fall have the same contract_types in POC response
                // entry_spot=barrier means it is rise_fall contract (blame the api)
                if (ok
                    && info.barrier
                    && info.entry_tick
                    && (info.contract_type === 'CALL' || info.contract_type === 'PUT')
                ) {
                    const type = `${+info.entry_tick}` === `${+info.barrier}` ? 'rise_fall' : 'high_low';
                    ok = trade_type === type;
                }
                return ok;
            });
    }

    @computed
    get markers_array() {
        const markers = this.applicable_contracts()
            .map(c => c.marker)
            .filter(m => m)
            .map(m => toJS(m));
        if (markers.length) {
            markers[markers.length - 1].is_last_contract = true;
        }
        return markers;
    }

    @action.bound
    addContract({
        barrier,
        contract_id,
        contract_type,
        start_time,
        longcode,
        underlying,
        is_tick_contract,
    }) {
        const contract = new ContractStore(this.root_store, { contract_id });
        contract.populateConfig({
            date_start: start_time,
            barrier,
            contract_type,
            longcode,
            underlying,
        });
        this.contracts.push(contract);
        BinarySocket.wait('authorize').then(() => {
            this.handleSubscribeProposalOpenContract(contract_id, this.updateProposal);
        });

        if(is_tick_contract && this.granularity !== 0) {
            this.root_store.ui.addNotification(
                clientNotifications.switch_to_tick_chart
            );
        }
    }

    @action.bound
    removeContract({ contract_id }) {
        this.contracts = this.contracts.filter(c => c.contract_id !== contract_id);
        this.forgetProposalOpenContract(contract_id, this.updateProposal);
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
                    if(response.proposal_open_contract.is_sold) {
                        this.root_store.ui.removeNotification(
                            clientNotifications.switch_to_tick_chart
                        );
                    }
                }
            });
        }
    }

    @computed
    get last_contract() {
        const applicable_contracts = this.applicable_contracts();
        const length = applicable_contracts.length;
        return length > 0 ? applicable_contracts[length - 1] : { };
    }

    forgetProposalOpenContract = (contract_id, cb) => {
        WS.forget('proposal_open_contract', cb, { contract_id });
    }

    @action.bound
    clearError() {
        this.error_message = '';
        this.has_error = false;
    }
}
