import { observable, action, computed, reaction, makeObservable } from 'mobx';
import { localize } from '@deriv/translations';
import { load, config, save_types, getSavedWorkspaces, removeExistingWorkspace } from '@deriv/bot-skeleton';
import { tabs_title } from 'Constants/load-modal';
import RootStore from './root-store';
import React from 'react';

const clearInjectionDiv = () => {
    const el_ref = document.getElementById('load-strategy__blockly-container');
    if (el_ref?.getElementsByClassName('injectionDiv').length > 1) {
        el_ref.removeChild(el_ref.getElementsByClassName('injectionDiv')[1]);
    }
};
interface ILoadModalStore {
    active_index: number;
    is_load_modal_open: boolean;
    load_recent_strategies: boolean;
    is_explanation_expand: boolean;
    is_open_button_loading: boolean;
    is_strategy_loaded: boolean;
    loaded_local_file: boolean | null;
    recent_strategies: string[];
    selected_strategy_id: string[] | string | undefined;
    is_strategy_removed: boolean;
    is_delete_modal_open: boolean;
    preview_workspace: () => void;
    handleFileChange: (
        event: React.MouseEvent | React.FormEvent<HTMLFormElement> | DragEvent,
        is_body: boolean
    ) => boolean;
    loadFileFromLocal: () => void;
    onActiveIndexChange: () => void;
    onDriveConnect: () => void;
    onDriveOpen: () => void;
    onEntered: () => void;
    onLoadModalClose: () => void;
    onToggleDeleteDialog: (is_delete_modal_open: boolean) => void;
    onZoomInOutClick: (is_zoom_in: string) => void;
    previewRecentStrategy: (workspace_id: string) => void;
    setActiveTabIndex: (index: number) => void;
    setLoadedLocalFile: (loaded_local_file: boolean | null) => void;
    setRecentStrategies: (recent_strategies: string[]) => void;
    setSelectedStrategyId: (selected_strategy_id: string[] | undefined) => void;
    toggleExplanationExpand: () => void;
    toggleLoadModal: () => void;
    readFile: (is_preview: boolean, drop_event: DragEvent, file: File) => void;
    toggleStrategies: (load_recent_strategies: boolean) => void;
    getRecentFileIcon: (save_type: { [key: string]: string } | string) => string;
    getSaveType: (save_type: { [key: string]: string } | string) => string;
}

export default class LoadModalStore implements ILoadModalStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            active_index: observable,
            is_load_modal_open: observable,
            is_explanation_expand: observable,
            load_recent_strategies: observable,
            is_open_button_loading: observable,
            is_strategy_loaded: observable,
            is_delete_modal_open: observable,
            is_strategy_removed: observable,
            loaded_local_file: observable,
            recent_strategies: observable,
            dashboard_strategies: observable,
            selected_strategy_id: observable,
            preview_workspace: computed,
            selected_strategy: computed,
            tab_name: computed,
            handleFileChange: action.bound,
            loadFileFromRecent: action.bound,
            loadFileFromLocal: action.bound,
            onActiveIndexChange: action.bound,
            onDriveConnect: action.bound,
            onDriveOpen: action.bound,
            onEntered: action.bound,
            onLoadModalClose: action.bound,
            onZoomInOutClick: action.bound,
            previewRecentStrategy: action.bound,
            setActiveTabIndex: action.bound,
            setLoadedLocalFile: action.bound,
            setRecentStrategies: action.bound,
            setSelectedStrategyId: action.bound,
            toggleExplanationExpand: action.bound,
            toggleLoadModal: action.bound,
            readFile: action.bound,
            setDashboardStrategies: action.bound,
        });

        this.root_store = root_store;

        reaction(
            () => this.active_index,
            () => this.onActiveIndexChange()
        );
        reaction(
            () => this.is_load_modal_open,
            async is_load_modal_open => {
                if (is_load_modal_open) {
                    this.setRecentStrategies((await getSavedWorkspaces()) || []);
                } else {
                    this.onLoadModalClose();
                }
            }
        );
        reaction(
            () => this.load_recent_strategies,
            async load_recent_strategies => {
                if (load_recent_strategies) {
                    this.setRecentStrategies((await getSavedWorkspaces()) || []);
                }
            }
        );
    }

    recent_workspace;
    local_workspace;
    drop_zone;

    active_index = 0;
    is_load_modal_open = false;
    load_recent_strategies = false;
    is_explanation_expand = false;
    is_open_button_loading = false;
    loaded_local_file = null;
    recent_strategies = [];
    dashboard_strategies = [];
    selected_strategy_id = undefined;
    is_strategy_loaded = false;
    is_delete_modal_open = false;
    is_strategy_removed = false;

    get preview_workspace() {
        if (this.tab_name === tabs_title.TAB_LOCAL) return this.local_workspace;
        if (this.tab_name === tabs_title.TAB_RECENT) return this.recent_workspace;
        return null;
    }

    get selected_strategy() {
        return (
            this.dashboard_strategies.find(ws => ws.id === this.selected_strategy_id) || this.dashboard_strategies[0]
        );
    }

    get tab_name() {
        if (this.root_store.ui.is_mobile) {
            if (this.active_index === 0) return tabs_title.TAB_LOCAL;
            if (this.active_index === 1) return tabs_title.TAB_GOOGLE;
        }
        if (this.active_index === 0) return tabs_title.TAB_RECENT;
        if (this.active_index === 1) return tabs_title.TAB_LOCAL;
        if (this.active_index === 2) return tabs_title.TAB_GOOGLE;
        return '';
    }

    setDashboardStrategies(strategies: []) {
        this.dashboard_strategies = strategies;
        if (!strategies.length) {
            this.selected_strategy_id = undefined;
        }
    }

    async getDashboardStrategies() {
        const strategies = await getSavedWorkspaces();
        setTimeout(() => {
            strategies.then(recent_strategies => {
                this.dashboard_strategies = recent_strategies;
            });
        }, 1000);
    }

    handleFileChange = (
        event: React.MouseEvent | React.FormEvent<HTMLFormElement> | DragEvent,
        is_body = true
    ): boolean => {
        let files;
        if (event.type === 'drop') {
            event.stopPropagation();
            event.preventDefault();

            ({ files } = event.dataTransfer);
        } else {
            ({ files } = event.target);
        }

        const [file] = files;

        if (!is_body) {
            if (file.name.includes('xml')) {
                this.setLoadedLocalFile(file);
                this.getDashboardStrategies();
            } else {
                return false;
            }
        }
        this.readFile(!is_body, event, file);
        event.target.value = '';
        return true;
    };

    loadFileFromRecent = (): void => {
        this.is_open_button_loading = true;

        if (!this.selected_strategy) {
            this.is_open_button_loading = false;
            return;
        }

        removeExistingWorkspace(this.selected_strategy.id);
        load({
            block_string: this.selected_strategy.xml,
            strategy_id: this.selected_strategy.id,
            file_name: this.selected_strategy.name,
            workspace: Blockly.derivWorkspace,
        });
        this.is_open_button_loading = false;
    };

    loadFileFromLocal = (): void => {
        this.is_open_button_loading = true;
        this.readFile(false, {}, this.loaded_local_file);
        this.is_open_button_loading = false;
    };

    onActiveIndexChange = (): void => {
        if (this.tab_name === tabs_title.TAB_RECENT) {
            if (this.selected_strategy) {
                this.previewRecentStrategy(this.selected_strategy_id);
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.recent_workspace) {
                setTimeout(() => {
                    // Dispose of recent workspace when switching away from Recent tab.
                    // Process in next cycle so user doesn't have to wait.
                    this.recent_workspace.dispose();
                    this.recent_workspace = null;
                });
            }
        }

        if (this.tab_name === tabs_title.TAB_LOCAL) {
            if (!this.drop_zone) {
                this.drop_zone = document.querySelector('load-strategy__local-dropzone-area');

                if (this.drop_zone) {
                    this.drop_zone.addEventListener('drop', event => this.handleFileChange(event, false));
                }
            }
        } else {
            // Dispose of local workspace when switching away from Local tab.
            // eslint-disable-next-line no-lonely-if
            if (this.local_workspace) {
                setTimeout(() => {
                    this.local_workspace.dispose();
                    this.local_workspace = null;
                    this.setLoadedLocalFile(null);
                });
            }
        }

        // Forget about drop zone when not on Local tab.
        if (this.tab_name !== tabs_title.TAB_LOCAL && this.drop_zone) {
            this.drop_zone.removeEventListener('drop', event => this.handleFileChange(event, false));
        }
        if (this.selected_strategy) {
            this.previewRecentStrategy(this.selected_strategy_id);
        }
    };

    onDriveConnect = (): void => {
        const { google_drive } = this.root_store;

        if (google_drive.is_authorised) {
            google_drive.signOut();
        } else {
            google_drive.signIn();
        }
    };

    async onDriveOpen() {
        const { loadFile } = this.root_store.google_drive;
        const { xml_doc, file_name } = await loadFile();
        load({ block_string: xml_doc, file_name, workspace: Blockly.derivWorkspace, from: save_types.GOOGLE_DRIVE });
    }

    onEntered = (): void => {
        this.previewRecentStrategy(this.selected_strategy_id);
        this.onActiveIndexChange();
    };

    onLoadModalClose = (): void => {
        if (this.recent_workspace) {
            this.recent_workspace.dispose();
            this.recent_workspace = null;
        }
        if (this.local_workspace) {
            this.local_workspace.dispose();
            this.local_workspace = null;
        }

        this.setActiveTabIndex(0); // Reset to first tab.
        this.setLoadedLocalFile(null);
    };

    onZoomInOutClick = (is_zoom_in: string): void => {
        if (this.preview_workspace) {
            this.preview_workspace.zoomCenter(is_zoom_in ? 1 : -1);
        }
    };

    previewRecentStrategy = (workspace_id: string): void => {
        this.setSelectedStrategyId(workspace_id);

        if (!this.selected_strategy) {
            return;
        }

        const {
            dashboard: { active_tab },
        } = this.root_store;

        if ((active_tab === 1 || this.tab_name !== tabs_title.TAB_LOCAL) && this.recent_workspace) {
            this.recent_workspace.dispose();
            this.recent_workspace = null;
        }
        if (!this.recent_workspace || !this.recent_workspace.rendered) {
            //TODO: this was the check check used on the older functionality
            const ref = document.getElementById('load-strategy__blockly-container');

            if (!ref) {
                // eslint-disable-next-line no-console
                console.warn('Could not find preview workspace element.');
                return;
            }

            this.recent_workspace = Blockly.inject(ref, {
                media: `${__webpack_public_path__}media/`,
                zoom: {
                    wheel: true,
                    startScale: config.workspaces.previewWorkspaceStartScale,
                },
                readOnly: true,
                scrollbars: true,
            });
        }

        load({ block_string: this.selected_strategy.xml, drop_event: {}, workspace: this.recent_workspace });
        const {
            save_modal: { updateBotName },
        } = this.root_store;
        updateBotName(this.selected_strategy.name);
    };

    setActiveTabIndex = (index: number): void => {
        this.active_index = index;
    };

    setLoadedLocalFile = (loaded_local_file: boolean | null): void => {
        this.loaded_local_file = loaded_local_file;
    };

    setRecentStrategies = (recent_strategies: string[]): void => {
        this.recent_strategies = recent_strategies;
    };

    refreshStratagies = (): void => {
        this.setRecentStrategies(this.recent_strategies);
    };

    setSelectedStrategyId = (selected_strategy_id: string[] | undefined): void => {
        this.selected_strategy_id = selected_strategy_id;
    };

    toggleExplanationExpand = (): void => {
        this.is_explanation_expand = !this.is_explanation_expand;
    };

    toggleLoadModal = (): void => {
        this.is_load_modal_open = !this.is_load_modal_open;
        // this.previewRecentStrategy(this.selected_strategy_id);
    };

    toggleStrategies = (load_recent_strategies: boolean): void => {
        this.load_recent_strategies = load_recent_strategies;
    };

    getRecentFileIcon = (save_type: { [key: string]: string } | string): string => {
        switch (save_type) {
            case save_types.UNSAVED:
                return 'IcReports';
            case save_types.LOCAL:
                return 'IcDesktop';
            case save_types.GOOGLE_DRIVE:
                return 'IcGoogleDrive';
            default:
                return 'IcReports';
        }
    };

    getSaveType = (save_type: { [key: string]: string } | string): string => {
        switch (save_type) {
            case save_types.UNSAVED:
                return localize('Unsaved');
            case save_types.LOCAL:
                return localize('Local');
            case save_types.GOOGLE_DRIVE:
                return localize('Google Drive');
            default:
                return localize('Unsaved');
        }
    };

    onToggleDeleteDialog = (is_delete_modal_open: boolean): void => {
        this.is_delete_modal_open = is_delete_modal_open;
    };

    readFile = (is_preview: boolean, drop_event: DragEvent, file: File): void => {
        const file_name = file && file.name.replace(/\.[^/.]+$/, '');
        const reader = new FileReader();

        reader.onload = action(e => {
            const load_options = { block_string: e.target.result, drop_event, from: save_types.LOCAL };
            if (is_preview) {
                const ref = document.getElementById('load-strategy__blockly-container');

                this.local_workspace = Blockly.inject(ref, {
                    media: `${__webpack_public_path__}media/`, // eslint-disable-line
                    zoom: {
                        wheel: false,
                        startScale: config.workspaces.previewWorkspaceStartScale,
                    },
                    readOnly: true,
                    scrollbars: true,
                });
                load_options.workspace = this.local_workspace;
            } else {
                load_options.workspace = Blockly.derivWorkspace;
                load_options.file_name = file_name;
            }

            load(load_options);
        });
        reader.readAsText(file);
    };
}
