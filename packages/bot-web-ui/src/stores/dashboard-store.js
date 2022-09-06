import { makeObservable, observable, action } from 'mobx';

export default class DashboardStore {
    constructor(root_store) {
        makeObservable(this, {
            active_tab: observable,
            setActiveTab: action.bound,
        });

        this.root_store = root_store;
    }

    active_tab = 0;

    setActiveTab(active_tab) {
        this.active_tab = active_tab;
    }
}
