import { observable, action, makeObservable } from 'mobx';

export default class OrderDetailsStore {
    constructor(root_store) {
        makeObservable(this, {
            error_message: observable,
            setErrorMessage: action.bound,
        });

        this.root_store = root_store;
    }

    error_message = '';

    setErrorMessage(error_message) {
        this.error_message = error_message;
    }
}
