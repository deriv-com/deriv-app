import filesaver                        from 'file-saver';
import {
    observable,
    action,
}                                       from 'mobx';
import {
    cleanUpOnLoad,
    fixCollapsedBlocks,
    backwardCompatibility,
    addDomAsBlock,
}                                       from '../scratch/utils';
import googleDrive                      from '../utils/integrations/googleDrive';
import { translate }                    from '../utils/lang/i18n';

export default class ToolbarStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable is_toolbox_open = true;
    @observable is_saveload_modal_open = false;
    @observable is_save_modal = true;
    @observable saveload_type = 'local';
    @observable file_name = translate('Untitled Bot');
    @observable is_google_drive_connected = false;

    @action.bound
    // eslint-disable-next-line class-methods-use-this
    onRunClick() {
        // TODO
    }

    @action.bound
    onToolboxToggle() {
        const toolbox = Blockly.derivWorkspace.toolbox_;

        toolbox.toggle();
        this.is_toolbox_open = !this.is_toolbox_open;
    }

    @action.bound
    onSearchBlur() {
        this.on_search_focus = false;
    }

    @action.bound
    onSearch({ search }) {
        if (this.is_toolbox_open) {
            this.onToolboxToggle();
        }

        Blockly.derivWorkspace.toolbox_.showSearch(search);
    }

    // eslint-disable-next-line class-methods-use-this
    onSearchClear(setValues) {
        const toolbox = Blockly.derivWorkspace.toolbox_;

        setValues({ search: '' });
        toolbox.showSearch('');
    }

    @action.bound
    onBotNameTyped(values) {
        const bot_name = values.botname;
        this.file_name = bot_name;
    }

    // eslint-disable-next-line class-methods-use-this
    onResetClick() {
        const workspace = Blockly.derivWorkspace;
        Blockly.Events.setGroup('reset');
        workspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace.blocksXmlStr), workspace);
        Blockly.Events.setGroup(false);
    }

    @action.bound
    toggleSaveLoadModal(is_save) {
        this.is_saveload_modal_open = !this.is_saveload_modal_open;
        this.is_save_modal = is_save;
    }

    // eslint-disable-next-line class-methods-use-this
    onDriveConnect() {
        googleDrive.authorise().then(() => {
            // TODO
        });
    }

    // eslint-disable-next-line class-methods-use-this
    onLoadClick({ is_local }) {
        if (is_local) {
            const upload = document.getElementById('files');
            upload.click();
        } else {
            // TO DO
        }
    }

    @action.bound
    handleFileChange(e) {
        let files,
            drop_event;
        if (e.type === 'drop') {
            e.stopPropagation();
            e.preventDefault();
            ({ files } = e.dataTransfer);
            drop_event = e;
        } else {
            ({ files } = e.target);
            this.toggleSaveLoadModal();
        }
        files = Array.from(files);
        files.forEach(file => {
            if (file.type.match('text/xml')) {
                this.readFile(file, drop_event);
            } else {
                // TODO
                console.error('File Type not matched'); // eslint-disable-line
            }
        });
        e.target.value = '';
    }

    @action.bound
    onConfirmSave(values) {
        const { is_local, save_as_collection } = values;

        if (is_local) {
            const xml = Blockly.Xml.workspaceToDom(Blockly.derivWorkspace);
            xml.setAttribute('collection', save_as_collection ? 'true' : 'false');

            const data = Blockly.Xml.domToPrettyText(xml);
            const blob = new Blob([data], { type: 'text/xml;charset=utf-8' });

            filesaver.saveAs(blob, `${this.file_name}.xml`);
        } else {
            // TO DO
        }

        this.toggleSaveLoadModal();
    }

    // eslint-disable-next-line class-methods-use-this
    onUndoClick() {
        Blockly.Events.setGroup('undo');
        Blockly.derivWorkspace.undo();
        Blockly.Events.setGroup(false);
    }

    // eslint-disable-next-line class-methods-use-this
    onRedoClick() {
        Blockly.derivWorkspace.undo(true);
    }

    // eslint-disable-next-line class-methods-use-this
    onZoomInOutClick(is_zoom_in) {
        const metrics = Blockly.derivWorkspace.getMetrics();
        const addition = is_zoom_in ? 1 : -1;

        Blockly.derivWorkspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    }

    // eslint-disable-next-line class-methods-use-this
    onSortClick() {
        Blockly.Events.setGroup(true);
        const topBlocks = Blockly.derivWorkspace.getTopBlocks(true);
        let cursorY = 0;
        topBlocks.forEach(block => {
            if (block.getSvgRoot().style.display !== 'none') {
                const xy = block.getRelativeToSurfaceXY();
                block.moveBy(-xy.x, cursorY - xy.y);
                block.snapToGrid();
                cursorY =
                    block.getRelativeToSurfaceXY().y + block.getHeightWidth().height + Blockly.BlockSvg.MIN_BLOCK_Y;
            }
        });
        Blockly.Events.setGroup(false);
        // Fire an event to allow scrollbars to resize.
        Blockly.derivWorkspace.resizeContents();
    }

    load(blockStr = '', drop_event = {}) {
        try {
            const xmlDoc = new DOMParser().parseFromString(blockStr, 'application/xml');

            if (xmlDoc.getElementsByTagName('parsererror').length) {
                throw new Error();
            }
        } catch (e) {
            // TODO
            console.error(e);  // eslint-disable-line
        }

        let xml;
        try {
            xml = Blockly.Xml.textToDom(blockStr);
        } catch (e) {
            // TODO
            console.error(e);  // eslint-disable-line
        }

        const blockly_xml = xml.querySelectorAll('block');

        if (!blockly_xml.length) {
            // TODO
            console.error('XML file contains unsupported elements. Please check or modify file.');  // eslint-disable-line
        }

        blockly_xml.forEach(block => {
            const block_type = block.getAttribute('type');

            if (!Object.keys(Blockly.Blocks).includes(block_type)) {
                // TODO
                console.error('XML file contains unsupported elements. Please check or modify file.');  // eslint-disable-line
            }
        });

        try {
            if (xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true') {
                this.loadBlocks(xml, drop_event);
            } else {
                this.loadWorkspace(xml);
            }
        } catch (e) {
            // TODO
            console.error('XML file contains unsupported elements. Please check or modify file.');  // eslint-disable-line
        }
    }

    // eslint-disable-next-line class-methods-use-this
    loadBlocks(xml, drop_event = {}) {
        const workspace = Blockly.derivWorkspace;
        const variables = xml.getElementsByTagName('variables');
        if (variables.length) {
            Blockly.Xml.domToVariables(variables[0], workspace);
        }
        Blockly.Events.setGroup('load');
        const addedBlocks =
            Array.from(xml.children)
                .map(block => addDomAsBlock(block))
                .filter(b => b);
        cleanUpOnLoad(addedBlocks, drop_event);

        fixCollapsedBlocks();
        Blockly.Events.setGroup(false);
    }

    // eslint-disable-next-line class-methods-use-this
    loadWorkspace(xml) {
        Blockly.Events.setGroup('load');
        Blockly.derivWorkspace.clear();

        Array.from(xml.children).forEach(block => {
            backwardCompatibility(block);
        });

        Blockly.Xml.domToWorkspace(xml, Blockly.derivWorkspace);
        fixCollapsedBlocks();
        Blockly.Events.setGroup(false);
    }

    readFile(f, drop_event = {}) {
        const reader = new FileReader();
        reader.onload = e => this.load(e.target.result, drop_event);
        reader.readAsText(f);
    }
}
