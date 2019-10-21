import { saveAs } from './shared';
import config     from '../constants';
import ApiHelpers from '../services/api/api-helpers';

export const isMainBlock = block_type => config.mainBlocks.indexOf(block_type) >= 0;

export const oppositesToDropdownOptions = opposite_name => {
    return opposite_name.map(contract_type => {
        // i.e. [['CALL', translate('Rise')]] becomes [[translate('Rise'), 'CALL']];
        return Object.entries(contract_type)[0].reverse();
    });
};

export const cleanUpOnLoad = (blocks_to_clean, drop_event) => {
    const { clientX = 0, clientY = 0 } = drop_event || {};
    const toolbar_height = 76;
    const blockly_metrics = Blockly.derivWorkspace.getMetrics();
    const scale_cancellation = 1 / Blockly.derivWorkspace.scale;
    const blockly_left = blockly_metrics.absoluteLeft - blockly_metrics.viewLeft;
    const blockly_top = document.body.offsetHeight - blockly_metrics.viewHeight - blockly_metrics.viewTop;
    const cursor_x = clientX ? (clientX - blockly_left) * scale_cancellation : 0;
    const cursor_y = clientY ? (clientY - blockly_top - toolbar_height) * scale_cancellation : 0;
    
    Blockly.derivWorkspace.cleanUp(cursor_x, cursor_y, blocks_to_clean);
};

export const setBlockTextColor = block => {
    Blockly.Events.recordUndo = false;
    if (block.inputList instanceof Array) {
        Array.from(block.inputList).forEach(inp =>
            inp.fieldRow.forEach(field => {
                if (field instanceof Blockly.FieldLabel) {
                    const svgElement = field.getSvgRoot();
                    if (svgElement) {
                        svgElement.setAttribute('class', 'blocklyTextRootBlockHeader');
                    }
                }
            })
        );
    }
    const field = block.getField();
    if (field) {
        const svgElement = field.getSvgRoot();
        if (svgElement) {
            svgElement.setAttribute('class', 'blocklyTextRootBlockHeader');
        }
    }
    Blockly.Events.recordUndo = true;
};

const getCollapsedProcedures = () =>
    Blockly.derivWorkspace
        .getTopBlocks()
        // eslint-disable-next-line no-underscore-dangle
        .filter(block => !isMainBlock(block.type) && block.collapsed_ && block.type.indexOf('procedures_def') === 0);

export const fixCollapsedBlocks = () =>
    getCollapsedProcedures().forEach(block => {
        block.setCollapsed(false);
        block.setCollapsed(true);
    });

export const save = (filename = 'deriv-bot', collection = false, xmlDom) => {
    xmlDom.setAttribute('collection', collection ? 'true' : 'false');
    const data = Blockly.Xml.domToPrettyText(xmlDom);
    saveAs({ data, type: 'text/xml;charset=utf-8', filename: `${filename}.xml` });
};

const isProcedure = blockType => ['procedures_defreturn', 'procedures_defnoreturn'].indexOf(blockType) >= 0;

// dummy event to recover deleted blocks loaded by loader
class DeleteStray extends Blockly.Events.Abstract {
    constructor(block) {
        super(block);
        this.run(true);
    }

    run(redo) {
        const { recordUndo } = Blockly.Events;
        Blockly.Events.recordUndo = false;
        const sourceBlock = Blockly.derivWorkspace.getBlockById(this.blockId);
        if (!sourceBlock) {
            return;
        }
        if (redo) {
            sourceBlock.setFieldValue(`${sourceBlock.getFieldValue('NAME')} (deleted)`, 'NAME');
            sourceBlock.setDisabled(true);
        } else {
            sourceBlock.setFieldValue(sourceBlock.getFieldValue('NAME').replace(' (deleted)', ''), 'NAME');
            sourceBlock.setDisabled(false);
        }
        Blockly.Events.recordUndo = recordUndo;
    }
}
DeleteStray.prototype.type = 'deletestray';

export const deleteBlocksLoadedBy = (id, event_group = true) => {
    Blockly.Events.setGroup(event_group);
    Blockly.derivWorkspace.getTopBlocks().forEach(block => {
        if (block.loaderId === id) {
            if (isProcedure(block.type)) {
                if (block.getFieldValue('NAME').indexOf('deleted') < 0) {
                    Blockly.Events.fire(new DeleteStray(block));
                }
            } else {
                block.dispose();
            }
        }
    });
    Blockly.Events.setGroup(false);
};

export const addDomAsBlock = block_xml => {
    if (block_xml.tagName === 'variables') {
        return Blockly.Xml.domToVariables(block_xml, Blockly.derivWorkspace);
    }
    const blockType = block_xml.getAttribute('type');
    if (isMainBlock(blockType)) {
        Blockly.derivWorkspace
            .getTopBlocks()
            .filter(b => b.type === blockType)
            .forEach(b => b.dispose());
    }
    return Blockly.Xml.domToBlock(block_xml, Blockly.derivWorkspace);
};

export const load = (block_string = '', drop_event) => {
    try {
        const xmlDoc = new DOMParser().parseFromString(block_string, 'application/xml');

        if (xmlDoc.getElementsByTagName('parsererror').length) {
            throw new Error();
        }
    } catch (e) {
        // TODO
        console.error(e);  // eslint-disable-line
    }

    let xml;
    try {
        xml = Blockly.Xml.textToDom(block_string);
        xml = updateRenamedMarkets(xml);
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
            loadBlocks(xml, drop_event);
        } else {
            loadWorkspace(xml);
        }
    } catch (e) {
        console.error(e); // eslint-disable-line
        // TODO
        console.error('XML file contains unsupported elements. Please check or modify file.');  // eslint-disable-line
    }
};

const loadBlocks = (xml, drop_event) => {
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
    if (drop_event && Object.keys(drop_event).length !== 0) {
        cleanUpOnLoad(addedBlocks, drop_event);
    } else {
        workspace.cleanUp();
    }

    fixCollapsedBlocks();
    Blockly.Events.setGroup(false);
};

const loadWorkspace = (xml) => {
    const workspace = Blockly.derivWorkspace;

    Blockly.Events.setGroup('load');
    workspace.clear();

    Blockly.Xml.domToWorkspace(xml, workspace);
    fixCollapsedBlocks();
    Blockly.Events.setGroup(false);
};

// TODO: Refactor this into backward compatibility.
const updateRenamedMarkets = (xml) => {
    const el_market_list = xml.querySelector('field[name="MARKET_LIST"]');
    
    if (el_market_list) {
        const { active_symbols } = ApiHelpers.instance;
        const market_value       = el_market_list.innerText;
        const renamed_fields     = { volidx: 'synthetic_index' };
        const market_options     = Object.keys(active_symbols.processed_symbols).reduce(
            (initial_value, current_value) => {
                if (!initial_value.includes(current_value)) {
                    initial_value.push(current_value);
                }
                return initial_value;
            }, []
        );

        if (market_options.includes(renamed_fields[market_value])) {
            el_market_list.innerText = renamed_fields[market_value];
        }
    }
    
    return xml;
};
