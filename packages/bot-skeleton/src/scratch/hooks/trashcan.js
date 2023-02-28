export const initTrashCan = (margin = 16, height = 36) => {
    /**
     * Distance between trashcan and bottom edge of workspace.
     * @type {number}
     * @private
     */
    Blockly.Trashcan.prototype.MARGIN_BOTTOM_ = margin * 2 + height; // eslint-disable-line

    /**
     * Distance between trashcan and right edge of workspace.
     * @type {number}
     * @private
     */
    Blockly.Trashcan.prototype.MARGIN_SIDE_ = margin; // eslint-disable-line

    /**
     * Inspect the contents of the trash.
     * @deriv/bot: Noop for us, restore original functionality when trashcan can be inspected.
     */
    Blockly.Trashcan.prototype.click = function () {};

    window.dispatchEvent(new Event('resize')); // trigger UI update
};
