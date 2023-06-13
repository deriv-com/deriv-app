import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { blocksCoordinate, setColors } from '@deriv/bot-skeleton';
import { isMobile } from '@deriv/shared';
import { clearInjectionDiv } from 'Constants/load-modal';
import { setTourSettings, tour_type, TTourType } from '../components/dashboard/joyride-config';
import RootStore from './root-store';

export interface IDashboardStore {
    active_tab: number;
    dialog_options: { [key: string]: string };
    faq_search_value: string | null;
    has_builder_token: string | number;
    has_mobile_preview_loaded: boolean;
    has_onboarding_token: string | number;
    has_started_bot_builder_tour: boolean;
    has_started_onboarding_tour: boolean;
    has_tour_ended: boolean;
    initInfoPanel: () => void;
    is_dialog_open: boolean;
    is_file_supported: boolean;
    is_info_panel_visible: boolean;
    is_preview_on_popup: boolean;
    onCloseDialog: () => void;
    onCloseTour: (param: Partial<string>) => void;
    onTourEnd: (step: number, has_started_onboarding_tour: boolean) => void;
    setActiveTab: (active_tab: number) => void;
    setActiveTabTutorial: (active_tab_tutorials: number) => void;
    setFAQSearchValue: (faq_search_value: string) => void;
    setHasTourEnded: (has_tour_ended: boolean) => void;
    setInfoPanelVisibility: (visibility: boolean) => void;
    setIsFileSupported: (is_file_supported: boolean) => void;
    setOnBoardTourRunState: (has_started_onboarding_tour: boolean) => void;
    setOpenSettings: (toast_message: string, show_toast: boolean) => void;
    setPreviewOnDialog: (has_mobile_preview_loaded: boolean) => void;
    show_toast: boolean;
    showVideoDialog: (param: { [key: string]: string }) => void;
    strategy_save_type: string;
    toast_message: string;
}

export default class DashboardStore implements IDashboardStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            active_tab_tutorials: observable,
            active_tab: observable,
            dialog_options: observable,
            faq_search_value: observable,
            getFileArray: observable,
            has_builder_token: observable,
            has_file_loaded: observable,
            has_mobile_preview_loaded: observable,
            has_onboarding_token: observable,
            has_started_bot_builder_tour: observable,
            has_started_onboarding_tour: observable,
            has_tour_ended: observable,
            has_tour_started: observable,
            initInfoPanel: action.bound,
            is_dialog_open: observable,
            is_file_supported: observable,
            is_info_panel_visible: observable,
            is_preview_on_popup: observable,
            is_tour_dialog_visible: observable,
            is_dark_mode: computed,
            onCloseDialog: action.bound,
            onCloseTour: action.bound,
            onTourEnd: action.bound,
            setActiveTab: action.bound,
            setActiveTabTutorial: action.bound,
            setBotBuilderTokenCheck: action.bound,
            setBotBuilderTourState: action.bound,
            setFAQSearchValue: action.bound,
            setFileLoaded: action.bound,
            setHasTourEnded: action.bound,
            setInfoPanelVisibility: action.bound,
            setIsFileSupported: action.bound,
            setOnBoardingTokenCheck: action.bound,
            setOnBoardTourRunState: action.bound,
            setPreviewOnDialog: action.bound,
            setPreviewOnPopup: action.bound,
            setTourActive: action.bound,
            setTourDialogVisibility: action.bound,
            setOpenSettings: action.bound,
            show_toast: observable,
            showVideoDialog: action.bound,
            strategy_save_type: observable,
            toggleOnConfirm: action.bound,
            toast_message: observable,
            setStrategySaveType: action.bound,
        });
        this.root_store = root_store;
        const {
            load_modal: { previewRecentStrategy, current_workspace_id },
        } = this.root_store;

        const refreshBotBuilderTheme = () => {
            Blockly.derivWorkspace.asyncClear();
            Blockly.Xml.domToWorkspace(
                Blockly.Xml.textToDom(Blockly.derivWorkspace.strategy_to_load),
                Blockly.derivWorkspace
            );
        };

        reaction(
            () => this.is_dark_mode,
            () => {
                setColors(this.is_dark_mode);
                if (this.active_tab === 1) {
                    refreshBotBuilderTheme();
                } else {
                    refreshBotBuilderTheme();
                    previewRecentStrategy(current_workspace_id);
                }
            }
        );
        reaction(
            () => this.is_preview_on_popup,
            async is_preview_on_popup => {
                if (is_preview_on_popup) {
                    this.setPreviewOnPopup(false);
                }
            }
        );
        this.initInfoPanel();
    }

    active_tab = 0;
    active_tab_tutorials = 0;
    active_tour_step_number = 0;
    dialog_options = {};
    faq_search_value = null || '';
    getFileArray = [];
    has_builder_token = '';
    has_file_loaded = false;
    has_mobile_preview_loaded = false;
    has_onboarding_token = '';
    has_started_bot_builder_tour = false;
    has_started_onboarding_tour = false;
    has_tour_ended = false;
    has_tour_started = false;
    is_dialog_open = false;
    is_file_supported = false;
    is_info_panel_visible = false;
    is_preview_on_popup = false;
    is_tour_dialog_visible = false;
    show_toast = false;
    strategy_save_type = 'unsaved';
    toast_message = '';

    get is_dark_mode() {
        const {
            app: {
                core: {
                    ui: { is_dark_mode_on },
                },
            },
        } = this.root_store;
        return is_dark_mode_on;
    }

    setOpenSettings = (toast_message: string, show_toast = true) => {
        this.toast_message = toast_message;
        this.show_toast = show_toast;
    };

    setIsFileSupported = (is_file_supported: boolean) => {
        this.is_file_supported = is_file_supported;
    };

    initInfoPanel() {
        if (!localStorage.getItem('dbot_should_show_info')) this.is_info_panel_visible = true;
    }

    setTourActiveStep = (active_tour_step_number: number) => {
        this.active_tour_step_number = active_tour_step_number;
    };

    setPreviewOnDialog = (has_mobile_preview_loaded: boolean) => {
        this.has_mobile_preview_loaded = has_mobile_preview_loaded;
        const {
            load_modal: { onLoadModalClose },
        } = this.root_store;
        onLoadModalClose();
    };

    setStrategySaveType = (strategy_save_type: string) => {
        this.strategy_save_type = strategy_save_type;
    };

    setHasTourEnded = (has_tour_ended: boolean): void => {
        this.has_tour_ended = has_tour_ended;
    };

    setBotBuilderTokenCheck = (has_builder_token: string | number): void => {
        this.has_builder_token = has_builder_token;
    };

    setOnBoardingTokenCheck = (has_onboarding_token: string | number): void => {
        this.has_onboarding_token = has_onboarding_token;
    };

    setBotBuilderTourState = (has_started_bot_builder_tour: boolean): void => {
        this.has_started_bot_builder_tour = has_started_bot_builder_tour;
    };

    setPreviewOnPopup = (is_preview_on_popup: boolean): void => {
        this.is_preview_on_popup = is_preview_on_popup;
    };

    setOnBoardTourRunState = (has_started_onboarding_tour: boolean): void => {
        this.has_started_onboarding_tour = has_started_onboarding_tour;
    };

    setTourDialogVisibility = (is_tour_dialog_visible: boolean): void => {
        this.is_tour_dialog_visible = is_tour_dialog_visible;
    };

    setTourActive = (has_tour_started: boolean): void => {
        this.has_tour_started = has_tour_started;
    };

    setFileLoaded = (has_file_loaded: boolean): void => {
        this.has_file_loaded = has_file_loaded;
        clearInjectionDiv('store', document.getElementById('load-strategy__blockly-container'));
    };

    onCloseDialog = (): void => {
        this.is_dialog_open = false;
    };

    setActiveTab = (active_tab: number): void => {
        this.active_tab = active_tab;
        if (this.has_started_bot_builder_tour) {
            this.setTourActive(false);
            this.setBotBuilderTourState(false);
        }
        if (this.active_tab === 1) {
            blocksCoordinate();
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

    setInfoPanelVisibility = (is_info_panel_visible: boolean): void => {
        this.is_info_panel_visible = is_info_panel_visible;
    };

    onZoomInOutClick = (is_zoom_in: boolean): void => {
        const workspace = Blockly.mainWorkspace;
        const metrics = workspace.getMetrics();
        const addition = is_zoom_in ? 1 : -1;

        workspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    };

    toggleOnConfirm = (active_tab: number, value: boolean): void => {
        if (active_tab === 0) {
            this.setTourActive(value);
            this.setOnBoardTourRunState(value);
        } else {
            this.setBotBuilderTourState(value);
        }
        this.setHasTourEnded(value);
    };

    onCloseTour = (): void => {
        this.setOnBoardTourRunState(false);
        this.setBotBuilderTourState(false);
        setTourSettings(new Date().getTime(), `${tour_type.key}_token`);
        this.setTourActive(false);
    };
    setTourEnd = (param: TTourType): void => {
        const { key } = param;
        this.setHasTourEnded(true);
        if (!isMobile()) this.setTourDialogVisibility(true);
        this.setTourActive(false);
        setTourSettings(new Date().getTime(), `${key}_token`);
    };

    onTourEnd = (step: number, has_started_onboarding_tour: boolean): void => {
        if (step === 7) {
            this.onCloseTour();
            this.setTourEnd(tour_type);
            this.setTourDialogVisibility(true);
        }
        if (!has_started_onboarding_tour && step === 3) {
            this.onCloseTour();
            this.setTourEnd(tour_type);
        }
    };
}
