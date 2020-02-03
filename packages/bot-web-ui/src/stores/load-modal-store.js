import { observable, action } from 'mobx';
import { load, config, save_types, getSavedWorkspaces } from '@deriv/bot-skeleton';

export default class LoadModalStore {
    @observable is_load_modal_open = false;
    @observable active_index = 0;
    @observable recent_files = [];
    @observable selected_file_id = '';
    @observable is_explanation_expand = false;
    @observable loaded_local_file = null;
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

        if (this.active_index !== 0 && this.recent_workspace && this.recent_workspace.rendered) {
            this.recent_workspace.dispose();
        }
        if (this.active_index === 0 && this.recent_files.length) {
            this.previewWorkspace(this.selected_file_id);
        }
        if (
            this.active_index !== 1 &&
            this.loaded_local_file &&
            this.local_workspace &&
            this.local_workspace.rendered
        ) {
            this.local_workspace.dispose();
            this.loaded_local_file = null;
        }
        if (this.active_index === 1) {
            this.drop_zone = document.getElementsByClassName('local__dragndrop')[0];
            this.drop_zone.addEventListener('drop', e => this.handleFileChange(e, false));
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
            const ref = document.getElementById('scratch_recent');
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

        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml_file), this.recent_workspace);
    }

    @action.bound
    onZoomInOutClick(is_zoom_in) {
        let workspace;
        if (this.active_index === 0) {
            workspace = this.recent_workspace;
        } else if (this.active_index === 1) {
            workspace = this.local_workspace;
        }

        workspace.zoomCenter(is_zoom_in ? 1 : 0);
    }

    @action.bound
    loadFileFromRecent() {
        const selected_workspace = this.recent_files.find(file => file.id === this.selected_file_id);
        if (!selected_workspace) {
            return;
        }

        load(selected_workspace.xml);
        this.toggleLoadModal();
    }

    @action.bound
    onExplanationToggle() {
        this.is_explanation_expand = !this.is_explanation_expand;
    }

    static getRecentFileIcon(location) {
        switch (location) {
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

    static getSaveType(save_type) {
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
        this.loaded_local_file = files[0];
        this.handleFilefromLocal(files[0], !is_body, event);
        event.target.value = '';
    }

    @action.bound
    handleFilefromLocal(file, is_preview, drop_event) {
        const { onBotNameTyped } = this.root_store.toolbar;

        if (!file.type.match('text/xml')) {
            return;
        }

        this.readFile(file, is_preview, drop_event);

        if (!is_preview) {
            const file_name = file.name.replace(/\.[^/.]+$/, '');
            onBotNameTyped(file_name);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    readFile(file, is_preview, drop_event) {
        const reader = new FileReader();
        reader.onload = e => {
            if (is_preview) {
                const ref = document.getElementById('scratch_local');
                this.local_workspace = Blockly.inject(ref, {
                    media: `${__webpack_public_path__}media/`, // eslint-disable-line
                    zoom: {
                        wheel: false,
                        startScale: config.workspaces.previewWorkspaceStartScale,
                    },
                    readOnly: true,
                });
                Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(e.target.result), this.local_workspace);
            } else {
                load(e.target.result, drop_event);
            }
        };
        reader.readAsText(file);
    }

    @action.bound
    loadFileFromLocal() {
        this.handleFilefromLocal(this.loaded_local_file);
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
        const { google_drive, toolbar } = this.root_store;
        const { onBotNameTyped } = toolbar;
        const { loadFile } = google_drive;

        const { xml_doc, file_name } = await loadFile();

        onBotNameTyped(file_name);
        load(xml_doc);
        this.toggleLoadModal();
    }
    /** --------- GD Tab End --------- */
}
