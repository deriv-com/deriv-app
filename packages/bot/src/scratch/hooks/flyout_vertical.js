/* eslint-disable func-names, no-underscore-dangle */
// deriv-bot: Blockly value, Scratch resets this to, req for correct spacing in flyout.
Blockly.BlockSvg.TAB_WIDTH = 8;

/**
 * Move the flyout to the edge of the workspace.
 * deriv-bot: Custom dimensions for flyout & support dynamic widths.
 */
Blockly.VerticalFlyout.prototype.position = function() {
    if (!this.isVisible()) {
        return;
    }

    const targetWorkspaceMetrics = this.targetWorkspace_.getMetrics();
    if (!targetWorkspaceMetrics) {
        // Hidden components will return null.
        return;
    }

    // Record the height for Blockly.Flyout.getMetrics_
    // deriv-bot: Set to workspace height
    this.height_ = targetWorkspaceMetrics.viewHeight - 40;

    const edgeWidth = this.width_ - this.CORNER_RADIUS;
    // deriv-bot: use this.height_ instead of targetWorkspaceMetrics.viewHeight
    const edgeHeight = this.height_ - 2 * this.CORNER_RADIUS;
    
    this.setBackgroundPath_(edgeWidth, edgeHeight);

    // deriv-bot: Ensure flyout is rendered at same y-point as parent toolbox.
    const y = this.parentToolbox_.HtmlDiv.offsetTop;
    let x;

    // If this flyout is the toolbox flyout.
    if (this.targetWorkspace_.toolboxPosition === this.toolboxPosition_) {
        // If there is a category toolbox.
        if (targetWorkspaceMetrics.toolboxWidth) {
            if (this.toolboxPosition_ === Blockly.TOOLBOX_AT_LEFT) {
                // deriv-bot: Allow for dynamic toolbox width.
                x = this.parentToolbox_.HtmlDiv.clientWidth + Blockly.BlockSvg.TAB_WIDTH;
            } else {
                x = targetWorkspaceMetrics.viewWidth - this.width_;
            }
        } else if (this.toolboxPosition_ === Blockly.TOOLBOX_AT_LEFT) {
            x = 0;
        } else {
            x = targetWorkspaceMetrics.viewWidth;
        }
    } else if (this.toolboxPosition_ === Blockly.TOOLBOX_AT_LEFT) {
        x = 0;
    } else {
        // Because the anchor point of the flyout is on the left, but we want
        // to align the right edge of the flyout with the right edge of the
        // blocklyDiv, we calculate the full width of the div minus the width
        // of the flyout.
        x = targetWorkspaceMetrics.viewWidth + targetWorkspaceMetrics.absoluteLeft - this.width_;
    }

    this.positionAt_(this.width_, this.height_, x, y);
};

/**
 * Compute width of flyout.  Position mat under each block.
 * For RTL: Lay out the blocks and buttons to be right-aligned.
 * deriv-bot: Allow for dynamic width flyout.
 * @private
 */
Blockly.VerticalFlyout.prototype.reflowInternal_ = function() {
    this.workspace_.scale = this.targetWorkspace_.scale;
    let flyoutWidth = 0;
    const blocks = this.workspace_.getTopBlocks(false);

    blocks.forEach(block => {
        let { width } = block.getHeightWidth();
        if (block.outputConnection) {
            width -= Blockly.BlockSvg.TAB_WIDTH;
        }
        flyoutWidth = Math.max(flyoutWidth, width);
    });

    this.buttons_.forEach(button => {
        flyoutWidth = Math.max(flyoutWidth, button.width);
    });

    flyoutWidth += this.MARGIN * 1.5 + Blockly.BlockSvg.TAB_WIDTH;
    flyoutWidth *= this.workspace_.scale;
    flyoutWidth += Blockly.Scrollbar.scrollbarThickness;

    if (this.width_ !== flyoutWidth) {
        blocks.forEach(block => {
            if (this.RTL) {
                // With the flyoutWidth known, right-align the blocks.
                const oldX = block.getRelativeToSurfaceXY().x;
                const newX = flyoutWidth / this.workspace_.scale - this.MARGIN - Blockly.BlockSvg.TAB_WIDTH;

                block.moveBy(newX - oldX, 0);
            }
        });

        if (this.RTL) {
            // With the flyoutWidth known, right-align the buttons.
            this.buttons_.forEach(button => {
                const { y } = button.getPosition();
                const x = flyoutWidth / this.workspace_.scale - button.width - this.MARGIN - Blockly.BlockSvg.TAB_WIDTH;

                button.moveTo(x, y);
            });
        }
        
        // Record the width for .getMetrics_ and .position.
        this.width_ = flyoutWidth;
        this.position();
    }
};
