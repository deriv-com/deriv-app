/* eslint-disable func-names, no-underscore-dangle */

// deriv-bot: We render an arrow pointing to the current category. This value
// determines the size of that arrow.
Blockly.VerticalFlyout.prototype.ARROW_SIZE = 15;

/**
 * Return an object with all the metrics required to size scrollbars for the
 * flyout.  The following properties are computed:
 * .viewHeight: Height of the visible rectangle,
 * .viewWidth: Width of the visible rectangle,
 * .contentHeight: Height of the contents,
 * .contentWidth: Width of the contents,
 * .viewTop: Offset of top edge of visible rectangle from parent,
 * .contentTop: Offset of the top-most content from the y=0 coordinate,
 * .absoluteTop: Top-edge of view.
 * .viewLeft: Offset of the left edge of visible rectangle from parent,
 * .contentLeft: Offset of the left-most content from the x=0 coordinate,
 * .absoluteLeft: Left-edge of view.
 * @return {Object} Contains size and position metrics of the flyout.
 * @private
 */
Blockly.VerticalFlyout.prototype.getMetrics_ = function() {
    if (!this.isVisible()) {
        // Flyout is hidden.
        return null;
    }
  
    const optionBox = this.getContentBoundingBox_();
  
    // Padding for the end of the scrollbar.
    const absoluteTop = this.SCROLLBAR_PADDING;
    const absoluteLeft = 0;
  
    // Add padding to the bottom of the flyout, so we can scroll to the top of
    // the last category. deriv-bot: Add some extra padding.
    const contentHeight = (optionBox.height + (this.SCROLLBAR_PADDING * 2)) * this.workspace_.scale;
    const bottomPadding = this.MARGIN;
    const metrics = {
        viewHeight   : this.height_ - this.MARGIN * 2,
        viewWidth    : this.getWidth() - this.SCROLLBAR_PADDING,
        contentHeight: contentHeight + bottomPadding,
        contentWidth : optionBox.width * this.workspace_.scale + 2 * this.MARGIN,
        viewTop      : -this.workspace_.scrollY + optionBox.y,
        viewLeft     : -this.workspace_.scrollX,
        contentTop   : optionBox.y,
        contentLeft  : optionBox.x,
        absoluteTop,
        absoluteLeft,
    };
    return metrics;
};

/**
 * Used to put the blocks on top of the flyout.
 * Lay out the blocks in the flyout.
 * @param {!Array.<!Object>} contents The blocks and buttons to lay out.
 * @param {!Array.<number>} gaps The visible gaps between blocks.
 * @private
 */
Blockly.VerticalFlyout.prototype.layout_ = function(contents, gaps) {
    // Take workspace scale into consideration for correct positioning
    const cursorX = (this.MARGIN / this.targetWorkspace_.scale) + this.CORNER_RADIUS;
    let cursorY = this.CORNER_RADIUS + this.SCROLLBAR_PADDING;
 
    contents.forEach((item, index) => {
        if (item.type === 'block') {
            const { block } = item;
            const root = block.getSvgRoot();
            const blockHW = block.getHeightWidth();

            // Mark blocks as being inside a flyout.  This is used to detect and
            // prevent the closure of the flyout if the user right-clicks on such a
            // block.
            const allBlocks = block.getDescendants(false);
            allBlocks.forEach(child => child.isInFlyout = true);

            // The block moves a bit extra for the hat, but the block's rectangle
            // doesn't.  That's because the hat actually extends up from 0.
            const extra_hat_height = (block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0);
            const rect = this.createRect_(block, cursorX, cursorY, blockHW, index);

            block.moveBy(cursorX, cursorY + extra_hat_height);
            this.addBlockListeners_(root, block, rect);
            cursorY += blockHW.height + gaps[index] + extra_hat_height;
            
        } else if (item.type === 'button') {
            // For both buttons and labels
            const { button } = item;
            const buttonSvg = button.createDom();

            button.moveTo(cursorX, cursorY);
            button.show();

            // Clicking on a flyout button or label is a lot like clicking on the
            // flyout background.
            this.listeners_.push(
                Blockly.bindEventWithChecks_(buttonSvg, 'mousedown', this, this.onMouseDown_)
            );
  
            this.buttons_.push(button);
            cursorY += button.height + gaps[index];
        }
    });
};

/**
 * Move the flyout to the edge of the workspace.
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
    // Consider the stroke thickness for spacing.
    if (this.stroke_thickness_ === undefined) {
        const css_style = window.getComputedStyle(this.svgBackground_);
        this.stroke_thickness_ = (css_style.stroke !== 'none' && parseInt(css_style.strokeWidth) || 0);
    }
    // Toolbox bounds shouldn't change, keep in memory instead of continuously accessing DOM.
    if (!this.toolbox_bounds_) {
        this.toolbox_bounds_ = this.parentToolbox_.HtmlDiv.getBoundingClientRect();
    }

    const fullscreenFlyoutHeight = targetWorkspaceMetrics.viewHeight - (this.toolbox_bounds_.top * 2);
    const toolboxFlyoutHeight = this.toolbox_bounds_.height + (this.MARGIN * 2) + (this.SCROLLBAR_PADDING * 2);
    const flyoutContentHeight = this.getMetrics_().contentHeight + (this.toolbox_bounds_.top * 2);

    this.height_ = Math.min(
        Math.max(toolboxFlyoutHeight, flyoutContentHeight),
        fullscreenFlyoutHeight
    );

    // edgeWidth and edgeHeight control the background SVG
    const edgeHeight =
        this.height_
        - (this.stroke_thickness_ * 2)
        - (this.CORNER_RADIUS * 2)
        - (this.toolbox_bounds_.top / 2);

    const edgeWidth =
        this.width_
        - (this.stroke_thickness_ * 2)
        - (this.CORNER_RADIUS * 2)
        - this.ARROW_SIZE
        - Blockly.Scrollbar.scrollbarThickness;
    
    this.setBackgroundPath_(edgeWidth, edgeHeight);

    // deriv-bot: Ensure flyout is rendered at same y-point as parent toolbox.
    const y = this.toolbox_bounds_.top;
    let x = 0;

    // If this flyout is the toolbox flyout.
    if (this.targetWorkspace_.toolboxPosition === this.toolboxPosition_) {
        // If there is a category toolbox.
        if (targetWorkspaceMetrics.toolboxWidth) {
            // deriv-bot: Allow for dynamic toolbox width, specifies where to position
            // the flyout.
            x = this.toolbox_bounds_.width + Blockly.BlockSvg.TAB_WIDTH;
        }
    } else {
        // Because the anchor point of the flyout is on the left, but we want
        // to align the right edge of the flyout with the right edge of the
        // blocklyDiv, we calculate the full width of the div minus the width
        // of the flyout.
        x = targetWorkspaceMetrics.viewWidth + targetWorkspaceMetrics.absoluteLeft - this.width_;
    }

    const svg_width = this.width_ - this.MARGIN + this.CORNER_RADIUS;
    const svg_height = this.height_  - this.MARGIN + this.CORNER_RADIUS;

    this.positionAt_(svg_width, svg_height, x, y);
};

/**
 * Compute width of flyout.  Position mat under each block.
 * @private
 */
Blockly.VerticalFlyout.prototype.reflowInternal_ = function() {
    this.workspace_.scale = this.targetWorkspace_.scale;
    let flyoutWidth = 0;

    this.workspace_.getTopBlocks(false).forEach(block => {
        let { width } = block.getHeightWidth();
        if (block.outputConnection) {
            width -= Blockly.BlockSvg.TAB_WIDTH;
        }
        flyoutWidth = Math.max(flyoutWidth, width);
    });

    this.buttons_.forEach(button => {
        flyoutWidth = Math.max(flyoutWidth, button.width);
    });

    // Consider workspace scale when calculating margin, also consider the category arrow.
    flyoutWidth += ((this.MARGIN * 1.5 / this.workspace_.scale) + Blockly.BlockSvg.TAB_WIDTH);
    flyoutWidth += (this.CORNER_RADIUS * 2);
    flyoutWidth *= this.workspace_.scale;
    flyoutWidth += this.ARROW_SIZE;
    flyoutWidth += Blockly.Scrollbar.scrollbarThickness;

    if (this.width_ !== flyoutWidth) {
        // Record the width for .getMetrics_ and .position.
        this.width_ = flyoutWidth;
        this.position();
    }
};

/**
 * Create and set the path for the visible boundaries of the flyout.
 * @param {number} width The width of the flyout, not including the rounded corners.
 * @param {number} height The height of the flyout, not including rounded corners.
 * @private
 */
Blockly.VerticalFlyout.prototype.setBackgroundPath_ = function(width, height) {
    const el_selected_category = this.parentToolbox_.selectedItem_.parentHtml_;
    const category_bounds = el_selected_category.getBoundingClientRect();

    // Starting position of the SVG
    const start_x = this.ARROW_SIZE + this.CORNER_RADIUS + this.stroke_thickness_;
    const start_y = this.stroke_thickness_;

    // Calculate the line between the each of the top & bottom rounded corners.
    const flyout_rectangle_width = Math.abs(width + this.ARROW_SIZE - this.MARGIN);
    const has_arrow = category_bounds.top < (height - this.ARROW_SIZE * 2);
    const path = [];

    path.push('M', start_x, start_y);
    path.push('h', flyout_rectangle_width);
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, this.CORNER_RADIUS, this.CORNER_RADIUS);
    path.push('v', height - this.CORNER_RADIUS);
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, -this.CORNER_RADIUS, this.CORNER_RADIUS);
    path.push('h', -flyout_rectangle_width);
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, -this.CORNER_RADIUS, -this.CORNER_RADIUS);

    if (has_arrow) {
        const bottom_to_arrow = category_bounds.top + (category_bounds.height / 2) - 3;

        path.push('V', bottom_to_arrow);
        path.push('l', -this.ARROW_SIZE, -this.ARROW_SIZE);
        path.push('l', this.ARROW_SIZE, -this.ARROW_SIZE);
    }

    path.push('V', this.stroke_thickness_ + this.CORNER_RADIUS);
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, this.CORNER_RADIUS, -this.CORNER_RADIUS);
    path.push('z');

    this.svgBackground_.setAttribute('d', path.join(' '));
};
