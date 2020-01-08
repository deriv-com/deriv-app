import {
    observable,
    action,
}                   from 'mobx';

export default class LoadModalStore {

    @observable is_load_modal_open = false;
    @observable active_index = 0;

    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    toggleLoadModal() {
        this.is_load_modal_open = !this.is_load_modal_open;
    }
}
