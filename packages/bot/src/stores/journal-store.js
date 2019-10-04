import {
    observable,
    action }                     from 'mobx';
import { formatDate }            from 'deriv-shared/utils/date';
import { observer }              from '../utils/observer';
import {
    messageTypes,
    unrecoverableErrors }        from '../constants/message-types';

export default class JournalStore {
    constructor(root_store) {
        this.root_store = root_store;

        observer.register('ui.log.success', this.onLogSuccess);
        observer.register('ui.log.error', this.onLogError);
        observer.register('Error', this.onError);
        observer.register('Notify', this.onNotify);
    }

    get serverTime () {
        return this.root_store.core.common.server_time;
    }

    @observable messages = [];

    @action.bound
    onLogSuccess(data) {
        this.pushMessage(data, messageTypes.success);
    }

    @action.bound
    onLogError(data) {
        if (unrecoverableErrors.some(x=>x.name && x.name === data.name)) {
            this.root_store.run_panel.reset();
        }
        this.pushMessage(data, messageTypes.error);
    }

    @action.bound
    onError(data) {
        this.root_store.run_panel.reset();
        this.pushMessage(data , messageTypes.error);
    }

    @action.bound
    onNotify(data) {
        this.pushMessage(data , messageTypes.notify);
    }

    @action.bound
    clear() {
        this.messages = this.messages.slice(0, 0);  // force array update
    }
    
    @action.bound
    pushMessage(data, message_type) {
        const date = formatDate(this.serverTime.get());
        const time = formatDate(this.serverTime.get(), 'HH:mm:ss [GMT]');
        let message;
        if (typeof data === 'string') {
            message = `${data}`;
        } else {
            message = `${data.message}`;
        }
        console.log(message_type); // eslint-disable-line no-console

        this.messages.unshift({ date, time , message ,message_type });
        this.messages = this.messages.slice(0);  // force array update
    }

    @action.bound
    onUnmount() {
        // TODO unregister is not working
        observer.unregister('ui.log.success', this.onLogSuccess);
        observer.unregister('ui.log.error', this.onLogError);
        observer.unregister('Error', this.onLogError);
        observer.unregister('Notify', this.onNotify);
    }
}
