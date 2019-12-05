/**
 * Move the bubble to a location relative to the anchor's centre.
 * deriv-bot: Initialise anchorXY if there are no values.
 * @private
 */
Blockly.Bubble.prototype.positionBubble_ = function() {
    if (!this.anchorXY_) {
        this.anchorXY_ = { x: 0, y: 0 };
    }

    let left = this.anchorXY_.x;

    if (this.workspace_.RTL) {
        left -= this.relativeLeft_ ;
    } else {
        left += this.relativeLeft_;
    }

    const top = this.relativeTop_ + this.anchorXY_.y;
    this.moveTo(left, top);
};

/**
 * Fire a create event for the given workspace comment, if comments are enabled.
 * @param {!Blockly.WorkspaceComment} comment The comment that was just created.
 * @package
 */
Blockly.ScratchBlockComment.fireCreateEvent = function(comment) {
    if (Blockly.Events.isEnabled()) {
        const existingGroup = Blockly.Events.getGroup();
        if (!existingGroup) {
            Blockly.Events.setGroup(true);
        }
        try {
            Blockly.Events.fire(new Blockly.Events.CommentCreate(comment));
        } finally {
            if (!existingGroup) {
                Blockly.Events.setGroup(false);
            }
        }
    }
};
