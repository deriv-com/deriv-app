import { localize } from '@deriv/translations';
import { config } from '../../constants/config';

/**
 * Make a context menu option for duplicating the current block.
 * deriv-bot: Use Blockly's implementation.
 * @param {!Blockly.BlockSvg} block The block where the right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.blockDuplicateOption = function (block) {
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
Blockly.ContextMenu.wsCleanupOption = function (ws, numTopBlocks) {
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
Blockly.ContextMenu.wsCollapseOption = function (hasExpandedBlocks, topBlocks) {
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
Blockly.ContextMenu.wsExpandOption = function (hasCollapsedBlocks, topBlocks) {
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
Blockly.ContextMenu.toggleCollapseFn_ = function (blocks, shouldCollapse) {
    blocks.forEach(block => block.setCollapsed(shouldCollapse));
};

Blockly.ContextMenu.wsDeleteOption = function (ws, blocks) {
    // Option to delete all blocks.
    // Count the number of blocks that are deletable.
    const delete_list = Blockly.WorkspaceSvg.buildDeleteList_(blocks);

    // Scratch-specific: don't count shadow blocks in delete count
    const delete_count = delete_list.filter(block => !block.isShadow()).length;

    const event_group = Blockly.utils.genUid();
    const DELAY = 10;

    const deleteNext = () => {
        Blockly.Events.setGroup(event_group);
        const block = delete_list.shift();

        if (block) {
            if (block.workspace) {
                block.dispose(false, true);
                setTimeout(deleteNext, DELAY);
            } else {
                deleteNext();
            }
        }
        Blockly.Events.setGroup(false);
    };

    return {
        text:
            delete_count === 1
                ? localize('Delete Block')
                : localize('Delete {{ delete_count }} Blocks', { delete_count }),
        enabled: delete_count > 0,
        callback() {
            if (ws.currentGesture_) {
                ws.currentGesture_.cancel();
            }
            if (delete_count < 2) {
                deleteNext();
            } else {
                const msg = localize('Delete all {{ delete_count }} blocks?', { delete_count });
                Blockly.confirm(msg, ok => {
                    if (ok) {
                        deleteNext();
                    }
                });
            }
        },
    };
};

/**
 * Make a context menu option for adding or removing comments on the current block.
 * deriv-bot: Expand block before adding comment.
 * Hacky way to get comments working on collapsed blocks.
 * @param {!Blockly.BlockSvg} block The block where the right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.blockCommentOption = function (block) {
    const comment_option = { enabled: !goog.userAgent.IE };

    // If there's already a comment, add an option to delete it.
    if (block.comment) {
        comment_option.text = localize('Remove comment');
        comment_option.callback = () => {
            block.setCommentText(null);
        };
    } else {
        // If there's no comment, add an option to create a comment.
        comment_option.text = localize('Add comment');
        comment_option.callback = () => {
            // deriv-bot: Expand/uncollapse for bubble to position correctly.
            const is_collapsed = block.collapsed_;

            if (is_collapsed) {
                block.setCollapsed(false);
            }

            block.setCommentText('');

            if (block.collapsed_ !== is_collapsed) {
                block.setCollapsed(is_collapsed);
            }

            // deriv-bot: Don't focus to prevent workspace glitching.
            // block.comment.focus();
        };
    }

    return comment_option;
};

/**
 * Make a context menu option for detaching the current block.
 * deriv-bot: Use Blockly's implementation.
 * @param {!Blockly.BlockSvg} block The block where the right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.blockDetachOption = function (block) {
    const canDisconnect = block
        .getConnections_()
        .some(connection => connection.isConnected() && !connection.targetConnection?.sourceBlock_.isShadow_);

    const enabled = block.parentBlock_ && canDisconnect;

    const detach_option = {
        callback() {
            block.unplug(true);
            block.moveBy(250, 100);
        },
        enabled,
        text: localize('Detach Block'),
    };
    return detach_option;
};

/**
 * Make a context menu option for disabling stack of blocks.
 * deriv-bot: Use Blockly’s implementation.
 * @param {!Blockly.BlockSvg} block The block where the right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.blockDisableOption = function (block) {
    const checkAreSomeEnabled = (block_, enabledArr = []) => {
        enabledArr.push(!block_.disabled);
        return block_.nextConnection?.targetConnection
            ? checkAreSomeEnabled(block_.nextConnection?.targetConnection.sourceBlock_, enabledArr)
            : enabledArr.includes(true);
    };
    const enabled = checkAreSomeEnabled(block);

    const disableBlocksRecursively = block_ => {
        block_.setDisabled(true);
        if (block_.nextConnection?.targetConnection) {
            disableBlocksRecursively(block_.nextConnection?.targetConnection.sourceBlock_);
        }
    };

    const disableStack_option = {
        callback() {
            disableBlocksRecursively(block);
        },
        enabled,
        text: localize('Disable stack'),
    };
    return disableStack_option;
};

/**
 * Make a context menu option for enabling stack of blocks.
 * deriv-bot: Use Blockly’s implementation.
 * @param {!Blockly.BlockSvg} block The block where the right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.blockEnableOption = function (block) {
    const checkAreSomeDisabled = (block_, disabledArr = []) => {
        if (block_.restricted_parents && !block_.restricted_parents?.includes(block_.getTopParent()?.type)) {
            return false;
        }
        disabledArr.push(block_.disabled);
        return block_.nextConnection?.targetConnection
            ? checkAreSomeDisabled(block_.nextConnection?.targetConnection.sourceBlock_, disabledArr)
            : disabledArr.includes(true);
    };
    const enabled = checkAreSomeDisabled(block);

    const enableBlocksRecursively = block_ => {
        if (!block_.restricted_parents || block_.restricted_parents.includes(block_.getTopParent()?.type)) {
            block_.setDisabled(false);
        }
        if (block_.nextConnection?.targetConnection) {
            enableBlocksRecursively(block_.nextConnection?.targetConnection.sourceBlock_);
        }
    };

    const enableStack_option = {
        callback() {
            enableBlocksRecursively(block);
        },
        enabled,
        text: localize('Enable stack'),
    };
    return enableStack_option;
};
