import { observable, action, reaction, makeObservable } from 'mobx';
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
    has_onboard_tour_started: boolean;
    has_bot_builder_tour_started: boolean;
    is_dialog_open: boolean;
    is_info_panel_visible: boolean;
    is_preview_on_popup: boolean;
    is_tour_ended: boolean;
    has_builder_token: string | number;
    has_onboarding_token: string | number;
    strategy_save_type: string;
    onCloseDialog: () => void;
    showVideoDialog: (param: { [key: string]: string }) => void;
    setActiveTab: (active_tab: number) => void;
    setActiveTabTutorial: (active_tab_tutorials: number) => void;
    setFAQSearchValue: (faq_search_value: string) => void;
    setInfoPanelVisibility: (visibility: boolean) => void;
    setOnBoardTourRunState: (has_onboard_tour_started: boolean) => void;
}

export default class DashboardStore implements IDashboardStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            active_tab: observable,
            active_tab_tutorials: observable,
            faq_search_value: observable,
            dialog_options: observable,
            is_dialog_open: observable,
            getFileArray: observable,
            has_file_loaded: observable,
            is_info_panel_visible: observable,
            is_tour_ended: observable,
            strategy_save_type: observable,
            has_tour_started: observable,
            is_tour_dialog_visible: observable,
            has_onboard_tour_started: observable,
            is_preview_on_popup: observable,
            has_bot_builder_tour_started: observable,
            has_builder_token: observable,
            has_onboarding_token: observable,
            setBotBuilderTourState: action.bound,
            setPreviewOnPopup: action.bound,
            setOnBoardTourRunState: action.bound,
            setTourDialogVisibility: action.bound,
            setTourActive: action.bound,
            setFileLoaded: action.bound,
            onCloseDialog: action.bound,
            setActiveTab: action.bound,
            setActiveTabTutorial: action.bound,
            setFAQSearchValue: action.bound,
            showVideoDialog: action.bound,
            setInfoPanelVisibility: action.bound,
            setBotBuilderTokenCheck: action.bound,
            setOnBoardingTokenCheck: action.bound,
        });
        this.root_store = root_store;
        reaction(
            () => this.is_preview_on_popup,
            async is_preview_on_popup => {
                if (is_preview_on_popup) {
                    this.setPreviewOnPopup(false);
                }
            }
        );
    }

    active_tab = 0;
    active_tab_tutorials = 0;
    faq_search_value = null || '';
    dialog_options = {};
    is_dialog_open = false;
    getFileArray = [];
    has_file_loaded = false;
    is_info_panel_visible = true;
    has_tour_started = false;
    is_tour_dialog_visible = false;
    has_onboard_tour_started = false;
    is_preview_on_popup = false;
    has_bot_builder_tour_started = false;
    is_tour_ended = false;
    has_builder_token = '';
    has_onboarding_token = '';
    strategy_save_type = 'unsaved';

    setStrategySaveType = (strategy_save_type: string) => {
        this.strategy_save_type = strategy_save_type;
    };

    setIsTourEnded = (is_tour_ended: boolean): void => {
        this.is_tour_ended = is_tour_ended;
    };

    setBotBuilderTokenCheck = (has_builder_token: string | number): void => {
        this.has_builder_token = has_builder_token;
    };

    setOnBoardingTokenCheck = (has_onboarding_token: string | number): void => {
        this.has_onboarding_token = has_onboarding_token;
    };

    setBotBuilderTourState = (has_bot_builder_tour_started: boolean): void => {
        this.has_bot_builder_tour_started = has_bot_builder_tour_started;
    };

    setPreviewOnPopup = (is_preview_on_popup: boolean): void => {
        this.is_preview_on_popup = is_preview_on_popup;
    };

    setOnBoardTourRunState = (has_onboard_tour_started: boolean): void => {
        this.has_onboard_tour_started = has_onboard_tour_started;
    };

    setTourDialogVisibility = (is_tour_dialog_visible: boolean): void => {
        this.is_tour_dialog_visible = is_tour_dialog_visible;
    };

    setTourActive = (has_tour_started: boolean): void => {
        this.has_tour_started = has_tour_started;
    };

    setFileLoaded = (has_file_loaded: boolean): void => {
        this.has_file_loaded = has_file_loaded;
        clearInjectionDiv();
    };

    onCloseDialog = (): void => {
        this.is_dialog_open = false;
    };

    setActiveTab = (active_tab: number): void => {
        this.active_tab = active_tab;
        if (active_tab === 1) {
            const {
                load_modal: { previewRecentStrategy, selected_strategy_id },
            } = this.root_store;
            previewRecentStrategy(selected_strategy_id);
        }
    };

    setActiveTabTutorial = (active_tab_tutorials: number): void => {
        this.active_tab_tutorials = active_tab_tutorials;
    };

    setFAQSearchValue = (faq_search_value: string): void => {
        this.faq_search_value = faq_search_value;
    };

    showVideoDialog = (param: { [key: string]: string }): void => {
        const { url, type } = param;
        const dialog_type = ['google', 'url'];
        if (dialog_type.includes(type)) {
            if (type === 'url') {
                this.dialog_options = {
                    url,
                };
            }
            this.is_dialog_open = true;
        } else {
            this.is_dialog_open = false;
        }
    };

    setInfoPanelVisibility = (is_info_panel_visible: boolean) => {
        this.is_info_panel_visible = is_info_panel_visible;
    };
}
