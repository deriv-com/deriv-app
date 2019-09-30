import {action, observable } from 'mobx';
import { observer }          from '../utils/observer';

export default class transactionsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;

        observer.register('contract.status', this.onContractStatusEvent);
    }
    @observable transactions;

    @action.bound
    onContractStatusEvent(data) {
        this.pushMessage(data);
    }

    @action.bound
    pushMessage(data) {
       
        console.log('************', data);

        this.messages.unshift({ data });
        this.messages = this.messages.slice(0);  // force array update
    }

    onUnmount() {
        observer.unregister('contract.status', this.onLogError);
    }
}