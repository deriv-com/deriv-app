import { saveAs }                   from './shared';
import config                       from '../constants';

export const isMainBlock = blockType => config.mainBlocks.indexOf(blockType) >= 0;

export const oppositesToDropdownOptions = opposite_name => {
    return opposite_name.map(contract_type => {
        // i.e. [['CALL', translate('Rise')]] becomes [[translate('Rise'), 'CALL']];
        return Object.entries(contract_type)[0].reverse();
    });
};

export const cleanUpOnLoad = (blocksToClean, dropEvent) => {
    console.log(dropEvent); // eslint-disable-line
    const { clientX = 0, clientY = 0 } = dropEvent || {};
    const blocklyMetrics = Blockly.derivWorkspace.getMetrics();
    const scaleCancellation = 1 / Blockly.derivWorkspace.scale;
    const blocklyLeft = blocklyMetrics.absoluteLeft - blocklyMetrics.viewLeft;
    const blocklyTop = document.body.offsetHeight - blocklyMetrics.viewHeight - blocklyMetrics.viewTop;
    const cursorX = clientX ? (clientX - blocklyLeft) * scaleCancellation : 0;
    let cursorY = clientY ? (clientY - blocklyTop) * scaleCancellation : 0;
    const toolbar_height = document.getElementById('toolbar').clientHeight;
    blocksToClean.forEach(block => {
        block.moveBy(cursorX, cursorY - toolbar_height);
        block.snapToGrid();
        cursorY += block.getHeightWidth().height + Blockly.BlockSvg.MIN_BLOCK_Y;
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
                    const svgElement = field.getSvgRoot();
                    if (svgElement) {
                        svgElement.style.setProperty('fill', 'white', 'important');
                    }
                }
            })
        );
    }
    const field = block.getField();
    if (field) {
        const svgElement = field.getSvgRoot();
        if (svgElement) {
            svgElement.style.setProperty('fill', 'white', 'important');
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

export const deleteBlocksLoadedBy = (id, eventGroup = true) => {
    Blockly.Events.setGroup(eventGroup);
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

export const fixArgumentAttribute = xml => {
    Array.from(xml.getElementsByTagName('arg')).forEach(o => {
        if (o.hasAttribute('varid')) o.setAttribute('varId', o.getAttribute('varid'));
    });
};

export const backwardCompatibility = block => {
    if (block.getAttribute('type') === 'on_strategy') {
        block.setAttribute('type', 'before_purchase');
    } else if (block.getAttribute('type') === 'on_finish') {
        block.setAttribute('type', 'after_purchase');
    }
    Array.from(block.getElementsByTagName('statement')).forEach(statement => {
        if (statement.getAttribute('name') === 'STRATEGY_STACK') {
            statement.setAttribute('name', 'BEFOREPURCHASE_STACK');
        } else if (statement.getAttribute('name') === 'FINISH_STACK') {
            statement.setAttribute('name', 'AFTERPURCHASE_STACK');
        }
    });
    if (isMainBlock(block.getAttribute('type'))) {
        block.removeAttribute('deletable');
    }
};

export const addDomAsBlock = blockXml => {
    if (blockXml.tagName === 'variables') {
        return Blockly.Xml.domToVariables(blockXml, Blockly.derivWorkspace);
    }
    const blockType = blockXml.getAttribute('type');
    if (isMainBlock(blockType)) {
        Blockly.derivWorkspace
            .getTopBlocks()
            .filter(b => b.type === blockType)
            .forEach(b => b.dispose());
    }
    return Blockly.Xml.domToBlock(blockXml, Blockly.derivWorkspace);
};
