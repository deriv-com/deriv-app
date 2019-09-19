import filesaver                        from 'file-saver';
import {
    observable,
    action,
    computed,
}                                       from 'mobx';
import {
    cleanUpOnLoad,
    fixCollapsedBlocks,
    backwardCompatibility,
    addDomAsBlock,
}                                       from '../scratch/utils';
import googleDrive                      from '../utils/integrations/googleDrive';

export default class ToolbarStore {
    @observable is_toolbox_open = false;
    @observable is_saveload_modal_open = false;
    @observable is_save_modal = true;
    @observable saveload_type = 'local';
    @observable file_name = 'Untitled Bot';
    @observable is_google_drive_connected = false;

    @action.bound onRunClick = () => {
        // TODO
    }

    @action.bound onToolboxToggle = () => {
        this.is_toolbox_open = !this.is_toolbox_open;
        const toolbox = Blockly.derivWorkspace.toolbox_;

        toolbox.toggle();
    }

    @action.bound onSearchBlur = () => {
        this.on_search_focus = false;
    }

    @action.bound onSearch = ({ search }) => {
        if (this.is_toolbox_open) {
            this.onToolboxToggle();
        }

        Blockly.derivWorkspace.toolbox_.showSearch(search);
    }

    @action.bound onSearchClear = setValues => {
        const toolbox = Blockly.derivWorkspace.toolbox_;

        setValues({ search: '' });
        toolbox.showSearch_('');
    }

    @action.bound onBotNameTyped = values => {
        const bot_name = values.botname;
        this.file_name = bot_name;
    }

    @action.bound onResetClick = async () => {
        const workspace = Blockly.derivWorkspace;
        // eslint-disable-next-line
        Blockly.Events.setGroup('reset');
        workspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace.blocksXmlStr), workspace);
        Blockly.Events.setGroup(false);
    }

    @action.bound toggleSaveLoadModal = is_save => {
        this.is_saveload_modal_open = !this.is_saveload_modal_open;
        this.is_save_modal = is_save;
    }

    @action.bound onDriveConnect = () => {
        googleDrive.authorise().then(() => {
            // TODO
        });
    }

    @action.bound onLoadClick = ({ is_local }) =>  {
        if (is_local) {
            const upload = document.getElementById('files');
            upload.click();
        } else {
            // TO DO
        }
    }

    @action.bound handleFileChange = e => {
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

    @action.bound onConfirmSave = values => {
        const { is_local, save_as_collection } = values;

        if (is_local) {
            const file_name = this.file_name;
            const xml = Blockly.Xml.workspaceToDom(Blockly.derivWorkspace);
            xml.setAttribute('collection', save_as_collection ? 'true' : 'false');

            const data = Blockly.Xml.domToPrettyText(xml);
            const blob = new Blob([data], { type: 'text/xml;charset=utf-8' });

            filesaver.saveAs(blob, file_name);
        } else {
            // TO DO
        }

        this.toggleSaveLoadModal();
    }

    @action.bound onUndoClick = () => {
        Blockly.Events.setGroup('undo');
        Blockly.derivWorkspace.undo();
        Blockly.Events.setGroup(false);
    }

    @action.bound onRedoClick = () => {
        Blockly.derivWorkspace.undo(true);
    }

    @action.bound onZoomInOutClick = is_zoom_in => {
        const metrics = Blockly.derivWorkspace.getMetrics();
        const addition = is_zoom_in ? 1 : -1;

        Blockly.derivWorkspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    }

    @action.bound onSortClick = () => {
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

    @computed
    get isModalOpen() {
        return this.is_saveload_modal_open;
    }

    @computed
    get isGoogleDriveConnected() {
        return this.is_google_drive_connected;
    }

    @computed
    get isSaveModal () {
        return this.is_save_modal;
    }

    @computed
    get isToolboxOpen () {
        return this.is_toolbox_open;
    }

    /* eslint-disable class-methods-use-this */
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

        const blocklyXml = xml.querySelectorAll('block');

        if (!blocklyXml.length) {
            console.error('XML file contains unsupported elements. Please check or modify file.');  // eslint-disable-line
        }

        blocklyXml.forEach(block => {
            const blockType = block.getAttribute('type');

            if (!Object.keys(Blockly.Blocks).includes(blockType)) {
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
            console.error('XML file contains unsupported elements. Please check or modify file.');  // eslint-disable-line
        }
    }

    loadBlocks = (xml, drop_event = {}) => {
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
    };

    loadWorkspace = xml => {
        Blockly.Events.setGroup('load');
        Blockly.derivWorkspace.clear();

        Array.from(xml.children).forEach(block => {
            backwardCompatibility(block);
        });

        Blockly.Xml.domToWorkspace(xml, Blockly.derivWorkspace);
        fixCollapsedBlocks();
        Blockly.Events.setGroup(false);
    };

    readFile = (f, drop_event = {}) => {
        const reader = new FileReader();
        reader.onload = e => this.load(e.target.result, drop_event);
        reader.readAsText(f);
    };
}
