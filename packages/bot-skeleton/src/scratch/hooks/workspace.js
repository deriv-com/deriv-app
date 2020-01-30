import DBotStore      from '../dbot-store';
import PendingPromise from '../../utils/pending-promise';

Blockly.Workspace.prototype.wait_events = [];

/**
 * Clear the undo/redo stacks.
 * deriv-bot: Sync undo/redo stack with our toolbar store.
 */
Blockly.Workspace.prototype.clearUndo = function() {
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
Blockly.Workspace.prototype.fireChangeListener = function(event) {
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
    const current_listeners = this.listeners_.slice();
    
    current_listeners.forEach(listener => {
        listener(event);
    });
/**
 * Gets a trade definition block instance and returns it.
 * @returns {Blockly.Block|null} The trade definition or null.
 */
};

Blockly.Workspace.prototype.getTradeDefinitionBlock = function() {
    return this.getAllBlocks(true).find(b => b.type === 'trade_definition');
};

Blockly.Workspace.prototype.waitForBlockEvent = function(block_id, opt_event_type = null) {
    const event_promise = new PendingPromise();

    this.wait_events.push({
        blockId: block_id,
        promise: event_promise,
        type   : opt_event_type,
    });

    return event_promise;
};

Blockly.Workspace.prototype.dispatchBlockEventEffects = function(event) {
    this.wait_events.forEach((wait_event, idx) => {
        const is_subscribed_event =
            wait_event.blockId === event.blockId &&
            (wait_event.type === null || event.type === wait_event.type);

        if (is_subscribed_event) {
            wait_event.promise.resolve();
            this.wait_events.splice(idx, 1);
        }
    });
};
