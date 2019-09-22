import {
    observable,
    action,
    reaction }                from 'mobx';
import { getIndicativePrice } from '../utils/contract';
import { observer }           from '../utils/observer';

export default class ContractCardStore {
    @observable contract            = null;
    @observable indicative_movement = '';
    @observable profit_movement     = '';
    @observable currency            = '';
    @observable is_loading          = false;

    contract_id                     = null;
    profit                          = 0;
    indicative                      = 0;
    
    constructor(root_store) {
        this.root_store  = root_store;
        const { client } = this.root_store.core;
        this.currency    = client.currency;

        observer.register('bot.contract', this.onBotContractEvent);
        observer.register('contract.status', this.onContractStatusEvent);
    }

    @action.bound
    onBotContractEvent(contract) {
        const { profit } = contract;
        const indicative = getIndicativePrice(contract);

        if (this.contract_id !== contract.id) {
            this.reset(false);
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

        this.contract = contract;
    }

    @action.bound
    onContractStatusEvent(contract_status) {
        if (contract_status.id === 'contract.purchase_sent') {
            this.is_loading = true;
        }
    }

    @action.bound
    reset(should_unset_contract = true) {
        if (should_unset_contract) {
            this.contract = null;
        }

        this.profit              = 0;
        this.profit_loss         = 0;
        this.indicative          = 0;
        this.indicative_movement = '';
        this.profit_movement     = '';
    }

    disposeObserverListener() {
        observer.unregister('bot.contract', this.onBotContractEvent);
        observer.unregister('contract.status', this.onContractStatusEvent);
    }

    disposeOnAccountSwitch() {
        if (typeof this.switchAccountDisposer === 'function') {
            this.switchAccountDisposer();
        }
    }

    registerOnAccountSwitch = () => {
        const { client } = this.root_store.core;

        this.switchAccountDisposer = reaction(
            () => client.switch_broadcast,
            action((switch_broadcast) => {
                if (switch_broadcast) {
                    this.currency = client.currency;
                }
            })
        );
    }
    
}
