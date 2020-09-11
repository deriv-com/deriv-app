import { observable, action, computed, reaction } from 'mobx';
import { localize } from '@deriv/translations';
import { load, config, save_types, getSavedWorkspaces, removeExistingWorkspace } from '@deriv/bot-skeleton';
import { tabs_title } from '../constants/load-modal';

export default class LoadModalStore {
    constructor(root_store) {
        this.root_store = root_store;

        reaction(
            () => this.active_index,
            () => this.onActiveIndexChange()
        );
        reaction(
            () => this.is_load_modal_open,
            is_load_modal_open => {
                if (is_load_modal_open) {
                    this.setRecentFiles(getSavedWorkspaces() || []);
                } else {
                    this.onLoadModalClose();
                }
            }
        );
        reaction(
            () => this.loaded_local_file,
            loaded_local_file => {
                if (!loaded_local_file && this.local_workspace) {
                    this.local_workspace.dispose();
                }
            }
        );
    }

    recent_workspace;
    local_workspace;
    drop_zone;

    @observable active_index = 0;
    @observable is_load_modal_open = false;
    @observable is_explanation_expand = false;
    @observable is_open_button_loading = false;
    @observable loaded_local_file = null;
    @observable recent_workspaces = [];
    @observable selected_workspace_id = undefined;
    @observable should_rerender_tabs = false;

    @computed
    get preview_workspace() {
        if (this.tab_name === tabs_title.TAB_LOCAL) return this.local_workspace;
        if (this.tab_name === tabs_title.TAB_RECENT) return this.recent_workspace;
        return null;
    }

    @computed
    get selected_workspace() {
        return this.recent_workspaces.find(ws => ws.id === this.selected_workspace_id) || this.recent_workspaces[0];
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
    handleFileChange(event, is_body = true) {
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
            this.setLoadedLocalFile(files[0]);
        }
        this.readFile(!is_body, event, files[0]);
        event.target.value = '';
    }

    @action.bound
    loadFileFromRecent() {
        this.is_open_button_loading = true;

        if (!this.selected_workspace) {
            this.is_open_button_loading = false;
            return;
        }

        removeExistingWorkspace(this.selected_workspace.id);
        load({
            block_string: this.selected_workspace.xml,
            strategy_id: this.selected_workspace.id,
            file_name: this.selected_workspace.name,
            workspace: Blockly.derivWorkspace,
        });
        this.is_open_button_loading = false;
        this.toggleLoadModal();
    }

    @action.bound
    loadFileFromLocal() {
        this.is_open_button_loading = true;
        this.readFile(false, {}, this.loaded_local_file);
        this.is_open_button_loading = false;
        this.toggleLoadModal();
    }

    @action.bound
    onActiveIndexChange() {
        if (this.tab_name === tabs_title.TAB_RECENT) {
            // preview workspace when switch to recent tab
            if (this.selected_workspace) {
                this.previewWorkspace(this.selected_workspace_id);
            }
        } else if (this.recent_workspace) {
            // dispose workspace in recent tab when switch tab
            this.recent_workspace.dispose(true);
        }

        if (this.tab_name === tabs_title.TAB_LOCAL) {
            // add drag and drop event listerner when switch to local tab
            if (!this.drop_zone) {
                this.drop_zone = document.querySelector('load-strategy__local-dropzone-area');

                if (this.drop_zone) {
                    this.drop_zone.addEventListener('drop', e => this.handleFileChange(e, false));
                }
            }

            // dispose workspace in local tab when switch tab
            if (this.loaded_local_file && this.local_workspace) {
                this.setLoadedLocalFile(null);
            }
        } else if (this.drop_zone) {
            this.drop_zone.removeEventListener('drop', e => this.handleFileChange(e, false));
        }
    }

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
        this.toggleLoadModal();
    }

    @action.bound
    onEntered() {
        if (this.tab_name === tabs_title.TAB_RECENT && this.selected_workspace) {
            this.previewWorkspace(this.selected_workspace.id);
        }

        this.setShouldRerenderTabs(true);
    }

    @action.bound
    onLoadModalClose() {
        if (this.preview_workspace) {
            this.preview_workspace.dispose(true);
        }

        this.setActiveTabIndex(0); // Reset to first tab.
        this.setLoadedLocalFile(null);
        this.setShouldRerenderTabs(false);
    }

    @action.bound
    onZoomInOutClick(is_zoom_in) {
        if (this.preview_workspace) {
            this.preview_workspace.zoomCenter(is_zoom_in ? 1 : -1);
        }
    }

    @action.bound
    previewWorkspace(workspace_id) {
        this.setSelectedWorkspaceId(workspace_id);

        if (!this.selected_workspace) {
            return;
        }

        if (!this.recent_workspace || !this.recent_workspace.rendered) {
            const ref = document.getElementById('load-strategy__blockly-container');

            if (!ref) {
                // eslint-disable-next-line no-console
                console.warn('Could not find preview workspace element.');
                return;
            }

            this.recent_workspace = Blockly.inject(ref, {
                media: `${__webpack_public_path__}media/`,
                zoom: {
                    wheel: false,
                    startScale: config.workspaces.previewWorkspaceStartScale,
                },
                readOnly: true,
                scrollbars: true,
            });
        }

        load({ block_string: this.selected_workspace.xml, drop_event: {}, workspace: this.recent_workspace });
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;
    }

    @action.bound
    setLoadedLocalFile(loaded_local_file) {
        this.loaded_local_file = loaded_local_file;
    }

    @action.bound
    setRecentFiles(recent_workspaces) {
        this.recent_workspaces = recent_workspaces;
    }

    @action.bound
    setSelectedWorkspaceId(selected_workspace_id) {
        this.selected_workspace_id = selected_workspace_id;
    }

    @action.bound
    setShouldRerenderTabs(should_rerender_tabs) {
        this.should_rerender_tabs = should_rerender_tabs;
    }

    @action.bound
    toggleExplanationExpand() {
        this.is_explanation_expand = !this.is_explanation_expand;
    }

    @action.bound
    toggleLoadModal() {
        this.is_load_modal_open = !this.is_load_modal_open;
    }

    getRecentFileIcon = save_type => {
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

    getSaveType = save_type => {
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

    readFile = (is_preview, drop_event, file) => {
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
