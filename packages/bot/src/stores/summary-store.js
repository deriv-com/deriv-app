import {
    observable,
    action,
    reaction }       from 'mobx';
import { observer }  from '../utils/observer';

export default class SummaryStore {
    @observable currency        = '';
    @observable lost_contracts  = 0;
    @observable number_of_runs  = 0;
    @observable total_profit    = 0;
    @observable total_payout    = 0;
    @observable total_stake     = 0;
    @observable won_contracts   = 0;
    
    constructor(root_store) {
        this.root_store        = root_store;
        const { client }       = this.root_store.core;
        this.currency          = client.currency;

        observer.register('contract.status', this.onContractStatusEvent);
    }

    @action.bound
    onContractStatusEvent(contract_status) {
        switch (contract_status.id) {
            case ('contract.purchase_recieved'): {
                const { buy } = contract_status;
                this.total_stake += buy.buy_price;
                break;
            }
            case ('contract.sold'): {
                const { contract }   = contract_status;
                this.total_profit   += contract.profit;
                this.number_of_runs += 1;

                switch (contract.status) {
                    case ('won'): {
                        this.won_contracts += 1;
                        this.total_payout  += contract.payout;
                        break;
                    }
                    case ('lost'): {
                        this.lost_contracts += 1;
                        break;
                    }
                    case ('sold'): {
                        if (contract.profit > 0) {
                            this.won_contracts += 1;
                            this.total_payout  += contract.profit;
                        } else {
                            this.lost_contracts += 1;
                        }
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
    }

    @action.bound
    onClearClick() {
        this.lost_contracts = 0;
        this.number_of_runs = 0;
        this.total_profit   = 0;
        this.total_payout   = 0;
        this.total_stake    = 0;
        this.won_contracts  = 0;
    }

    disposeObserverListener() {
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
