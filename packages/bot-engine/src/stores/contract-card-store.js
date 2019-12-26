import {
    observable,
    action,
    computed }                from 'mobx';
import { contract_stages }    from '../constants/contract-stage';
import { isEnded ,
    getIndicativePrice }      from '../utils/contract';

export default class ContractCardStore {
    @observable contract            = null;
    @observable indicative_movement = '';
    @observable profit_movement     = '';

    contract_id                     = null;
    profit                          = 0;
    indicative                      = 0;
    
    constructor(root_store) {
        this.root_store  = root_store;
    }

    @computed
    get is_contract_completed() {
        return this.contract &&
        isEnded(this.contract) &&
        (this.root_store.run_panel.contract_stage.index !== contract_stages.PURCHASE_RECEIVED.index);
    }

    @computed
    get is_contract_loading() {
        return  (this.root_store.run_panel.is_running && this.contract === null) ||
        (this.root_store.run_panel.contract_stage.index === contract_stages.PURCHASE_SENT.index) ||
        (this.root_store.run_panel.contract_stage.index === contract_stages.STARTING.index);
    }

    @computed
    get is_contract_inactive() {
        return !this.contract &&
        !this.is_loading;
    }

    @computed
    get is_contract_losing() {
        return this.contract && this.contract.profit < 0;
    }

    @computed
    get is_contract_winning() {
        return this.contract && this.contract.profit > 0;
    }

    @action.bound
    onBotContractEvent(contract) {
        const { profit } = contract;
        const indicative = getIndicativePrice(contract);

        if (this.contract_id !== contract.id) {
            this.clear(false);
            this.contract_id = contract.id;
            this.profit      = profit;
            this.indicative  = indicative;
        }

        const movements  = { profit, indicative };

        Object.keys(movements).forEach(name => {
            if (movements[name] !== this[name]) {
                this[`${name}_movement`] = movements[name] > this[name] ? 'profit' : 'loss';
            } else if (this[`${name}_movement`] !== '') {
                this.indicative_movement = '';
            }

            this[name] = movements[name];
        });

        // TODO only add props that is being used
        this.contract = contract;
    }

    @action.bound
    clear(should_unset_contract = true) {
        if (should_unset_contract) {
            this.contract = null;
        }

        this.profit              = 0;
        this.profit_loss         = 0;
        this.indicative          = 0;
        this.indicative_movement = '';
        this.profit_movement     = '';
    }
}
