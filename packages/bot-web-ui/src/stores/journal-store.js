import { observable, action, computed } from 'mobx';
import { localize } from '@deriv/translations';
import { formatDate } from '@deriv/shared/utils/date';
import { message_types } from '@deriv/bot-skeleton';
import { config } from '@deriv/bot-skeleton/src/constants/config';
import { storeSetting, getSetting } from '../utils/settings';

export default class JournalStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    getServerTime() {
        return this.root_store.core.common.server_time.get();
    }

    filters = [
        { id: message_types.ERROR, label: localize('Errors') },
        { id: message_types.NOTIFY, label: localize('Notifications') },
        { id: message_types.SUCCESS, label: localize('System') },
    ];

    @observable unfiltered_messages = [];
    @observable checked_filters = getSetting('journal_filter') || this.filters.map(filter => filter.id);

    @action.bound
    onLogSuccess(data) {
        this.pushMessage(data, message_types.SUCCESS);
    }

    @action.bound
    onError(data) {
        this.pushMessage(data, message_types.ERROR);
    }

    @action.bound
    onNotify(data) {
        if (data.message === undefined) {
            return;
        }
        this.pushMessage(data, message_types.NOTIFY);

        const { sound } = data;
        if (sound !== config.lists.NOTIFICATION_SOUND[0][1]) {
            const audio = document.getElementById(sound);
            audio.play();
        }
    }

    @action.bound
    pushMessage(data, message_type) {
        const date = formatDate(this.getServerTime());
        const time = formatDate(this.getServerTime(), 'HH:mm:ss [GMT]');

        let error_message = data;
        let classname = '';
        if (typeof data !== 'string') {
            const { error, message } = data;
            ({ className: classname } = data);
            error_message = error && error.error ? error.error.message : message;
        }

        this.unfiltered_messages.unshift({ date, time, message: error_message, message_type, classname });
    }

    @computed
    get filtered_messages() {
        // filter messages based on filtered-checkbox
        return this.unfiltered_messages.filter(
            message =>
                !this.checked_filters.length || this.checked_filters.some(filter => message.message_type === filter)
        );
    }

    @action.bound
    filterMessage(checked, item_id) {
        if (checked) {
            this.checked_filters.push(item_id);
        } else {
            this.checked_filters.splice(this.checked_filters.indexOf(item_id), 1);
        }

        storeSetting('journal_filter', this.checked_filters);
    }

    @action.bound
    clear() {
        this.unfiltered_messages = [];
        this.filterMessage(this.checked_filters);
    }
}
