import { action, observable } from 'mobx';

export default class BlocklyStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable is_loading = false;

    @action.bound
    startLoading() {
        this.is_loading = true;
    }

    @action.bound
    endLoading() {
        this.is_loading = false;
    }
}
