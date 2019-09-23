
import { observable, action } from 'mobx';
import { observer } from '../utils/observer';

export default class JournalStore {
    constructor(rootstore) {
        this.rootstore = rootstore;

        observer.register('ui.log.success', this.onLogSuccess);
        observer.register('ui.log.error', this.onLogError);
        observer.register('Error', this.onLogError);
        observer.register('Notify', this.onNotify);
    }

    @observable messages = [];

    @action.bound
    onLogSuccess() {
        if (this.rootstore.runPanel.is_running) {
            // console.log(data); // eslint-disable-line no-console
        }
    }

    @action.bound
    onLogError() {
        if (this.rootstore.runPanel.is_running) {
            // console.log(data); // eslint-disable-line no-console
        }
    }

    @action.bound
    onError() {
        if (this.rootstore.runPanel.is_running) {
            // console.log(data); // eslint-disable-line no-console
        }
    }

    @action.bound
    onNotify() {
        if (this.rootstore.runPanel.is_running) {
            // console.log(data); // eslint-disable-line no-console
        }
    }
}
