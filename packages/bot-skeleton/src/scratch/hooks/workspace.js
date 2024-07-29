import DBotStore from '../dbot-store';
import PendingPromise from '../../utils/pending-promise';

Blockly.Workspace.prototype.wait_events = [];
/**
 * Clear the undo/redo stacks.
 * deriv-bot: Sync undo/redo stack with our toolbar store.
 */
Blockly.Workspace.prototype.clearUndo = function () {
    this.undoStack_.length = 0;
    this.redoStack_.length = 0;

    const { toolbar } = DBotStore.instance;

    toolbar.setHasRedoStack();
    toolbar.setHasUndoStack();

    // Stop any events already in the firing queue from being undoable.
    Blockly.Events.clearPendingUndo();
};

/**
 * Fire a change event.
 * deriv-bot: Sync undo/redo stack with our toolbar store.
 * @param {!Blockly.Events.Abstract} event Event to fire.
 */
Blockly.Workspace.prototype.fireChangeListener = function (event) {
    if (event.recordUndo) {
        this.undoStack_.push(event);
        this.redoStack_.length = 0;

        if (this.undoStack_.length > this.MAX_UNDO) {
            this.undoStack_.unshift();
        }

        const { toolbar } = DBotStore.instance;

        toolbar.setHasRedoStack();
        toolbar.setHasUndoStack();
    }

    // Copy listeners in case a listener attaches/detaches itself.
    const current_listeners = this.listeners.slice();

    current_listeners.forEach(listener => {
        listener(event);
    });
    /**
     * Gets a trade definition block instance and returns it.
     * @returns {Blockly.Block|null} The trade definition or null.
     */
};

Blockly.Workspace.prototype.getTradeDefinitionBlock = function () {
    return this.getAllBlocks(true).find(b => b.type === 'trade_definition');
};

Blockly.Workspace.prototype.waitForBlockEvent = function (block_id, opt_event_type = null) {
    const event_promise = new PendingPromise();

    if (!this.wait_events.some(event => event.blockId === block_id && event.type === opt_event_type)) {
        this.wait_events.push({
            blockId: block_id,
            promise: event_promise,
            type: opt_event_type,
        });
    }

    return event_promise;
};

Blockly.Workspace.prototype.waitForBlockEvent = function (options) {
    const { block_type, event_type, timeout } = options;
    const promise = new PendingPromise();

    this.wait_events.push({ block_type, event_type, promise });

    if (timeout) {
        setTimeout(() => {
            if (promise.isPending) {
                promise.reject();
            }
        }, timeout);
    }

    return promise;
};

Blockly.Workspace.prototype.dispatchBlockEventEffects = function (event) {
    this.wait_events.forEach((wait_event, idx) => {
        if (!event.blockId) {
            return;
        }

        const block = this.getBlockById(event.blockId);

        if (block) {
            const is_same_block_type = wait_event.block_type === block.type;
            const is_same_event_type = wait_event.event_type === null || wait_event.event_type === event.type;

            if (is_same_block_type && is_same_event_type) {
                setTimeout(() => {
                    wait_event.promise.resolve();
                    this.wait_events.splice(idx, 1);
                }, 500);
            }
        }
    });
};

Blockly.Workspace.prototype.getAllFields = function (is_ordered) {
    return this.getAllBlocks(is_ordered).reduce((fields, block) => {
        block.inputList.forEach(input => fields.push(...input.fieldRow));
        return fields;
    }, []);
};

/* eslint-disble */
/**
 * Create a main workspace and add it to the SVG.
 * @param {!Element} svg SVG element with pattern defined.
 * @param {!Blockly.Options} options Dictionary of options.
 * @param {!Blockly.BlockDragSurfaceSvg} blockDragSurface Drag surface SVG
 *     for the blocks.
 * @param {!Blockly.WorkspaceDragSurfaceSvg} workspaceDragSurface Drag surface
 *     SVG for the workspace.
 * @return {!Blockly.Workspace} Newly created main workspace.
 * @private
 */

Blockly.createVirtualWorkspace_ = function (fragment, options, blockDragSurface, workspaceDragSurface) {
    options.parentWorkspace = null;
    const mainWorkspace = new Blockly.WorkspaceSvg(options, blockDragSurface, workspaceDragSurface);
    mainWorkspace.scale = options.zoomOptions.startScale;
    fragment.appendChild(mainWorkspace.createDom('blocklyMainBackground'));

    return mainWorkspace;
};

// Blockly.Xml.domToWorkspace = function (xml, workspace) {
//     if (xml instanceof Blockly.Workspace) {
//         var swap = xml;
//         xml = workspace;
//         workspace = swap;
//         console.warn('Deprecated call to Blockly.Xml.domToWorkspace, ' +
//             'swap the arguments.');
//     }
//     var width;  // Not used in LTR.
//     if (workspace.RTL) {
//         width = workspace.getWidth();
//     }
//     var newBlockIds = [];  // A list of block IDs added by this call.
//     //Blockly.Field.startCache();
//     // Safari 7.1.3 is known to provide node lists with extra references to
//     // children beyond the lists' length.  Trust the length, do not use the
//     // looping pattern of checking the index for an object.
//     var childCount = xml.childNodes.length;
//     var existingGroup = Blockly.Events.getGroup();
//     if (!existingGroup) {
//         Blockly.Events.setGroup(true);
//     }

//     // Disable workspace resizes as an optimization.
//     if (workspace.setResizesEnabled) {
//         workspace.setResizesEnabled(false);
//     }
//     var variablesFirst = true;
//     try {
//         for (var i = 0; i < childCount; i++) {
//             var xmlChild = xml.childNodes[i];
//             var name = xmlChild.nodeName.toLowerCase();
//             if (name == 'block' ||
//                 (name == 'shadow' && !Blockly.Events.recordUndo)) {
//                 // Allow top-level shadow blocks if recordUndo is disabled since
//                 // that means an undo is in progress.  Such a block is expected
//                 // to be moved to a nested destination in the next operation.
//                 var block = Blockly.Xml.domToBlock(xmlChild, workspace);
//                 newBlockIds.push(block.id);
//                 var blockX = xmlChild.hasAttribute('x') ?
//                     parseInt(xmlChild.getAttribute('x'), 10) : 10;
//                 var blockY = xmlChild.hasAttribute('y') ?
//                     parseInt(xmlChild.getAttribute('y'), 10) : 10;
//                 if (!isNaN(blockX) && !isNaN(blockY)) {
//                     block.moveBy(workspace.RTL ? width - blockX : blockX, blockY);
//                     if (block.comment && typeof block.comment === 'object') {
//                         var commentXY = block.comment.getXY();
//                         var commentWidth = block.comment.getBubbleSize().width;
//                         block.comment.moveTo(block.workspace.RTL ? width - commentXY.x - commentWidth : commentXY.x, commentXY.y);
//                     }
//                 }
//                 variablesFirst = false;
//             } else if (name == 'shadow') {
//                 goog.asserts.fail('Shadow block cannot be a top-level block.');
//                 variablesFirst = false;
//             } else if (name == 'comment') {
//                 if (workspace.rendered) {
//                     Blockly.WorkspaceCommentSvg.fromXml(xmlChild, workspace, width);
//                 } else {
//                     Blockly.WorkspaceComment.fromXml(xmlChild, workspace);
//                 }
//             } else if (name == 'variables') {
//                 if (variablesFirst) {
//                     Blockly.Xml.domToVariables(xmlChild, workspace);
//                 } else {
//                     throw Error('\'variables\' tag must exist once before block and ' +
//                         'shadow tag elements in the workspace XML, but it was found in ' +
//                         'another location.');
//                 }
//                 variablesFirst = false;
//             }
//         }
//     } finally {
//         if (!existingGroup) {
//             Blockly.Events.setGroup(false);
//         }
//        // Blockly.Field.stopCache();
//     }
//     // Re-enable workspace resizing.
//     if (workspace.setResizesEnabled) {
//         //workspace.setResizesEnabled(true);
//     }
//     return newBlockIds;
// };
