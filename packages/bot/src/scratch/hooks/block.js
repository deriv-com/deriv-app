import config from '../../constants';

Blockly.Block.prototype.getDisplayName = function() {
    if (this.meta) {
        const block_meta = this.meta();
        return block_meta && block_meta.display_name;
    }
    return this.type;
};

Blockly.Block.prototype.getSiblings = function() {
    const siblings = [this];
    ['getPreviousBlock', 'getNextBlock'].forEach(functionName => {
        let block = this[functionName]();
        while (block !== null) {
            const parent = this.getParent();
            if (parent && parent.id === block.id) {
                break;
            }

            siblings.push(block);
            block = block[functionName]();
        }
    });
    return siblings;
};

Blockly.Block.prototype.getChildByType = function(type) {
    return this.getDescendants().find(child => child.type === type);
};

Blockly.Block.prototype.getChildFieldValue = function(childType, childField) {
    const childBlock = this.getChildByType(childType);
    if (childBlock) {
        const value = childBlock.getFieldValue(childField);
        return value;
    }
    return null;
};

Blockly.Block.prototype.childValueToCode = function(childType, childField) {
    const childBlock = this.getChildByType(childType);
    return childBlock && Blockly.JavaScript.valueToCode(childBlock, childField, Blockly.JavaScript.ORDER_ATOMIC);
};

Blockly.Block.prototype.getBlocksInStatement = function(statementInputName) {
    const blocksInStatement = [];
    const firstBlock = this.getInputTargetBlock(statementInputName);

    if (firstBlock) {
        return firstBlock.getSiblings();
    }
    return blocksInStatement;
};

Blockly.Block.prototype.getLastConnectionInStatement = function(statement_input_name) {
    const first_block_in_stack = this.getInputTargetBlock(statement_input_name);

    if (first_block_in_stack) {
        return first_block_in_stack.lastConnectionInStack();
    }

    const statement_input = this.getInput(statement_input_name);
    return statement_input.connection;
};

Blockly.Block.prototype.isDescendantOf = function(type) {
    let parentBlock = this.getParent();
    while (parentBlock !== null) {
        if (parentBlock.type === type) {
            return true;
        }
        parentBlock = parentBlock.getParent();
    }
    return false;
};

Blockly.Block.prototype.getTopParent = function() {
    let parent = this.getParent();
    while (parent !== null) {
        const nextParent = parent.getParent();
        if (!nextParent) {
            return parent;
        }
        parent = nextParent;
    }
    return null;
};

Blockly.Block.getDimensions = function(block_node) {
    const options = new Blockly.Options({ media: `${__webpack_public_path__}media/` });
    const fragment = document.createDocumentFragment();
    const el_injection_div = document.createElement('div');

    fragment.appendChild(el_injection_div);

    // Create a headless workspace to calculate xmlList block dimensions
    const svg = Blockly.createDom_(el_injection_div, options);
    const workspace = Blockly.createMainWorkspace_(svg, options, false, false);

    const block = Blockly.Xml.domToBlock(block_node, workspace);
    const block_hw = block.getHeightWidth();

    workspace.dispose();

    return block_hw;
};

Blockly.Block.prototype.isMainBlock = function() {
    return config.mainBlocks.includes(this.type);
};

Blockly.Block.prototype.isIndependentBlock = function() {
    return config.INDEPEDENT_BLOCKS.includes(this.type);
};

/**
 * Return the parent block or null if this block is at the top level.
 * @return {Blockly.Block} The block that holds the current block.
 */
Blockly.Block.prototype.getRootInputTargetBlock = function() {
    let input_name;
    let current_block = this.getParent();

    while (current_block) {
        const root_block = this.getRootBlock();
        const current_input = root_block.getInputWithBlock(current_block);

        if (current_input && current_input.name) {
            input_name = current_input.name;
        }

        current_block = current_block.getParent();
    }

    return input_name;
};

Blockly.Block.isDynamic = function(block_type) {
    return /^((procedures_)|(variables_)|(math_change$))/.test(block_type);
};

