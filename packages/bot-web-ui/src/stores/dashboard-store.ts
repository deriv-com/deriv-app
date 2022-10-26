import { observable, action, reaction } from 'mobx';
import RootStore from './root-store';

const clearInjectionDiv = () => {
    const el_ref = document.getElementById('load-strategy__blockly-container');
    if (el_ref?.getElementsByClassName('injectionDiv').length > 1) {
        el_ref.removeChild(el_ref.getElementsByClassName('injectionDiv')[0]);
    }
};
export interface IDashboardStore {
    active_tab: number;
    faq_search_value: string | null;
    dialog_options: { [key: string]: string };
    is_dialog_open: boolean;
    onboard_tour_run_state: boolean;
    is_info_panel_visible: boolean;
    is_preview_on_popup: boolean;
    onCloseDialog: () => void;
    setActiveTab: (active_tab: number) => void;
    setActiveTabTutorial: (active_tab_tutorials: number) => void;
    setFAQSearchValue: (faq_search_value: string) => void;
    showVideoDialog: (url: string) => void;
    setInfoPanelVisibility: (visibility: boolean) => void;
    setOnBoardTourRunState: (onboard_tour_run_state: boolean) => void;
}

export default class DashboardStore implements IDashboardStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        this.root_store = root_store;
        reaction(
            () => this.is_preview_on_popup,
            async is_preview_on_popup => {
                if (is_preview_on_popup === true) {
                    this.setPreviewOnPopup(false);
                }
            }
        );
    }

    @observable active_tab = 0;
    @observable active_tab_tutorials = 0;
    @observable faq_search_value = null || '';
    @observable dialog_options = {};
    @observable is_dialog_open = false;
    @observable getFileArray = [];
    @observable has_file_loaded = false;
    @observable is_info_panel_visible = true;
    @observable has_tour_started = false;
    @observable is_tour_dialog_visible = true;
    @observable onboard_tour_run_state = false;
    @observable is_preview_on_popup = false;

    @action.bound
    setPreviewOnPopup = (is_preview_on_popup: boolean): void => {
        this.is_preview_on_popup = is_preview_on_popup;
    };

    @action.bound
    setOnBoardTourRunState = (onboard_tour_run_state: boolean): void => {
        this.onboard_tour_run_state = onboard_tour_run_state;
    };

    @action.bound
    setTourDialogVisibility = (is_tour_dialog_visible: boolean): void => {
        this.is_tour_dialog_visible = is_tour_dialog_visible;
    };

    @action.bound
    setTourActive = (has_tour_started: boolean): void => {
        this.has_tour_started = has_tour_started;
    };

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
    setActiveTabTutorial(active_tab_tutorials: number): void {
        this.active_tab_tutorials = active_tab_tutorials;
    }
    @action.bound
    setFAQSearchValue(faq_search_value: string): void {
        this.faq_search_value = faq_search_value;
    }

    @action.bound
    showVideoDialog(url: string) {
        if (url) {
            this.dialog_options = {
                url,
            };
            this.is_dialog_open = true;
        } else {
            this.is_dialog_open = false;
        }
    }

    @action.bound
    setInfoPanelVisibility(is_info_panel_visible: boolean) {
        this.is_info_panel_visible = is_info_panel_visible;
    }
}
