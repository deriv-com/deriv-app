import { observable, action, computed, reaction, when } from 'mobx';
import { localize } from '@deriv/translations';
import { load, config, save_types, getSavedWorkspaces, removeExistingWorkspace } from '@deriv/bot-skeleton';
import { tabs_title } from 'Constants/load-modal';
import RootStore from './root-store';
import React from 'react';

interface ILoadModalStore {
    active_index: number;
    is_load_modal_open: boolean;
    load_recent_strategies: boolean;
    is_explanation_expand: boolean;
    is_open_button_loading: boolean;
    loaded_local_file: boolean | null;
    recent_strategies: string[];
    selected_strategy_id: string | undefined;
    is_strategy_remove: boolean;
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
    onToggleDeleteDialog: (type: string, is_delete_modal_open: boolean) => void;
    onZoomInOutClick: (is_zoom_in: string) => void;
    previewRecentStrategy: (workspace_id: string) => void;
    setActiveTabIndex: (index: number) => void;
    setLoadedLocalFile: (loaded_local_file: boolean | null) => void;
    setRecentStrategies: (recent_strategies: string[]) => void;
    setSelectedStrategyId: () => void;
    toggleExplanationExpand: () => void;
    toggleLoadModal: () => void;
    toggleStrategies: (load_recent_strategies: string[]) => void;
    getRecentFileIcon: (save_type: { [key: string]: string } | string) => string;
    getSaveType: (save_type: { [key: string]: string } | string) => string;
}

const clearInjectionDiv = () => {
    const el_ref = document.getElementById('load-strategy__blockly-container');
    if (el_ref?.getElementsByClassName('injectionDiv').length > 1) {
        el_ref.removeChild(el_ref.getElementsByClassName('injectionDiv')[0]);
    }
};
export default class LoadModalStore implements ILoadModalStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
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
        reaction(
            () => this.is_delete_modal_open,
            async is_delete_modal_open => {
                if (!is_delete_modal_open) {
                    this.setRecentStrategies((await getSavedWorkspaces()) || []);
                }
            }
        );
    }

    recent_workspace;
    local_workspace;
    drop_zone;

    @observable active_index = 0;
    @observable is_load_modal_open = false;
    @observable load_recent_strategies = false;
    @observable is_explanation_expand = false;
    @observable is_open_button_loading = false;
    @observable loaded_local_file = null;
    @observable recent_strategies = [];
    @observable selected_strategy_id = undefined;
    @observable is_strategy_loaded = false;
    @observable is_delete_modal_open = false;
    @observable is_strategy_removed = false;

    @computed
    get preview_workspace() {
        if (this.tab_name === tabs_title.TAB_LOCAL) return this.local_workspace;
        if (this.tab_name === tabs_title.TAB_RECENT) return this.recent_workspace;
        return null;
    }

    @computed
    get selected_strategy() {
        return this.recent_strategies.find(ws => ws.id === this.selected_strategy_id) || this.recent_strategies[0];
    }

    @computed
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

    @action.bound
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

        files = Array.from(files);

        if (!is_body) {
            if (files[0].name.includes('xml')) {
                this.setLoadedLocalFile(files[0]);
            } else {
                return false;
            }
        }
        this.readFile(!is_body, event, files[0]);
        event.target.value = '';
        return true;
    };

    @action.bound
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

    @action.bound
    loadFileFromLocal = (): void => {
        this.is_open_button_loading = true;
        this.readFile(false, {}, this.loaded_local_file);
        this.is_open_button_loading = false;
    };

    @action.bound
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
            this.previewRecentStrategy(this.selected_strategy.id);
        }
    };

    @action.bound
    async onDriveConnect() {
        const { google_drive } = this.root_store;

        if (google_drive.is_authorised) {
            google_drive.signOut();
        } else {
            google_drive.signIn();
        }
    }

    @action.bound
    async onDriveOpen() {
        const { loadFile } = this.root_store.google_drive;
        const { xml_doc, file_name } = await loadFile();
        load({ block_string: xml_doc, file_name, workspace: Blockly.derivWorkspace, from: save_types.GOOGLE_DRIVE });
    }

    @action.bound
    onEntered = (): void => {
        this.previewRecentStrategy(this.selected_strategy.id);
    };

    @action.bound
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

    @action.bound
    onZoomInOutClick = (is_zoom_in: string): void => {
        if (this.preview_workspace) {
            this.preview_workspace.zoomCenter(is_zoom_in ? 1 : -1);
        }
    };

    @action.bound
    previewRecentStrategy(workspace_id) {
        this.setSelectedStrategyId(workspace_id);

        if (!this.selected_strategy) {
            return;
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
    }

    @action.bound
    setActiveTabIndex = (index: number): void => {
        this.active_index = index;
    };

    @action.bound
    setLoadedLocalFile = (loaded_local_file: boolean | null): void => {
        this.loaded_local_file = loaded_local_file;
    };

    @action.bound
    setRecentStrategies = (recent_strategies: string[]): void => {
        this.recent_strategies = recent_strategies;
    };

    @action.bound
    refreshStratagies = () => {
        this.setRecentStrategies(this.recent_strategies);
    };

    @action.bound
    setSelectedStrategyId = (selected_strategy_id: string[] | undefined): void => {
        this.selected_strategy_id = selected_strategy_id;
    };

    @action.bound
    toggleExplanationExpand = (): void => {
        this.is_explanation_expand = !this.is_explanation_expand;
    };

    @action.bound
    toggleLoadModal = (): void => {
        this.is_load_modal_open = !this.is_load_modal_open;
    };
    @action.bound
    toggleStrategies = (load_recent_strategies: string[]): void => {
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

    @action.bound
    onToggleDeleteDialog = (type: string, is_delete_modal_open: boolean): void => {
        if (type === 'confirm') {
            removeExistingWorkspace(this.selected_strategy.id);
        }
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
