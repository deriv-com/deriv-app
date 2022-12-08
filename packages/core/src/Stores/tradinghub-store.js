import { action, observable, makeObservable } from 'mobx';
import BaseStore from './base-store';

export default class TradingHubStore extends BaseStore {
    current_account_type = 'demo';
    is_tour_open = false;

    constructor(root_store) {
        super({ root_store });
        makeObservable(this, {
            current_account_type: observable,
            is_tour_open: observable,
            setCurrentAccountType: action.bound,
            toggleIsTourOpen: action.bound,
        });
    }
    setCurrentAccountType(current_account_type) {
        this.current_account_type = current_account_type;
    }
    toggleIsTourOpen(is_tour_open) {
        this.is_tour_open = is_tour_open;
    }
}
