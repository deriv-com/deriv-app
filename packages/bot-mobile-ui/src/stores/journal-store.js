import { observable, action } from 'mobx';

class JournalStore {
    @observable messages = [];

    constructor(root_store) {
        this.root_store = root_store;
        this.api = this.root_store.api;
    }

    @action.bound
    onMount() {
        
    }

    @action.bound
    onUnmount() {

    }

    @action.bound
    addMessage(message) {
        this.messages.push(message);
        this.messages = this.messages.slice();
    }
}

export default JournalStore;
