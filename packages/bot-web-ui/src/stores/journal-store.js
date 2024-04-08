import { action, computed, makeObservable, observable, reaction, when } from 'mobx';

import { log_types, message_types } from '@deriv/bot-skeleton';
import { config } from '@deriv/bot-skeleton/src/constants/config';
import { formatDate } from '@deriv/shared';
import { localize } from '@deriv/translations';

import { isCustomJournalMessage } from '../utils/journal-notifications';
import { getStoredItemsByKey, getStoredItemsByUser, setStoredItemsByKey } from '../utils/session-storage';
import { getSetting, storeSetting } from '../utils/settings';

export default class JournalStore {
    constructor(root_store, core) {
        makeObservable(this, {
            is_filter_dialog_visible: observable,
            journal_filters: observable.shallow,
            filters: observable.shallow,
            unfiltered_messages: observable.shallow,
            toggleFilterDialog: action.bound,
            onLogSuccess: action.bound,
            onError: action.bound,
            onNotify: action.bound,
            pushMessage: action.bound,
            filtered_messages: computed,
            getServerTime: action.bound,
            playAudio: action.bound,
            checked_filters: computed,
            filterMessage: action.bound,
            clear: action.bound,
            welcomeBackUser: action.bound,
            welcomeUser: action.bound,
            registerReactions: action.bound,
            restoreStoredJournals: action.bound,
        });

        this.root_store = root_store;
        this.core = core;
        this.disposeReactionsFn = this.registerReactions();
        this.restoreStoredJournals();
    }

    JOURNAL_CACHE = 'journal_cache';

    is_filter_dialog_visible = false;

    filters = [
        { id: message_types.ERROR, label: localize('Errors') },
        { id: message_types.NOTIFY, label: localize('Notifications') },
        { id: message_types.SUCCESS, label: localize('System') },
    ];
    journal_filters = [];
    unfiltered_messages = [];

    restoreStoredJournals() {
        const { loginid } = this.core?.client;
        this.journal_filters = getSetting('journal_filter') || this.filters.map(filter => filter.id);
        this.unfiltered_messages = getStoredItemsByUser(this.JOURNAL_CACHE, loginid, []);
    }

    getServerTime() {
        return this.core?.common.server_time.get();
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
        const { client } = this.core;
        const { loginid, account_list } = client;

        if (loginid) {
            const current_account = account_list?.find(account => account?.loginid === loginid);
            extra.current_currency = current_account?.is_virtual ? 'Demo' : current_account?.title;
        } else if (message === log_types.WELCOME) {
            return;
        }

        const date = formatDate(this.getServerTime());
        const time = formatDate(this.getServerTime(), 'HH:mm:ss [GMT]');
        const unique_id = Blockly.utils.idGenerator.genUid();

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

    welcomeUser() {
        this.pushMessage(log_types.WELCOME, message_types.SUCCESS, 'journal__text');
    }

    registerReactions() {
        const { client } = this.core;

        // Write journal messages to session storage on each change in unfiltered messages.
        const disposeWriteJournalMessageListener = reaction(
            () => this.unfiltered_messages,
            unfiltered_messages => {
                const stored_journals = getStoredItemsByKey(this.JOURNAL_CACHE, {});
                stored_journals[client.loginid] = unfiltered_messages.slice(0, 5000);

                setStoredItemsByKey(this.JOURNAL_CACHE, stored_journals);
            }
        );

        // Attempt to load cached journal messages on client loginid change.
        const disposeJournalMessageListener = reaction(
            () => client?.loginid,
            async loginid => {
                await when(() => client.account_list?.find(account => account.loginid === loginid)?.title ?? false);
                this.unfiltered_messages = getStoredItemsByUser(this.JOURNAL_CACHE, loginid, []);
                if (this.unfiltered_messages.length === 0) {
                    this.welcomeUser();
                } else if (this.unfiltered_messages.length > 0) {
                    this.welcomeBackUser();
                }
            },
            { fireImmediately: true } // For initial welcome message
        );

        return () => {
            disposeWriteJournalMessageListener();
            disposeJournalMessageListener();
        };
    }
}
