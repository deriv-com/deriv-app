import {
    observable,
    action }                from 'mobx';
import { formatDate }       from '@deriv/shared/utils/date';
import { message_types }    from '../constants/messages';
import {
    storeSetting,
    getSetting,
}                           from '../scratch/utils/settings';

export default class JournalStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    get serverTime () {
        return this.root_store.core.common.server_time;
    }

    filter_list = [
        { id: message_types.ERROR, label: 'Error messages', onChange: this.filterMessage },
        { id: message_types.NOTIFY, label: 'Notifications', onChange: this.filterMessage },
        { id: message_types.SUCCESS, label: 'System log', onChange: this.filterMessage },
    ];

    unfilter_messages = [];

    @observable messages = [];
    @observable checked_filter = getSetting('journal_filter') || this.filter_list.map(filter => filter.id);

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
    filterMessage(checked_items) {
        storeSetting('journal_filter', checked_items);
        this.checked_filter = checked_items;
        this.messages = this.unfilter_messages.filter(message => checked_items.indexOf(message.message_type) >= 0);
        this.messages.slice(0);
    }

    @action.bound
    clear() {
        this.unfilter_messages = [];
        this.filterMessage(this.checked_filter);
    }
}
