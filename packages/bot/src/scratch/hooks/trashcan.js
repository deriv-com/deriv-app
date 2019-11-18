const trashcan_margin    = 40;
const core_footer_height = 36;

/**
 * Distance between trashcan and bottom edge of workspace.
 * @type {number}
 * @private
 */
Blockly.Trashcan.prototype.MARGIN_BOTTOM_ = trashcan_margin + core_footer_height; // eslint-disable-line

/**
 * Distance between trashcan and right edge of workspace.
 * @type {number}
 * @private
 */
Blockly.Trashcan.prototype.MARGIN_SIDE_ = trashcan_margin; // eslint-disable-line

/**
 * Inspect the contents of the trash.
 * deriv-bot: Noop for us, restore original functionality when trashcan can be inspected.
 */
Blockly.Trashcan.prototype.click = function() {};
  
