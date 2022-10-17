import { observable, action } from 'mobx';
import RootStore from './root-store';
import { removeExistingWorkspace } from '@deriv/bot-skeleton';

const clearInjectionDiv = () => {
    const el_ref = document.getElementById('load-strategy__blockly-container');
    if (el_ref?.getElementsByClassName('injectionDiv').length > 1) {
        el_ref.removeChild(el_ref.getElementsByClassName('injectionDiv')[0]);
    }
};
export interface IDashboardStore {
    active_tab: number;
    active_tab_tutotials: number;
    faq_search_value: string | null;
    dialog_options: { [key: string]: string };
    is_dialog_open: boolean;
    is_info_panel_visible: boolean;
    onCloseDialog: () => void;
    setActiveTab: (active_tab: number) => void;
    setActiveTabTutorial: (active_tab_tutorials: number) => void;
    setFAQSearchValue: (faq_search_value: string) => void;
    showVideoDialog: (param: { [key: string]: string | React.ReactNode }) => void;
    setInfoPanelVisibility: (visibility: boolean) => void;
}

export default class DashboardStore implements IDashboardStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        this.root_store = root_store;
    }

    @observable active_tab = 0;
    @observable active_tab_tutorials = 0;
    @observable faq_search_value = null || '';
    @observable dialog_options = {};
    @observable is_dialog_open = false;
    @observable getFileArray = [];
    @observable has_file_loaded = false;
    @observable is_info_panel_visible = true;

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
    setActiveTab = (active_tab: number): void => {
        this.active_tab = active_tab;
    };

    @action.bound
    showVideoDialog(param: { [key: string]: string | React.ReactNode }): void {
        const { type, component, url } = param;
        if (type === 'DBotVideo') {
            this.dialog_options = {
                message: component,
            };
            this.is_dialog_open = true;
        } else {
            this.dialog_options = {
                message: component,
            };
            this.is_dialog_open = true;
        }
    }

    @action.bound
    setActiveTabTutorial(active_tab_tutorials: number): void {
        this.active_tab_tutorials = active_tab_tutorials;
    }
    @action.bound
    setFAQSearchValue(faq_search_value: string): void {
        this.faq_search_value = faq_search_value;
    }

    @action.bound
    setInfoPanelVisibility(is_info_panel_visible: boolean) {
        this.is_info_panel_visible = is_info_panel_visible;
    }
}
