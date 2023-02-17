import { action, observable, makeObservable } from 'mobx';

export default class BlocklyStore {
    constructor(root_store) {
        makeObservable(this, {
            is_loading: observable,
            startLoading: action.bound,
            endLoading: action.bound,
        });

        this.root_store = root_store;
    }

    is_loading = false;

    startLoading() {
        this.is_loading = true;
    }

    endLoading() {
        this.is_loading = false;
    }
}
