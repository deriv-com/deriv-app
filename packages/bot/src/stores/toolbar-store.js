import filesaver                        from 'file-saver';
import {
    observable,
    action,
    computed,
}                                       from 'mobx';
import { createErrorAndEmit }           from '../utils/error';
import { observer as globalObserver }   from '../utils/observer';
import {
    cleanUpOnLoad,
    fixCollapsedBlocks,
    backwardCompatibility,
    fixArgumentAttribute,
    addDomAsBlock,
}                                       from '../scratch/utils';
import { translate }                    from '../utils/tools';
import googleDrive                      from '../utils/integrations/googleDrive';

export default class ToolbarStore {
    constructor(flyout) {
        this.flyout = flyout;
    }

    @observable is_toolbox_open = false;
    @observable is_saveload_modal_open = false;
    @observable is_save_modal = true;
    @observable saveload_type = 'local';
    @observable file_name = 'Untitled Bot';
    @observable is_google_drive_connected = false;

    @action.bound onRunClick = () => {
        // TODO
    }

    @action.bound onStartClick = () => {
        this.is_toolbox_open = !this.is_toolbox_open;
        const toolbox = Blockly.derivWorkspace.toolbox_;

        if (this.is_toolbox_open) {
            toolbox.open();
        } else {
            toolbox.close();
        }
    }

    @action.bound onSearchBlur = () => {
        this.on_search_focus = false;
    }

    @action.bound onSearch = ({ search }) => {
        const toolbox = Blockly.derivWorkspace.toolbox_;

        if (this.is_toolbox_open) {
            this.onStartClick();
        }

        toolbox.showSearch_(search);
    }

    @action.bound onSearchClear = setValues => {
        const toolbox = Blockly.derivWorkspace.toolbox_;

        setValues({ search: '' });
        toolbox.showSearch_('');
    }

    @action.bound onBotnameTyped = values => {
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
        this.is_google_drive_connected = true;
        if (googleDrive.isAuthorised) {
            googleDrive.signOut();
        } else {
            googleDrive.authorise().then(() => {
                // TODO
            }).catch(console.error); // eslint-disable-line
        }
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
            dropEvent;
        if (e.type === 'drop') {
            e.stopPropagation();
            e.preventDefault();
            ({ files } = e.dataTransfer);
            dropEvent = e;
        } else {
            ({ files } = e.target);

            this.toggleSaveLoadModal();
        }
        files = Array.from(files);
        files.forEach(file => {
            if (file.type.match('text/xml')) {
                this.readFile(file, dropEvent);
            } else {
                globalObserver.emit('ui.log.info', `${translate('File is not supported:')} ${file.name}`);
            }
        });
        e.target.value = '';
    }

    @action.bound onConfirmSave = ({ is_local, save_as_collection }) => {
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
        if (is_zoom_in) {
            Blockly.derivWorkspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, 1);
        } else {
            Blockly.derivWorkspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, -1);
        }
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

    /* eslint-disable class-methods-use-this */
    load(blockStr = '', dropEvent = {}) {
        const unrecognisedMsg = () => translate('Unrecognized file format');

        try {
            const xmlDoc = new DOMParser().parseFromString(blockStr, 'application/xml');

            if (xmlDoc.getElementsByTagName('parsererror').length) {
                throw new Error();
            }
        } catch (err) {
            throw createErrorAndEmit('FileLoad', unrecognisedMsg());
        }

        let xml;
        try {
            xml = Blockly.Xml.textToDom(blockStr);
        } catch (e) {
            throw createErrorAndEmit('FileLoad', unrecognisedMsg());
        }

        const blocklyXml = xml.querySelectorAll('block');

        if (!blocklyXml.length) {
            throw createErrorAndEmit(
                'FileLoad',
                'XML file contains unsupported elements. Please check or modify file.'
            );
        }

        blocklyXml.forEach(block => {
            const blockType = block.getAttribute('type');

            if (!Object.keys(Blockly.Blocks).includes(blockType)) {
                throw createErrorAndEmit(
                    'FileLoad',
                    'XML file contains unsupported elements. Please check or modify file'
                );
            }
        });

        try {
            if (xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true') {
                this.loadBlocks(xml, dropEvent);
            } else {
                this.loadWorkspace(xml);
            }
        } catch (e) {
            console.error(e); // eslint-disable-line
            throw createErrorAndEmit('FileLoad', translate('Unable to load the block file'));
        }
    }

    loadBlocks = (xml, dropEvent = {}) => {
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
        cleanUpOnLoad(addedBlocks, dropEvent);

        fixCollapsedBlocks();
        Blockly.Events.setGroup(false);
    };

    loadWorkspace = xml => {
        Blockly.Events.setGroup('load');
        Blockly.derivWorkspace.clear();

        Array.from(xml.children).forEach(block => {
            backwardCompatibility(block);
        });

        fixArgumentAttribute(xml);
        Blockly.Xml.domToWorkspace(xml, Blockly.derivWorkspace);
        fixCollapsedBlocks();
        Blockly.Events.setGroup(false);
    };

    readFile = (f, dropEvent = {}) => {
        const reader = new FileReader();
        reader.onload = e => this.load(e.target.result, dropEvent);
        reader.readAsText(f);
    };
}
