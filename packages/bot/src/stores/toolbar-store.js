import filesaver from 'file-saver';
import { observable, action, computed } from 'mobx';
import { createErrorAndEmit } from '../utils/error';
import { observer as globalObserver } from '../utils/observer';
import {
    strategyHasValidTradeTypeCategory,
    addLoadersFirst, cleanUpOnLoad,
    fixCollapsedBlocks,
    addDomAsBlock,
    backwardCompatibility,
    fixArgumentAttribute,
    removeUnavailableMarkets,
    cleanBeforeExport,
} from '../scratch/utils';
import { translate } from '../utils/tools';

export default class ToolbarStore {
    constructor(flyout) {
        this.flyout = flyout;
    }

    @observable is_toolbox_open = false;
    @observable load_modal_open = false;
    @observable save_modal_open = false;
    @observable saveload_type = 'local';
    @observable file_name = 'Untitled Bot';
    @observable contract_status = 'none';

    @action.bound onRunClick = () => {
        const status = ['none', 'buy', 'succeed', 'closed'];
        this.contract_status = status[status.indexOf(this.contract_status) + 1];
    }

    @computed
    get contractStatus() {
        return this.contract_status;
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

    @action.bound onSearch = values => {
        const search_term = values.search;
        const toolbox = Blockly.derivWorkspace.toolbox_;

        if (this.is_toolbox_open) {
            this.onStartClick();
        }

        toolbox.showSearch_(search_term);
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

    @action.bound onSaveLoadTypeChange = e => {
        const { target: { value } } = e;
        this.saveload_type = value;
    }

    @action.bound onResetClick = async () => {
        const workspace = Blockly.derivWorkspace;
        // eslint-disable-next-line
        Blockly.Events.setGroup('reset');
        workspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace.blocksXmlStr), workspace);
        Blockly.Events.setGroup(false);
    }

    @action.bound onBrowseClick = () => {
        this.load_modal_open = true;
    }

    @action.bound onLoadClick = () => {
        if (this.saveload_type === 'google-drive') {
            // TO DO
        } else if (this.saveload_type === 'local') {
            const upload = document.getElementById('files');
            upload.click();
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

        this.closeLoadModal();
    }

    @action.bound closeLoadModal = () => {
        this.load_modal_open = false;
    }

    @action.bound onSaveClick = () => {
        this.save_modal_open = true;
    }

    @action.bound onConfirmSave = () => {
        if (this.saveload_type === 'google-drive') {
            // TO DO
        } else if (this.saveload_type === 'local') {
            const file_name = this.file_name;
            const xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
            cleanBeforeExport(xml);

            const data = Blockly.Xml.domToPrettyText(xml);
            const blob = new Blob([data], { type: 'text/xml;charset=utf-8' });

            filesaver.saveAs(blob, file_name);
        }

        this.closeSaveModal();
    }

    @action.bound closeSaveModal = () => {
        this.save_modal_open = false;
    }

    @action.bound onGoogleDriveClick = () => {
        const symbol = this.ws.activeSymbols({ skip_cache_update: true });

        // eslint-disable-next-line
        console.log(symbol);
    }

    @action.bound onUndoClick = () => {
        Blockly.Events.setGroup('undo');
        Blockly.mainWorkspace.undo();
        Blockly.Events.setGroup(false);
    }

    @action.bound onRedoClick = () => {
        Blockly.mainWorkspace.undo(true);
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
    get openLoadModal() {
        return this.load_modal_open;
    }

    @computed
    get openSaveModal() {
        return this.save_modal_open;
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
            throw createErrorAndEmit('FileLoad', translate('Unable to load the block file'));
        }
    }

    loadBlocks = (xml, dropEvent = {}) => {
        if (!strategyHasValidTradeTypeCategory(xml)) return;
        if (this.marketsWereRemoved(xml)) return;

        const variables = xml.getElementsByTagName('variables');
        if (variables.length > 0) {
            Blockly.Xml.domToVariables(variables[0], Blockly.mainWorkspace);
        }
        Blockly.Events.setGroup('load');
        addLoadersFirst(xml).then(
            loaders => {
                const addedBlocks = [
                    ...loaders,
                    ...Array.from(xml.children)
                        .map(block => addDomAsBlock(block))
                        .filter(b => b),
                ];
                cleanUpOnLoad(addedBlocks, dropEvent);
                fixCollapsedBlocks();
                globalObserver.emit('ui.log.success', translate('Blocks are loaded successfully'));
            },
            e => {
                throw e;
            }
        );
    };

    loadWorkspace = xml => {
        if (!strategyHasValidTradeTypeCategory(xml)) return;
        if (this.marketsWereRemoved(xml)) return;

        Blockly.Events.setGroup('load');
        Blockly.mainWorkspace.clear();

        Array.from(xml.children).forEach(block => {
            backwardCompatibility(block);
        });

        fixArgumentAttribute(xml);
        Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
        addLoadersFirst(xml).then(
            () => {
                fixCollapsedBlocks();
                Blockly.Events.setGroup(false);
                globalObserver.emit('ui.log.success', translate('Blocks are loaded successfully'));
            },
            e => {
                Blockly.Events.setGroup(false);
                throw e;
            }
        );
    };

    marketsWereRemoved = xml => {
        if (!Array.from(xml.children).every(block => !removeUnavailableMarkets(block))) {
            if (window.trackJs) {
                trackJs.track('Invalid financial market');
            }
            alert('This strategy is not available in your country');
            return true;
        }
        return false;
    };

    readFile = (f, dropEvent = {}) => {
        const reader = new FileReader();
        reader.onload = e => this.load(e.target.result, dropEvent);
        reader.readAsText(f);
    };
}
