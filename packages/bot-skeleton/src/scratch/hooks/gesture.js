/**
 * Update this gesture to record whether a block is being dragged from the
 * flyout. This function should be called on a mouse/touch move event the first time the
 * drag radius is exceeded.  It should be called no more than once per gesture.
 * If a block should be dragged from the flyout this function creates the new
 * block on the main workspace and updates targetBlock_ and startWorkspace_.
 * @return {boolean} True if a block is being dragged from the flyout.
 * @private
 */
Blockly.Gesture.prototype.updateIsDraggingFromFlyout_ = function() {
    // Disabled blocks may not be dragged from the flyout.
    if (this.targetBlock_.disabled) {
        return false;
    }
    
    if (!this.flyout_.isScrollable() ||
        this.flyout_.isDragTowardWorkspace(this.currentDragDeltaXY_)) {
        this.startWorkspace_ = this.flyout_.targetWorkspace_;
        this.startWorkspace_.updateScreenCalculationsIfScrolled();

        // Start the event group now, so that the same event group is used for block
        // creation and block dragging.
        if (!Blockly.Events.getGroup()) {
            Blockly.Events.setGroup(true);
        }

        // The start block is no longer relevant, because this is a drag.
        this.startBlock_ = null;
        this.targetBlock_ = this.flyout_.createBlock(this.mostRecentEvent_, this.targetBlock_);
        this.targetBlock_.select();
        return true;
    }
    return false;
};
