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
    const toolbar_height = 76;
    const blockly_metrics = Blockly.derivWorkspace.getMetrics();
    const scale_cancellation = 1 / Blockly.derivWorkspace.scale;
    const blockly_left = blockly_metrics.absoluteLeft - blockly_metrics.viewLeft;
    const blockly_top = document.body.offsetHeight - blockly_metrics.viewHeight - blockly_metrics.viewTop;
    const cursor_x = clientX ? (clientX - blockly_left) * scale_cancellation : 0;
    const cursor_y = clientY ? (clientY - blockly_top - toolbar_height) * scale_cancellation : 0;
    
    // blocks_to_clean.forEach(block => {
    //     block.moveBy(cursor_x, cursor_y - toolbar_height);
    //     block.snapToGrid();
    //     cursor_y += block.getHeightWidth().height + Blockly.BlockSvg.MIN_BLOCK_Y;
    // });

    const root_blocks = blocks_to_clean.filter(block => block.isMainBlock()).sort((a, b) => {
        const blockIndex = (block) => config.mainBlocks.findIndex(c => c === block.type);
        return blockIndex(a) - blockIndex(b);
    });
    const column_count = 2;
    const blocks_per_column = Math.ceil(root_blocks.length / column_count);

    let temp_cursor_y = cursor_y;

    if (root_blocks.length) {
        let column_index = 0;

        root_blocks.forEach((block, index) => {
            if (index === (column_index + 1) * blocks_per_column) {
                temp_cursor_y = cursor_y;
                column_index++;
            }

            if (column_index === 0) {
                block.moveBy(cursor_x, temp_cursor_y);
            } else {
                const start = (column_index - 1) * blocks_per_column;
                const fat_neighbour_block = root_blocks
                    .slice(start, start + blocks_per_column)
                    .reduce((a, b) => a.getHeightWidth().width > b.getHeightWidth().width ? a : b);
            
                block.moveBy(
                    cursor_x +
                    fat_neighbour_block.getHeightWidth().width +
                    Blockly.BlockSvg.MIN_BLOCK_X,
                    temp_cursor_y
                );
            }

            block.snapToGrid();
            temp_cursor_y =
                block.getRelativeToSurfaceXY().y +
                block.getHeightWidth().height +
                Blockly.BlockSvg.MIN_BLOCK_Y;
        });

        const lowest_root_block = root_blocks.reduce((a, b) => {
            const a_metrics = a.getRelativeToSurfaceXY().y + a.getHeightWidth().height;
            const b_metrics = b.getRelativeToSurfaceXY().y + b.getHeightWidth().height;
            return a_metrics > b_metrics ? a : b;
        });

        temp_cursor_y =
            lowest_root_block.getRelativeToSurfaceXY().y +
            lowest_root_block.getHeightWidth().height +
            Blockly.BlockSvg.MIN_BLOCK_Y;
    }

    const filtered_top_blocks = blocks_to_clean.filter(block => !block.isMainBlock());

    filtered_top_blocks.forEach(block => {
        block.moveBy(cursor_x, temp_cursor_y);
        block.snapToGrid();
        temp_cursor_y = block.getRelativeToSurfaceXY().y + block.getHeightWidth().height + Blockly.BlockSvg.MIN_BLOCK_Y;
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

export const loadBlocks = (xml, drop_event = {}) => {
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

export const loadWorkspace = (xml) => {
    const workspace = Blockly.derivWorkspace;

    Blockly.Events.setGroup('load');
    workspace.clear();

    Blockly.Xml.domToWorkspace(xml, workspace);
    fixCollapsedBlocks();
    Blockly.Events.setGroup(false);
};
