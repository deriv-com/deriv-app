import { observable, action, computed, reaction, when, makeObservable } from 'mobx';
import { localize } from '@deriv/translations';
import { formatDate } from '@deriv/shared';
import { log_types, message_types } from '@deriv/bot-skeleton';
import { config } from '@deriv/bot-skeleton/src/constants/config';
import { storeSetting, getSetting } from '../utils/settings';
import { isCustomJournalMessage } from '../utils/journal-notifications';
import { getStoredItemsByKey, getStoredItemsByUser, setStoredItemsByKey } from '../utils/session-storage';

export default class JournalStore {
    constructor(root_store) {
        makeObservable(this, {
            is_filter_dialog_visible: observable,
            journal_filters: observable.shallow,
            unfiltered_messages: observable.shallow,
            toggleFilterDialog: action.bound,
            onLogSuccess: action.bound,
            onError: action.bound,
            onNotify: action.bound,
            pushMessage: action.bound,
            filtered_messages: computed,
            checked_filters: computed,
            filterMessage: action.bound,
            clear: action.bound,
        });

        this.root_store = root_store;
        this.disposeReactionsFn = this.registerReactions();

        // Add a "Welcome back!" message when messages were restored.
        when(
            () => this.unfiltered_messages,
            () => {
                if (this.unfiltered_messages.length > 0) {
                    this.welcomeBackUser();
                }
            }
        );
    }

    JOURNAL_CACHE = 'journal_cache';

    is_filter_dialog_visible = false;

    filters = [
        { id: message_types.ERROR, label: localize('Errors') },
        { id: message_types.NOTIFY, label: localize('Notifications') },
        { id: message_types.SUCCESS, label: localize('System') },
    ];

    journal_filters = getSetting('journal_filter') || this.filters.map(filter => filter.id);
    unfiltered_messages = getStoredItemsByUser(this.JOURNAL_CACHE, this.root_store?.core.client.loginid, []);

    getServerTime() {
        return this.root_store?.core.common.server_time.get();
    }

    playAudio = sound => {
        if (sound !== config.lists.NOTIFICATION_SOUND[0][1]) {
            const audio = document.getElementById(sound);
            audio.play();
        }
    };

    toggleFilterDialog() {
        this.is_filter_dialog_visible = !this.is_filter_dialog_visible;
    }

    onLogSuccess(message) {
        const { log_type, extra } = message;
        this.pushMessage(log_type, message_types.SUCCESS, '', extra);
    }

    onError(message) {
        this.pushMessage(message, message_types.ERROR);
    }

    onNotify(data) {
        const { run_panel, dbot } = this.root_store;
        const { message, className, message_type, sound, block_id, variable_name } = data;

        if (
            isCustomJournalMessage(
                { message, block_id, variable_name },
                run_panel.showErrorMessage,
                () => dbot.centerAndHighlightBlock(block_id, true),
                parsed_message => this.pushMessage(parsed_message, message_type || message_types.NOTIFY, className)
            )
        ) {
            this.playAudio(sound);
            return;
        }
        this.pushMessage(message, message_type || message_types.NOTIFY, className);
        this.playAudio(sound);
    }

    pushMessage(message, message_type, className, extra = {}) {
        const date = formatDate(this.getServerTime());
        const time = formatDate(this.getServerTime(), 'HH:mm:ss [GMT]');
        const unique_id = Blockly.utils.genUid();

        this.unfiltered_messages.unshift({ date, time, message, message_type, className, unique_id, extra });
        this.unfiltered_messages = this.unfiltered_messages.slice(); // force array update
    }

    get filtered_messages() {
        return (
            this.unfiltered_messages
                // filter messages based on filtered-checkbox
                .filter(
                    message =>
                        this.journal_filters.length &&
                        this.journal_filters.some(filter => message.message_type === filter)
                )
        );
    }

    get checked_filters() {
        return this.journal_filters.filter(filter => filter != null);
    }

    filterMessage(checked, item_id) {
        if (checked) {
            this.journal_filters.push(item_id);
        } else {
            this.journal_filters.splice(this.journal_filters.indexOf(item_id), 1);
        }

        storeSetting('journal_filter', this.journal_filters);
    }

    clear() {
        this.unfiltered_messages = this.unfiltered_messages.slice(0, 0);
    }

    welcomeBackUser() {
        this.pushMessage(log_types.WELCOME_BACK, message_types.SUCCESS, 'journal__text');
    }

    registerReactions() {
        const { client } = this.root_store?.core;

        // Write journal messages to session storage on each change in unfiltered messages.
        const disposeWriteJournalMessageListener = reaction(
            () => this.unfiltered_messages,
            unfiltered_messages => {
                const stored_journals = getStoredItemsByKey(this.JOURNAL_CACHE, {});

                stored_journals[client.loginid] = unfiltered_messages.slice(0, 5000).filter(unfiltered_message => {
                    // Filter out "Welcome back!" message. This can be extended.
                    const is_welcome_back =
                        unfiltered_message.message_type === message_types.SUCCESS &&
                        unfiltered_message.message === log_types.WELCOME_BACK;

                    return !is_welcome_back;
                });
                setStoredItemsByKey(this.JOURNAL_CACHE, stored_journals);
            }
        );

        // Attempt to load cached journal messages on client loginid change.
        const disposeJournalMessageListener = reaction(
            () => client.loginid,
            () => {
                this.unfiltered_messages = getStoredItemsByUser(this.JOURNAL_CACHE, client.loginid, []);

                if (this.unfiltered_messages.length > 0) {
                    this.welcomeBackUser();
                }
            }
        );

        return () => {
            disposeWriteJournalMessageListener();
            disposeJournalMessageListener();
        };
    }
}
