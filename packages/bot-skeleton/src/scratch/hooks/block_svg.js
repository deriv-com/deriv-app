import { localize } from '@deriv/translations';
import DBotStore from '../dbot-store';
import debounce from 'lodash.debounce';

/**
 * Select this block.  Highlight it visually.
 */
const addClass = (element, className) => {
    const classNames = className.split(' ');
    if (classNames.every(name => element.classList.contains(name))) {
        return false;
    }
    element.classList.add(...classNames);
    return true;
};

Blockly.BlockSvg.prototype.addSelect = function () {
    if (!Blockly.derivWorkspace.isFlyout_) {
        const { flyout } = DBotStore.instance;
        if (flyout) {
            flyout.setVisibility(false);
        }

        addClass(/** @type {!Element} */ (this.svgGroup_), 'blocklySelected');
    }
};

/**
 * Set whether the block is disabled or not.
 * @param {boolean} disabled True if disabled.
 * @deriv/bot: Call updateDisabled() when setDisabled is called.
 */
Blockly.BlockSvg.prototype.setDisabled = function (disabled) {
    this.disabled = disabled;
    this.updateDisabled();
};

/**
 * Enable or disable a block.
 * @deriv/bot: Update fill path if it doesn't match the disabledPatternId.
 */
Blockly.BlockSvg.prototype.updateDisabled = function () {
    if (this.disabled || this.getInheritedDisabled()) {
        addClass(this.svgGroup_, 'blocklyDisabled');

        const fill = `url(#${this.workspace.options.disabledPatternId})`;
        if (this.svgGroup_.getAttribute('fill') !== fill) {
            this.svgGroup_.setAttribute('fill', fill);
        }
    } else {
        Blockly.utils.dom.removeClass(this.svgGroup_, 'blocklyDisabled');
    }

    const children = this.getChildren(false);
    children.forEach(child => child.updateDisabled());
};

/**
 * Set whether the block is error highlighted or not.
 * @param {boolean} highlighted True if highlighted for error.
 */
Blockly.BlockSvg.prototype.setErrorHighlighted = function (
    should_be_error_highlighted,
    error_message = localize(
        'The block(s) highlighted in red are missing input values. Please update them and click "Run bot".'
    )
) {
    if (this.is_error_highlighted === should_be_error_highlighted) {
        return;
    }

    const highlight_class = 'block--error-highlighted';

    if (should_be_error_highlighted) {
        // Below function does its own checks to check if class already exists.
        addClass(this.svgGroup_, highlight_class);
    } else {
        Blockly.utils.dom.removeClass(this.svgGroup_, highlight_class);
    }

    this.is_error_highlighted = should_be_error_highlighted;
    this.error_message = error_message;
};

// Highlight the block that is being executed
Blockly.BlockSvg.prototype.highlightExecutedBlock = function () {
    const highlight_block_class = 'block--execution-highlighted';
    const hasClass = (element, className) => element.classList.contains(className);
    const addClass = (element, className) => {
        const classNames = className.split(' ');
        if (classNames.every(name => element.classList.contains(name))) {
            return false;
        }
        element.classList.add(...classNames);
        return true;
    };
    if (!hasClass(this.svgGroup_, highlight_block_class)) {
        addClass(this.svgGroup_, highlight_block_class);
        setTimeout(() => {
            if (this.svgGroup_) {
                Blockly.utils.dom.removeClass(this.svgGroup_, highlight_block_class);
            }
        }, 1505);
    }
};

/**
 * Set block animation (Blink)
 */

Blockly.BlockSvg.prototype.blink = function () {
    const blink_class = 'block--blink';
    addClass(this.svgGroup_, blink_class);

    setTimeout(() => {
        Blockly.utils.dom.removeClass(this.svgGroup_, blink_class);
    }, 2000);
};

/**
 * Set whether the block is collapsed or not.
 * @param {boolean} collapsed True if collapsed.
 */

/**
 * Toggles the collapse state of the block after a short delay to prevent workspace freezing.
 * @param {boolean} collapsed - Whether to collapse the block.
 */
Blockly.BlockSvg.prototype.toggleCollapseWithDelay = function (collapsed) {
    debounce(async () => {
        this.setCollapsed(collapsed);
    }, 100)();
};
