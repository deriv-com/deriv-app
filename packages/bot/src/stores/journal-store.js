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
    @observable checked_filter = [message_types.ERROR, message_types.NOTIFY, message_types.SUCCESS];
    unfilter_messages = [];
    filter_list = [
        { id: message_types.ERROR, label: 'Error', onChange: this.filterMessage },
        { id: message_types.NOTIFY, label: 'Notify', onChange: this.filterMessage },
        { id: message_types.SUCCESS, label: 'Log', onChange: this.filterMessage },
    ];

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
        
        let error_message  = data;
        if (typeof data !== 'string') {
            const { error , message } = data;
            error_message = error && error.error ? error.error.message : message;
        }

        this.unfilter_messages.unshift({ date, time , message: error_message, message_type });
        this.filterMessage(this.checked_filter);
    }

    @action.bound
    filterMessage(checked) {
        this.checked_filter = checked;
        this.messages = this.unfilter_messages.filter(message => checked.indexOf(message.message_type) >= 0);
        this.messages.slice(0);
    }

    @action.bound
    clear() {
        this.messages = this.messages.slice(0, 0);  // force array update
    }
}
