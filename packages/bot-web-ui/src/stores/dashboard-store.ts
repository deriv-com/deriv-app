import { observable, action } from 'mobx';
import RootStore from './root-store';
import { removeExistingWorkspace } from '@deriv/bot-skeleton';

const clearInjectionDiv = () => {
    const element = document.getElementById('load-strategy__blockly-container');
    if (element?.getElementsByClassName('injectionDiv').length > 1) {
        element.removeChild(element.getElementsByClassName('injectionDiv')[0]);
    }
};

export default class DashboardStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        this.root_store = root_store;
    }

    @observable active_tab = 0;
    @observable active_tab_tutotials = 0;
    @observable faq_search_value = null;
    @observable dialog_options = {};
    @observable is_dialog_open = false;
    @observable getFileArray = [];
    @observable has_file_loaded = false;

    @action.bound
    setFileLoaded = (has_file_loaded: boolean): void => {
        this.has_file_loaded = has_file_loaded;
        clearInjectionDiv();
    };

    @action.bound
    onCloseDialog = (): void => {
        this.is_dialog_open = false;
    };

    @action.bound
    setActiveTab = (active_tab: string): void => {
        this.active_tab = active_tab;
    };

    @action.bound
    showVideoDialog = (url, type, component): void => {
        if (type === 'google') {
            this.dialog_options = {
                message: component,
            };
            return (this.is_dialog_open = true);
        }
        return (this.is_dialog_open = false);
    };
}
