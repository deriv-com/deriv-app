import { observable, action } from 'mobx';
import { load, config, save_types, getSavedWorkspaces, removeExistingWorkspace } from '@deriv/bot-skeleton';

export default class LoadModalStore {
    @observable is_load_modal_open = false;
    @observable active_index = 0;
    @observable recent_files = [];
    @observable selected_file_id = '';
    @observable is_explanation_expand = false;
    @observable loaded_local_file = null;
    @observable is_open_button_loading = false;
    recent_workspace;
    local_workspace;
    drop_zone;

    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    toggleLoadModal() {
        this.is_load_modal_open = !this.is_load_modal_open;

        if (this.is_load_modal_open) {
            this.recent_files = getSavedWorkspaces() || [];
        }
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;

        // dispose workspace in recent tab when switch tab
        if (this.active_index !== 0 && this.recent_workspace && this.recent_workspace.rendered) {
            this.recent_workspace.dispose();
        }

        // preview workspace when switch to recent tab
        if (this.active_index === 0 && this.recent_files.length) {
            this.previewWorkspace(this.selected_file_id);
        }

        // dispose workspace in local tab when switch tab
        if (
            this.active_index !== 1 &&
            this.loaded_local_file &&
            this.local_workspace &&
            this.local_workspace.rendered
        ) {
            this.local_workspace.dispose();
            this.loaded_local_file = null;
        }

        // add drag and drop event listerner when switch to local tab
        if (this.active_index === 1) {
            this.drop_zone = document.getElementById('import_dragndrop');
            if (this.drop_zone) {
                this.drop_zone.addEventListener('drop', e => this.handleFileChange(e, false));
            }
        } else if (this.drop_zone) {
            this.drop_zone.removeEventListener('drop', e => this.handleFileChange(e, false));
        }
    }

    /** --------- Recent Tab Start --------- */
    @action.bound
    onMount() {
        if (this.recent_files.length && this.active_index === 0) {
            this.selected_file_id = this.recent_files[0].id;
            this.previewWorkspace(this.selected_file_id);
        }
    }

    @action.bound
    onUnmount() {
        if (this.recent_workspace && this.recent_workspace.rendered) {
            this.recent_workspace.dispose();
        }
        this.selected_file_id = null;
        this.setActiveTabIndex(0);
    }

    @action.bound
    previewWorkspace(id) {
        const selected_file_id = this.recent_files.find(file => file.id === id);
        if (!selected_file_id) {
            return;
        }

        const xml_file = selected_file_id.xml;
        this.selected_file_id = id;

        if (!this.recent_workspace || !this.recent_workspace.rendered) {
            const ref = document.getElementById('load-recent__scratch');
            this.recent_workspace = Blockly.inject(ref, {
                media: `${__webpack_public_path__}media/`, // eslint-disable-line
                zoom: {
                    wheel: false,
                    startScale: config.workspaces.previewWorkspaceStartScale,
                },
                readOnly: true,
            });
        } else {
            this.recent_workspace.clear();
        }

        load({ block_string: xml_file, drop_event: {}, preview_workspace: this.recent_workspace });
    }

    @action.bound
    onZoomInOutClick(is_zoom_in) {
        let workspace;
        if (this.active_index === 0) {
            workspace = this.recent_workspace;
        } else if (this.active_index === 1) {
            workspace = this.local_workspace;
        }

        workspace.zoomCenter(is_zoom_in ? 1 : -1);
    }

    @action.bound
    loadFileFromRecent() {
        this.is_open_button_loading = true;
        const selected_workspace = this.recent_files.find(file => file.id === this.selected_file_id);

        if (!selected_workspace) {
            return;
        }

        removeExistingWorkspace(selected_workspace.id);
        load({
            block_string: selected_workspace.xml,
            strategy_id: selected_workspace.id,
            file_name: selected_workspace.name,
        });
        this.is_open_button_loading = false;
        this.toggleLoadModal();
    }

    @action.bound
    onExplanationToggle() {
        this.is_explanation_expand = !this.is_explanation_expand;
    }

    // eslint-disable-next-line class-methods-use-this
    getRecentFileIcon(save_type) {
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
    }

    // eslint-disable-next-line class-methods-use-this
    getSaveType(save_type) {
        return save_type.replace(/\b\w/g, l => l.toUpperCase());
    }
    /** --------- Recent Tab End --------- */

    /** --------- Local Tab Start --------- */
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
            this.loaded_local_file = files[0];
        }
        this.readFile(!is_body, event);
        event.target.value = '';
    }

    // eslint-disable-next-line class-methods-use-this
    readFile(is_preview, drop_event) {
        const file_name = this.loaded_local_file.name.replace(/\.[^/.]+$/, '');
        const reader = new FileReader();
        reader.onload = action(e => {
            if (is_preview) {
                const ref = document.getElementById('load-local__scratch');
                this.local_workspace = Blockly.inject(ref, {
                    media: `${__webpack_public_path__}media/`, // eslint-disable-line
                    zoom: {
                        wheel: false,
                        startScale: config.workspaces.previewWorkspaceStartScale,
                    },
                    readOnly: true,
                });
                load({ block_string: e.target.result, drop_event, preview_workspace: this.local_workspace });
            } else {
                load({ block_string: e.target.result, drop_event, file_name });
            }
        });
        reader.readAsText(this.loaded_local_file);
    }

    @action.bound
    loadFileFromLocal() {
        this.is_open_button_loading = true;
        this.readFile(false, {});
        this.is_open_button_loading = false;
        this.toggleLoadModal();
    }

    @action.bound
    closePreview() {
        this.local_workspace.dispose();
        this.loaded_local_file = null;
    }
    /** --------- Local Tab End --------- */

    /** --------- GD Tab Start --------- */
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
        const { google_drive } = this.root_store;
        const { loadFile } = google_drive;

        const { xml_doc, file_name } = await loadFile();

        load({ block_string: xml_doc, file_name });
        this.toggleLoadModal();
    }
    /** --------- GD Tab End --------- */
}
