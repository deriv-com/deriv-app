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

