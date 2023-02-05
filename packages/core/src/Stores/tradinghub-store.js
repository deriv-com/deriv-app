import { action, observable, makeObservable } from 'mobx';
import BaseStore from './base-store';

export default class TradingHubStore extends BaseStore {
    is_tour_open = false;
    is_onboarding_visited = false;

    constructor(root_store) {
        super({ root_store });
        makeObservable(this, {
            is_tour_open: observable,
            toggleIsTourOpen: action.bound,
        });
    }
    toggleIsTourOpen(is_tour_open) {
        this.is_tour_open = is_tour_open;
    }
    setIsOnboardingVisited(is_visited) {
        this.is_onboarding_visited = is_visited;
    }
}
