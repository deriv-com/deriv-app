import { action, observable, makeObservable } from 'mobx';
import BaseStore from './base-store';
import RootStore from './root-store';

export default class TradingHubStore extends BaseStore {
    is_tour_open = false;

    constructor(root_store: RootStore) {
        super(root_store);
        makeObservable(this, {
            is_tour_open: observable,
            toggleIsTourOpen: action.bound,
        });
    }
    toggleIsTourOpen(is_tour_open: boolean) {
        this.is_tour_open = is_tour_open;
    }
}
