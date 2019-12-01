import {
    observable,
    action,
}                    from 'mobx';
import { observer }  from '../utils/observer';

export default class SummaryStore {
    @observable summary = {
        lost_contracts: 0,
        number_of_runs: 0,
        total_profit  : 0,
        total_payout  : 0,
        total_stake   : 0,
        won_contracts : 0,
    };

    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    onContractStatusEvent(contract_status) {
        switch (contract_status.id) {
            // TODO: Constants (coming from trade engine) for case labels below.
            case ('contract.purchase_received'): {
                const { buy } = contract_status;
                this.summary.total_stake += buy.buy_price;
                break;
            }
            case ('contract.sold'): {
                const { contract } = contract_status;
                this.summary.total_profit += contract.profit;
                this.summary.number_of_runs += 1;

                switch (contract.status) {
                    case ('won'): {
                        this.summary.won_contracts += 1;
                        this.summary.total_payout += contract.payout;
                        break;
                    }
                    case ('lost'): {
                        this.summary.lost_contracts += 1;
                        break;
                    }
                    case ('sold'): {
                        if (contract.profit > 0) {
                            this.summary.won_contracts += 1;
                            this.summary.total_payout += contract.profit;
                        } else {
                            this.summary.lost_contracts += 1;
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
    clear() {
        this.summary = {
            lost_contracts: 0,
            number_of_runs: 0,
            total_profit  : 0,
            total_payout  : 0,
            total_stake   : 0,
            won_contracts : 0,
        };
        observer.emit('summary.clear');
    }
}
