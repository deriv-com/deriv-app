import { localize } from '@deriv/translations';
import { config } from '../../constants/config';

/**
 * Make a context menu option for duplicating the current block.
 * deriv-bot: Use Blockly's implementation.
 * @param {!Blockly.BlockSvg} block The block where the right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.blockDuplicateOption = function(block) {
    const enabled = !config.single_instance_blocks.includes(block.type);
    const duplicate_option = {
        callback() {
            Blockly.duplicate_(block);
        },
        enabled,
        text: localize('Duplicate'),
    };
    return duplicate_option;
};

/**
 * Make a context menu option for cleaning up blocks on the workspace, by
 * aligning them vertically.
 * @param {!Blockly.WorkspaceSvg} ws The workspace where the right-click originated.
 * @param {number} numTopBlocks The number of top blocks on the workspace.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.wsCleanupOption = function(ws, numTopBlocks) {
    return {
        text: localize('Rearrange Vertically'),
        enabled: numTopBlocks > 1,
        callback: ws.cleanUp.bind(ws),
    };
};

/**
 * Make a context menu option for collapsing all block stacks on the workspace.
 * @param {boolean} hasExpandedBlocks Whether there are any non-collapsed blocks
 *     on the workspace.
 * @param {!Array.<!Blockly.BlockSvg>} topBlocks The list of top blocks on the
 *     the workspace.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.wsCollapseOption = function(hasExpandedBlocks, topBlocks) {
    return {
        enabled: hasExpandedBlocks,
        text: localize('Collapse All Blocks'),
        callback() {
            Blockly.ContextMenu.toggleCollapseFn_(topBlocks, true);
        },
    };
};

/**
 * Make a context menu option for expanding all block stacks on the workspace.
 * @param {boolean} hasCollapsedBlocks Whether there are any collapsed blocks
 *     on the workspace.
 * @param {!Array.<!Blockly.BlockSvg>} topBlocks The list of top blocks on the
 *     the workspace.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.wsExpandOption = function(hasCollapsedBlocks, topBlocks) {
    return {
        enabled: hasCollapsedBlocks,
        text: localize('Expand All Blocks'),
        callback() {
            Blockly.ContextMenu.toggleCollapseFn_(topBlocks, false);
        },
    };
};

/**
 * Helper function for toggling delete state on blocks on the workspace, to be
 * called from a right-click menu.
 * deriv-bot: Remove "animation".
 * @param {!Array.<!Blockly.BlockSvg>} topBlocks The list of top blocks on the the workspace.
 * @param {boolean} shouldCollapse True if the blocks should be collapsed, false if they should be expanded.
 * @private
 */
Blockly.ContextMenu.toggleCollapseFn_ = function(blocks, shouldCollapse) {
    blocks.forEach(block => block.setCollapsed(shouldCollapse));
};
