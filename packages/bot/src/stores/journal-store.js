import {
    observable,
    action,
    reaction }        from 'mobx';
import { formatDate } from 'deriv-shared/utils/date';
import { observer }   from '../utils/observer';
import { translate } from '../utils/tools';

export default class JournalStore {
    constructor(root_store) {
        this.root_store = root_store;

        observer.register('ui.log.success', this.onLogSuccess);
        observer.register('ui.log.error', this.onLogError);
        observer.register('Error', this.onLogError);
        observer.register('Notify', this.onNotify);

        this.registerNotificationListener();
        this.registerOnAccountSwitch();
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
    clear (){
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
    registerNotificationListener() {
        const { ui } = this.root_store.core;

        this.disposeNotificationListener = reaction(
            () => ui.notification_messages,
            (notification_messages) => {
                if (!notification_messages.length) {
                    return;
                }

                const string_messages = notification_messages.filter(m => typeof m.message === 'string');

                if (string_messages.length) {
                    const { run_panel } = this.root_store;

                    if (!run_panel.is_drawer_open) {
                        run_panel.toggleDrawer(true);
                    }

                    run_panel.setActiveTabIndex(2);

                    string_messages.forEach(string_message => {
                        // TODO: Proper handling of specific notification types. Trader
                        // sometimes passes components as a message. Handle these.
                        this.onNotify(string_message);
                    });
                }

                if (ui.notification_messages.length > 0) {
                    ui.removeAllNotifications();
                }
            }
        );
    }

    @action.bound
    registerOnAccountSwitch() {
        const { client } = this.root_store.core;

        this.switchAccountDisposer = reaction(
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

        // TODO: Dispose of these listeners.
        // if (typeof this.disposeNotificationListener === 'function') {
        //     this.disposeNotificationListener();
        // }
        // if (typeof this.switchAccountDisposer === 'function') {
        //     this.switchAccountDisposer();
        // }
        
    }
}
