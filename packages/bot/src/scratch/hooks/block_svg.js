import { localize } from 'deriv-translations';
import ScratchStore from '../../stores/scratch-store';

/* eslint-disable func-names, no-underscore-dangle */

/**
 * Select this block.  Highlight it visually.
 */
Blockly.BlockSvg.prototype.addSelect = function() {
    if (!this.isInFlyout) {
        const { flyout } = ScratchStore.instance;
        flyout.setVisibility(false);
        Blockly.utils.addClass(/** @type {!Element} */ (this.svgGroup_), 'blocklySelected');
    }
};

/**
 * Set whether the block is disabled or not.
 * @param {boolean} disabled True if disabled.
 * deriv-bot: Call updateDisabled() when setDisabled is called.
 */
Blockly.BlockSvg.prototype.setDisabled = function(disabled) {
    if (this.disabled !== disabled) {
        Blockly.BlockSvg.superClass_.setDisabled.call(this, disabled);
        if (this.rendered) {
            this.updateDisabled();
        }
    }
};

/**
 * Enable or disable a block.
 */
Blockly.BlockSvg.prototype.updateDisabled = function() {
    if (this.disabled || this.getInheritedDisabled()) {
        const added = Blockly.utils.addClass(/** @type {!Element} */ (this.svgGroup_), 'blocklyDisabled');
        if (added) {
            this.svgPath_.setAttribute('fill', `url(#${this.workspace.options.disabledPatternId})`);
        }
    } else {
        const removed = Blockly.utils.removeClass(/** @type {!Element} */ (this.svgGroup_), 'blocklyDisabled');
        if (removed) {
            this.updateColour();
        }
    }
    const children = this.getChildren(false);
    children.forEach(child => {
        child.updateDisabled();
    });
};

/**
 * Show the context menu for this block.
 * @param {!Event} e Mouse event.
 * @private
 * deriv-bot: Restore contextMenu options from Blockly unavailable in Scratch
 */
Blockly.BlockSvg.prototype.showContextMenu_ = function(e) {
    if (this.workspace.options.readOnly || !this.contextMenu) {
        return;
    }
    // Save the current block in a variable for use in closures.
    const block = this;
    const menuOptions = [];

    if (this.isDeletable() && this.isMovable() && !block.isInFlyout) {
        menuOptions.push(Blockly.ContextMenu.blockDuplicateOption(block, e));

        if (this.isEditable() && this.workspace.options.comments) {
            menuOptions.push(Blockly.ContextMenu.blockCommentOption(block));
        }

        menuOptions.push(Blockly.ContextMenu.blockDeleteOption(block));
    } else if (this.parentBlock_ && this.isShadow_) {
        this.parentBlock_.showContextMenu_(e);
        return;
    }

    // Option to collapse/expand block.
    if (this.workspace.options.collapse) {
        if (this.collapsed_) {
            const expandOption = { enabled: true };
            expandOption.text = localize('Expand Block');
            expandOption.callback = function() {
                block.setCollapsed(false);
            };
            menuOptions.push(expandOption);
        } else {
            const collapseOption = { enabled: true };
            collapseOption.text = localize('Collapse Block');
            collapseOption.callback = function() {
                block.setCollapsed(true);
            };
            menuOptions.push(collapseOption);
        }
    }

    // Option to disable/enable block.
    if (this.workspace.options.disable) {
        const disableOption = {
            text   : this.disabled ? localize('Enable Block') : localize('Disable Block'),
            enabled: !this.getInheritedDisabled(),
            callback() {
                const group = Blockly.Events.getGroup();

                if (!group) {
                    Blockly.Events.setGroup(true);
                }

                block.setDisabled(!block.disabled);

                if (!group) {
                    Blockly.Events.setGroup(false);
                }
            },
        };
        menuOptions.push(disableOption);

        // Allow the block to add or modify menuOptions.
        if (this.customContextMenu) {
            this.customContextMenu(menuOptions);
        }

        Blockly.ContextMenu.show(e, menuOptions, this.RTL);
        Blockly.ContextMenu.currentBlock = this;
    }
};

/**
 * Set whether the block is error highlighted or not.
 * @param {boolean} highlighted True if highlighted for error.
 */
Blockly.BlockSvg.prototype.setErrorHighlighted = function(should_be_error_highlighted) {
    if (this.is_error_highlighted === should_be_error_highlighted) {
        return;
    }

    const highlight_class = 'block--error-highlighted';

    if (should_be_error_highlighted) {
        // Below function does its own checks to check if class already exists.
        Blockly.utils.addClass(this.svgGroup_, highlight_class);
    } else {
        Blockly.utils.removeClass(this.svgGroup_, highlight_class);
    }

    this.is_error_highlighted = should_be_error_highlighted;
};

/**
 * Set whether the block is collapsed or not.
 * @param {boolean} collapsed True if collapsed.
 */
Blockly.BlockSvg.prototype.setCollapsed = function(collapsed) {
    if (this.collapsed_ === collapsed) {
        return;
    }

    const render_list          = [];
    const COLLAPSED_INPUT_NAME = '_TEMP_COLLAPSED_INPUT';

    // Show/hide the inputs.
    this.inputList.forEach(input => render_list.push(...input.setVisible(!collapsed)));

    if (collapsed) {
        const icons = this.getIcons();
        icons.forEach(icon => icon.setVisible(false));

        const text = this.toString(Blockly.COLLAPSE_CHARS);
        this.appendDummyInput(COLLAPSED_INPUT_NAME).appendField(text).init();
    } else {
        this.removeInput(COLLAPSED_INPUT_NAME);
        this.setWarningText(null); // Clear any warnings inherited from enclosed blocks.
    }

    Blockly.BlockSvg.superClass_.setCollapsed.call(this, collapsed);
  
    if (!render_list.length) {
        render_list.push(this); // No child blocks, just render this block.
    }

    if (this.rendered) {
        render_list.forEach(block => block.render());
        // Don't bump neighbours.
        // Although bumping neighbours would make sense, users often collapse
        // all their functions and store them next to each other.  Expanding and
        // bumping causes all their definitions to go out of alignment.
    }

    // Check whether the collapsed block needs to be highlighted.
    this.setErrorHighlighted(collapsed && this.hasErrorHighlightedDescendant());
};
