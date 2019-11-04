import {
    observable,
    action }                  from 'mobx';
import { getIndicativePrice } from '../utils/contract';
import { observer }           from '../utils/observer';

export default class ContractCardStore {
    @observable contract            = null;
    @observable indicative_movement = '';
    @observable profit_movement     = '';
    @observable is_loading          = false;

    contract_id                     = null;
    profit                          = 0;
    indicative                      = 0;
    
    constructor(root_store) {
        this.root_store  = root_store;

        observer.register('bot.contract', this.onBotContractEvent);
        observer.register('contract.status', this.onContractStatusEvent);
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
            this.is_loading  = false;
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
    onContractStatusEvent(contract_status) {
        if (contract_status.id === 'contract.purchase_sent') {
            this.is_loading = true;
        }
    }

    @action.bound
    clear(should_unset_contract = true) {
        if (should_unset_contract) {
            this.contract = null;
        }

        this.is_loading          = false;
        this.profit              = 0;
        this.profit_loss         = 0;
        this.indicative          = 0;
        this.indicative_movement = '';
        this.profit_movement     = '';
    }

    @action.bound
    onUnmount() {
        observer.unregister('bot.contract', this.onBotContractEvent);
        observer.unregister('contract.status', this.onContractStatusEvent);
    }
}
