import { saveAs }                   from './shared';
import config                       from '../constants';

export const isMainBlock = block_type => config.mainBlocks.indexOf(block_type) >= 0;

export const oppositesToDropdownOptions = opposite_name => {
    return opposite_name.map(contract_type => {
        // i.e. [['CALL', translate('Rise')]] becomes [[translate('Rise'), 'CALL']];
        return Object.entries(contract_type)[0].reverse();
    });
};

export const cleanUpOnLoad = (blocks_to_clean, drop_event) => {
    const { clientX = 0, clientY = 0 } = drop_event || {};
    const blockly_metrics = Blockly.derivWorkspace.getMetrics();
    const scale_cancellation = 1 / Blockly.derivWorkspace.scale;
    const blockly_left = blockly_metrics.absoluteLeft - blockly_metrics.viewLeft;
    const blockly_top = document.body.offsetHeight - blockly_metrics.viewHeight - blockly_metrics.viewTop;
    const cursor_x = clientX ? (clientX - blockly_left) * scale_cancellation : 0;
    let cursor_y = clientY ? (clientY - blockly_top) * scale_cancellation : 0;
    const toolbar_height = 76;
    blocks_to_clean.forEach(block => {
        block.moveBy(cursor_x, cursor_y - toolbar_height);
        block.snapToGrid();
        cursor_y += block.getHeightWidth().height + Blockly.BlockSvg.MIN_BLOCK_Y;
    });
    // Fire an event to allow scrollbars to resize.
    Blockly.derivWorkspace.resizeContents();
};

export const setBlockTextColor = block => {
    Blockly.Events.recordUndo = false;
    if (block.inputList instanceof Array) {
        Array.from(block.inputList).forEach(inp =>
            inp.fieldRow.forEach(field => {
                if (field instanceof Blockly.FieldLabel) {
                    const svg_element = field.getSvgRoot();
                    if (svg_element) {
                        svg_element.style.setProperty('fill', 'white', 'important');
                    }
                }
            })
        );
    }
    const field = block.getField();
    if (field) {
        const svg_element = field.getSvgRoot();
        if (svg_element) {
            svg_element.style.setProperty('fill', 'white', 'important');
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

export const getBlockByType = type => Blockly.derivWorkspace.getAllBlocks().find(block => type === block.type);

export const getTopBlocksByType = type => Blockly.derivWorkspace.getTopBlocks().filter(block => type === block.type);

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
