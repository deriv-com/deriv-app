/* eslint-disable */

/**
 * Scroll the workspace to center on the given block.
 * @param {?string} id ID of block center on.
 * @public
 */
Blockly.WorkspaceSvg.prototype.centerOnBlock = function(id, hideChaff = true) {
    if (!this.scrollbar) {
        console.warn('Tried to scroll a non-scrollable workspace.');
        return;
    }

    var block = this.getBlockById(id);
    if (!block) {
        return;
    }

    // XY is in workspace coordinates.
    var xy = block.getRelativeToSurfaceXY();
    // Height/width is in workspace units.
    var heightWidth = block.getHeightWidth();

    // Find the enter of the block in workspace units.
    var blockCenterY = xy.y + heightWidth.height / 2;

    // In RTL the block's position is the top right of the block, not top left.
    var multiplier = this.RTL ? -1 : 1;
    var blockCenterX = xy.x + (multiplier * heightWidth.width / 2);

    // Workspace scale, used to convert from workspace coordinates to pixels.
    var scale = this.scale;

    // Center in pixels.  0, 0 is at the workspace origin.  These numbers may
    // be negative.
    var pixelX = blockCenterX * scale;
    var pixelY = blockCenterY * scale;

    var metrics = this.getMetrics();

    // Scrolling to here would put the block in the top-left corner of the
    // visible workspace.
    var scrollToBlockX = pixelX - metrics.contentLeft;
    var scrollToBlockY = pixelY - metrics.contentTop;

    // viewHeight and viewWidth are in pixels.
    var halfViewWidth = metrics.viewWidth / 2;
    var halfViewHeight = metrics.viewHeight / 2;

    // Put the block in the center of the visible workspace instead.
    var scrollToCenterX = scrollToBlockX - halfViewWidth;
    var scrollToCenterY = scrollToBlockY - halfViewHeight;

    if (hideChaff) {
        Blockly.hideChaff();
    }

    this.scrollbar.set(scrollToCenterX, scrollToCenterY);
};

/**
 * Creates a copy of passed block_node on main workspace and positions it
 * below the lowest block on the canvas.
 * @static
 * @param {Element} block_node
 * @public
 */
Blockly.WorkspaceSvg.prototype.addBlockNode = function (block_node) {
    const block = Blockly.Xml.domToBlock(block_node, this);
    const top_blocks = this.getTopBlocks(true);

    if (top_blocks.length) {
        const last_block = top_blocks[top_blocks.length - 1];
        const last_block_xy = last_block.getRelativeToSurfaceXY();
        const extra_spacing = (last_block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0);
        const y = last_block_xy.y + last_block.getHeightWidth().height + extra_spacing + 30;

        block.moveBy(last_block_xy.x, y);
    }

    if (/^procedures_/.test(block_node.getAttribute('type'))) {
        const toolbox = this.toolbox_;
        toolbox.refreshCategory();
    }

    this.centerOnBlock(block.id, false);
}

Blockly.WorkspaceSvg.prototype.reshowFlyout = function () {
    const toolbox = this.toolbox_;
    toolbox.refreshCategory();
}
