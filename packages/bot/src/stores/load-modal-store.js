import {
    observable,
    action,
}                         from 'mobx';
import { getRecentFiles } from '../scratch/utils';
import { save_types } from '../constants/save-type';
import config from '../constants';

export default class LoadModalStore {

    @observable is_load_modal_open = false;
    @observable active_index = 0;
    @observable recent_files = [];
    @observable selected_file = '';
    @observable explaination_expand = false;
    workspace;

    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    onMount() {
        if (this.recent_files.length) {
            this.selected_file = this.recent_files[0].id;
            this.previewWorkspace({ id: this.selected_file });
        }
    }

    @action.bound
    onUnmount() {
        if (this.workspace && this.workspace.getAllBlocks().length) {
            this.workspace.dispose();
        }
        this.selected_file = null;
    }

    @action.bound
    toggleLoadModal() {
        this.is_load_modal_open = !this.is_load_modal_open;

        if (this.is_load_modal_open) {
            this.recent_files = getRecentFiles() || [];
        }
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;

        if (this.active_index !== 0 && this.workspace && this.workspace.getAllBlocks().length) {
            this.workspace.dispose();
        } else if (this.recent_files.length) {
            this.previewWorkspace({ id: this.selected_file });
        }
    }

    @action.bound
    previewWorkspace({ id }) {
        const selected_file = this.recent_files.find(file => file.id === id);
        if (!selected_file) {
            return;
        }

        const xml_file = selected_file.xml;
        this.selected_file = id;
        
        if (!this.workspace || !this.workspace.getAllBlocks().length) {
            const ref = document.getElementById('scratch_load');
            this.workspace   = Blockly.inject(ref, {
                media   : `${__webpack_public_path__}media/`, // eslint-disable-line
                zoom : {
                    wheel     : false,
                    startScale: config.workspaces.previewWorkspaceStartScale,
                },
                readOnly: true,
            });
        } else {
            this.workspace.clear();
        }

        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml_file), this.workspace);
        this.workspace.cleanUp();
    }

    @action.bound
    onZoomInOutClick(is_zoom_in) {
        const metrics   = this.workspace.getMetrics();
        const addition  = is_zoom_in ? 1 : -1;

        this.workspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    }

    @action.bound
    onExplainationToggle() {
        this.explaination_expand = !this.explaination_expand;
    }

    // eslint-disable-next-line class-methods-use-this
    getRecentFileIcon(location) {
        switch (location) {
            case save_types.UNSAVED : return 'IcReports';
            case save_types.LOCAL : return 'IcDesktop';
            case save_types.GOOGLE_DRIVE : return 'IcGoogleDrive';
            default : return 'IcReports';
        }
    }
}
