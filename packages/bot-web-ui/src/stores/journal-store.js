import { observable, action, computed } from 'mobx';
import { localize } from '@deriv/translations';
import { formatDate } from '@deriv/shared/utils/date';
import { observer, message_types } from '@deriv/bot-skeleton';

import { config } from '@deriv/bot-skeleton/src/constants/config';
import { storeSetting, getSetting } from '../utils/settings';
import { messageWithButton } from '../components/notify-item.jsx';

export default class JournalStore {
    constructor(root_store) {
        this.root_store = root_store;
        this.dbot = this.root_store.dbot;
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
    onLogSuccess(message) {
        const message_string = typeof message === 'object' ? message.message : message;
        this.pushMessage(message_string, message_types.SUCCESS);
    }

    @action.bound
    onError(message) {
        this.pushMessage(message, message_types.ERROR);
    }

    @action.bound
    onNotify(data) {
        const { message, className, sound, block_id, variable_name } = data;
        let message_string = message;

        if (message === undefined) {
            observer.emit('ui.log.notify', {
                className: 'journal__text--danger',
                block_id,
                sound: 'silent',
                message: messageWithButton(
                    block_id,
                    localize(`Please set a value for variable <${variable_name}>.`),
                    () => {
                        this.dbot.centerAndHighlightBlock(block_id, true);
                    }
                ),
            });
            return;
        }

        if (typeof message === 'boolean') {
            message_string = message.toString();
        }
        this.pushMessage(message_string, message_types.NOTIFY, className);

        if (sound !== config.lists.NOTIFICATION_SOUND[0][1]) {
            const audio = document.getElementById(sound);
            audio.play();
        }
    }

    @action.bound
    pushMessage(message, message_type, className) {
        const date = formatDate(this.getServerTime());
        const time = formatDate(this.getServerTime(), 'HH:mm:ss [GMT]');
        const unique_id = Blockly.utils.genUid();

        this.unfiltered_messages.unshift({ date, time, message, message_type, className, unique_id });
    }

    @computed
    get filtered_messages() {
        // filter messages based on filtered-checkbox
        return this.unfiltered_messages.filter(
            message =>
                !this.checked_filters.length ||
                this.checked_filters.some(filter => message.message_type === filter) ||
                message.message_type === message_types.COMPONENT
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
