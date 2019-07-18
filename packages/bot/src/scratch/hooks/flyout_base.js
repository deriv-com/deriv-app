
import { translate } from '../../utils/lang/i18n';

/* eslint-disable func-names, no-underscore-dangle */

/**
 * Corner radius of the flyout background.
 * @type {number}
 * @const
 */
Blockly.Flyout.prototype.CORNER_RADIUS = 10;

/**
 * Margin around the edges of the blocks in the flyout.
 * @type {number}
 * @const
 */
Blockly.Flyout.prototype.MARGIN = 30;

/**
 * Top/bottom padding between scrollbar and edge of flyout background.
 * deriv-bot: Should be equal to CORNER_RADIUS
 * @type {number}
 * @const
 */
Blockly.Flyout.prototype.SCROLLBAR_PADDING = 20;

/**
 * The fraction of the distance to the scroll target to move the flyout on
 * each animation frame, when auto-scrolling. Values closer to 1.0 will make
 * the scroll animation complete faster. Use 1.0 for no animation.
 * @type {number}
 */
Blockly.Flyout.prototype.scrollAnimationFraction = 1.0;

/**
 * Update the view based on coordinates calculated in position().
 * @param {number} width The computed width of the flyout's SVG group
 * @param {number} height The computed height of the flyout's SVG group.
 * @param {number} x The computed x origin of the flyout's SVG group.
 * @param {number} y The computed y origin of the flyout's SVG group.
 * @protected
 */
Blockly.Flyout.prototype.positionAt_ = function (width, height, x, y) {
    this.svgGroup_.setAttribute('width', width);
    this.svgGroup_.setAttribute('height', height);

    if (this.svgGroup_.tagName === 'svg') {
        const transform = `translate(${x}px,${y}px)`;

        Blockly.utils.setCssTransform(this.svgGroup_, transform);
    } else {
        // IE and Edge don't support CSS transforms on SVG elements so
        // it's important to set the transform on the SVG element itself
        const transform = `translate(${x},${y})`;

        this.svgGroup_.setAttribute('transform', transform);
    }

    // Update the scrollbar (if one exists).
    if (this.scrollbar_) {
        const newX = x - this.ARROW_SIZE;

        // Set the scrollbars origin to be the top left of the flyout.
        this.scrollbar_.setOrigin(newX, y);
        this.scrollbar_.resize();

        // Set the position again so that if the metrics were the same (and the
        // resize failed) our position is still updated.
        this.scrollbar_.setPosition_(this.scrollbar_.position_.x, this.scrollbar_.position_.y);
    }
};

/**
 * Get the width of the flyout.
 * @return {number} The width of the flyout.
 * deriv-bot: Return actual width rather than this.DEFAULT_WIDTH.
 */
Blockly.Flyout.prototype.getWidth = function () {
    return this.width_;
};

const addSearchFlyout = (callback, xmlList, flyout) => {
    let xml_search_list = xmlList;
    if (xmlList.type === 'search') {
        const blocks = xmlList.blocks;
        const fn_blocks = xmlList.fn_blocks;
        const var_blocks = xmlList.var_blocks;
        const no_result = !blocks.length
            && !Object.keys(fn_blocks).length
            && !Object.keys(var_blocks.blocks).length;

        xml_search_list = [];

        if (no_result) {
            const label = document.createElement('label');
            label.setAttribute('text', translate('No Blocks Found'));

            xml_search_list.push(label);
        } else {
            const label = document.createElement('label');
            label.setAttribute('text', translate('Result(s)'));
            
            xml_search_list.push(label);
        }

        if (Object.keys(fn_blocks).length) {
            const func_xml_list = Blockly.Procedures.flyoutCategory(flyout.workspace_);

            xml_search_list = xml_search_list.concat(func_xml_list);
        }

        if (Object.keys(var_blocks).length) {
            const var_xml_list = Blockly.DataCategory.search(var_blocks.blocks, var_blocks.blocks_type);

            xml_search_list = xml_search_list.concat(var_xml_list);
        }

        xml_search_list = xml_search_list.concat(blocks);
    }

    callback(xml_search_list);
};

const originalFlyoutShowFn = Blockly.Flyout.prototype.show;
Blockly.Flyout.prototype.show = function (xmlList) {
    addSearchFlyout(originalFlyoutShowFn.bind(this), xmlList, this);
};
