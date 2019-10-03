import {
    observable,
    action }          from 'mobx';
import { formatDate } from 'deriv-shared/utils/date';
import { observer }   from '../utils/observer';

export default class JournalStore {
    constructor(root_store) {
        this.root_store = root_store;

        observer.register('ui.log.success', this.onLogSuccess);
        observer.register('ui.log.error', this.onLogError);
        observer.register('Error', this.onLogError);
        observer.register('Notify', this.onNotify);
    }

    get serverTime () {
        return this.root_store.core.common.server_time;
    }

    @observable messages = [];

    @action.bound
    onLogSuccess(data) {
        this.pushMessage(data);
    }

    @action.bound
    onLogError(data) {
        this.pushMessage(data);
    }

    @action.bound
    onError(data) {
        this.pushMessage(data);
    }

    @action.bound
    onNotify(data) {
        this.pushMessage(data);
    }

    @action.bound
    clear() {
        this.messages = this.messages.slice(0, 0);  // force array update
    }
    
    @action.bound
    pushMessage(data) {
        const date = formatDate(this.serverTime.get());
        const time = formatDate(this.serverTime.get(), 'HH:mm:ss [GMT]');
        let message;
        if (typeof data === 'string') {
            message = `${data}`;
        } else {
            message = `${data.message}`;
        }
        this.messages.unshift({ date, time , message });
        this.messages = this.messages.slice(0);  // force array update
    }

    @action.bound
    onUnmount() {
        observer.unregister('ui.log.success', this.onLogSuccess);
        observer.unregister('ui.log.error', this.onLogError);
        observer.unregister('Error', this.onLogError);
        observer.unregister('Notify', this.onNotify);
    }
}
