import {
    observable,
    action,
    reaction }        from 'mobx';
import { formatDate } from 'deriv-shared/utils/date';
import { observer }   from '../utils/observer';
import { translate }  from '../utils/tools';

export default class JournalStore {
    constructor(root_store) {
        this.root_store = root_store;

        observer.register('ui.log.success', this.onLogSuccess);
        observer.register('ui.log.error', this.onLogError);
        observer.register('Error', this.onLogError);
        observer.register('Notify', this.onNotify);

        this.registerReactions();
    }

    get serverTime () {
        return this.root_store.core.common.server_time;
    }

    @observable messages = [];

    @action.bound
    onLogSuccess(data) {
        this.pushMessage(data);
    }

    @action.bound
    onLogError(data) {
        this.pushMessage(data);
    }

    @action.bound
    onError(data) {
        this.pushMessage(data);
    }

    @action.bound
    onNotify(data) {
        this.pushMessage(data);
    }

    @action.bound
    clear() {
        this.messages = this.messages.slice(0, 0);  // force array update
    }
    
    pushMessage(data) {
        const date = formatDate(this.serverTime.get());
        const time = formatDate(this.serverTime.get(), 'HH:mm:ss [GMT]');
        let message;
        if (typeof data === 'string') {
            message = `${data}`;
        } else {
            message = `${data.message}`;
        }
        this.messages.unshift({ date, time , message });
        this.messages = this.messages.slice(0);  // force array update
    }

    @action.bound
    registerReactions() {
        const { client } = this.root_store.core;

        this.disposeLogoutListener = reaction(
            () => client.loginid,
            (loginid) => {
                if (!loginid) {
                    this.clear();
                }
            },
        );
        this.disposeSwitchAccountListener = reaction(
            () => client.switch_broadcast,
            action((switch_broadcast) => {
                if (switch_broadcast) {
                    this.clear();
                    this.pushMessage(translate('You have switched accounts.'));
                }
            })
        );
    }

    @action.bound
    onUnmount() {
        observer.unregister('ui.log.success', this.onLogSuccess);
        observer.unregister('ui.log.error', this.onLogError);
        observer.unregister('Error', this.onLogError);
        observer.unregister('Notify', this.onNotify);

        if (typeof this.disposeLogoutListener === 'function') {
            this.disposeLogoutListener();
        }
        if (typeof this.disposeSwitchAccountListener === 'function') {
            this.disposeSwitchAccountListener();
        }
    }
}
