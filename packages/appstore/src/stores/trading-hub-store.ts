import { action, observable } from 'mobx';
import BaseStore from './base-store';

export default class TradingHubStore extends BaseStore {
    @observable is_tour_open = false;

    @action.bound
    toggleIsTourOpen(is_tour_open: boolean) {
        this.is_tour_open = is_tour_open;
    }
}
