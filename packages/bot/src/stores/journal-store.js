import { observable, action }      from 'mobx';
import { formatDate }              from 'deriv-shared/utils/date';
import { observer }                from '../utils/observer';
import { unrecoverableErrors }     from '../constants/error-types';

export default class JournalStore {
    constructor(rootstore) {
        this.rootstore = rootstore;

        observer.register('ui.log.success', this.onLogSuccess);
        observer.register('ui.log.error', this.onLogError);
        observer.register('Error', this.onError);
        observer.register('Notify', this.onNotify);
    }

    get serverTime () {
        return this.rootstore.core.common.server_time;
    }

    @observable messages = [];

    @action.bound
    onLogSuccess(data) {
        this.pushMessage(data), 'success';
    }

    @action.bound
    onLogError(data) {
        if (unrecoverableErrors.some(x=>x.name && x.name === data.name)) {
            this.rootstore.run_panel.resetRunButton(false);
            this.rootstore.contract_card.clear();
        }
        this.pushMessage(data, 'error');
    }

    @action.bound
    onError(data) {
        this.rootstore.run_panel.resetRunButton(false);
        this.rootstore.contract_card.clear();
        this.pushMessage(data , 'error');
    }

    @action.bound
    onNotify(data) {
        this.pushMessage(data , 'notify');
    }

    @action.bound
    clearMessages (){
        this.messages = this.messages.slice(0,0);  // force array update
    }
    
    pushMessage(data,message_type) {
        const date = formatDate(this.serverTime.get());
        const time = formatDate(this.serverTime.get(), 'HH:mm:ss [GMT]');
        let message;
        if (typeof data === 'string') {
            message = `${data}`;
        } else {
            message = `${data.message}`;
        }
        this.messages.unshift({ date, time , message ,message_type });
        this.messages = this.messages.slice(0);  // force array update
    }

    onUnmount() {
        observer.unregister('ui.log.success', this.onLogSuccess);
        observer.unregister('ui.log.error', this.onLogError);
        observer.unregister('Error', this.onLogError);
        observer.unregister('Notify', this.onNotify);
    }
}
