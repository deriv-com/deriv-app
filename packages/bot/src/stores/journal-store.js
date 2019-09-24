
import { observable, action } from 'mobx';
import { formatDate }         from 'deriv-shared/utils/date';
import { observer } from '../utils/observer';

export default class JournalStore {
    constructor(rootstore) {
        this.rootstore = rootstore;

        observer.register('ui.log.success', this.onLogSuccess);
        observer.register('ui.log.error', this.onLogError);
        observer.register('Error', this.onLogError);
        observer.register('Notify', this.onNotify);
    }

    get serverTime () {
        return this.rootstore.core.common.server_time;
    }

    @observable messages = [];

    @action.bound
    onLogSuccess(data) {
        if (this.rootstore.runPanel.is_running) {
            console.log('onLogSuccess' , data); // eslint-disable-line no-console
        }
    }

    @action.bound
    onLogError(data) {
        if (this.rootstore.runPanel.is_running) {
            console.log('onLogError' , data); // eslint-disable-line no-console
        }
    }

    @action.bound
    onError(data) {
        if (this.rootstore.runPanel.is_running) {
            console.log('onError', data); // eslint-disable-line no-console
        }
    }

    @action.bound
    onNotify(data) {
        this.pushMessage(data);
    }

    pushMessage(data) {
        const date = formatDate(this.serverTime.get());
        const time = formatDate(this.serverTime.get());
        this.messages.push({ date, time , message: data.message });
        this.messages = this.messages.slice(0);  // force array update
    }
}
