import {
    observable,
    action }                from 'mobx';
import { formatDate }       from 'deriv-shared/utils/date';
import { message_types }    from '../constants/messages';

export default class JournalStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    get serverTime () {
        return this.root_store.core.common.server_time;
    }

    @observable messages = [];

    @action.bound
    onLogSuccess(data) {
        this.pushMessage(data, message_types.SUCCESS);
    }

    @action.bound
    onError(data) {
        this.pushMessage(data , message_types.ERROR);
    }

    @action.bound
    onNotify(data) {
        this.pushMessage(data , message_types.NOTIFY);
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

        this.messages.unshift({ date, time , message ,message_type });
        this.messages = this.messages.slice(0);  // force array update
    }

    @action.bound
    clear() {
        this.messages = this.messages.slice(0, 0);  // force array update
    }
}
