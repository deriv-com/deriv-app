/**
 * Update this gesture to record whether a block is being dragged from the
 * flyout. This function should be called on a mouse/touch move event the first time the
 * drag radius is exceeded.  It should be called no more than once per gesture.
 * If a block should be dragged from the flyout this function creates the new
 * block on the main workspace and updates targetBlock_ and startWorkspace_.
 * @return {boolean} True if a block is being dragged from the flyout.
 * @private
 */
Blockly.Gesture.prototype.updateIsDraggingFromFlyout = function () {
    // Disabled blocks may not be dragged from the flyout.
    if (this.targetBlock.disabled) {
        return false;
    }

    if (!this.flyout.isScrollable() || this.flyout.isDragTowardWorkspace(this.currentDragDeltaXY)) {
        this.startWorkspace_ = this.flyout.targetWorkspace;
        this.startWorkspace_.updateScreenCalculationsIfScrolled();

        // Start the event group now, so that the same event group is used for block
        // creation and block dragging.
        if (!Blockly.Events.getGroup()) {
            Blockly.Events.setGroup(true);
        }

        // The start block is no longer relevant, because this is a drag.
        this.startBlock = null;
        this.targetBlock = this.flyout.createBlock(this.mostRecentEvent, this.targetBlock);
        this.targetBlock.select();
        return true;
    }
    return false;
};
