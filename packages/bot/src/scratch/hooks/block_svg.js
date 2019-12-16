import { localize } from 'deriv-translations';
import { save }     from '../utils';
import ScratchStore from '../../stores/scratch-store';

// deriv-bot: Blockly value, Scratch resets this to 0, req for correct spacing in flyout.
Blockly.BlockSvg.TAB_WIDTH = 8;

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
 * deriv-bot: Update fill path if it doesn't match the disabledPatternId.
 */
Blockly.BlockSvg.prototype.updateDisabled = function() {
    if (this.disabled || this.getInheritedDisabled()) {
        Blockly.utils.addClass(this.svgGroup_, 'blocklyDisabled');
        
        const fill = `url(#${this.workspace.options.disabledPatternId})`;
        if (this.svgPath_.getAttribute('fill') !== fill) {
            this.svgPath_.setAttribute('fill', fill);
        }
    } else {
        const removed = Blockly.utils.removeClass(this.svgGroup_, 'blocklyDisabled');
        if (removed) {
            this.updateColour();
        }
    }

    const children = this.getChildren(false);
    children.forEach(child => child.updateDisabled());
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
    const block        = this;
    const menu_options = [];

    if (this.isDeletable() && this.isMovable() && !block.isInFlyout) {
        menu_options.push(Blockly.ContextMenu.blockDuplicateOption(block, e));

        if (this.isEditable() && this.workspace.options.comments) {
            menu_options.push(Blockly.ContextMenu.blockCommentOption(block));
        }

        menu_options.push(Blockly.ContextMenu.blockDeleteOption(block));
    } else if (this.parentBlock_ && this.isShadow_) {
        this.parentBlock_.showContextMenu_(e);
        return;
    }

    // Option to collapse/expand block.
    if (this.workspace.options.collapse) {
        if (this.collapsed_) {
            const expand_option = { enabled: true };
            expand_option.text = localize('Expand Block');
            expand_option.callback = () => block.setCollapsed(false);
            menu_options.push(expand_option);
        } else {
            const collapse_option = { enabled: true };
            collapse_option.text = localize('Collapse Block');
            collapse_option.callback = () => block.setCollapsed(true);
            menu_options.push(collapse_option);
        }
    }

    // Option to disable/enable block.
    if (this.workspace.options.disable) {
        const disable_option = {
            text    : this.disabled ? localize('Enable Block') : localize('Disable Block'),
            enabled : !this.getInheritedDisabled(),
            callback: () => {
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
        menu_options.push(disable_option);
    }

    // Option to download block.
    if (this.isMovable()) {
        menu_options.push({
            text    : localize('Download block'),
            enabled : true,
            callback: () => {
                const xml            = Blockly.Xml.textToDom('<xml/>');
                const has_next_block = block.nextConnection && block.nextConnection.isConnected();
                const file_name      = `${block.type}${has_next_block ? `_${localize('stack')}` : ''}`;

                xml.appendChild(Blockly.Xml.blockToDom(block));
                save(
                    /* filename */ file_name,
                    /* collection */ true,
                    /* xmlDom */ xml
                );
            },
        });
    }

    menu_options.push({
        text    : localize('DEV: Render'),
        enabled : true,
        callback: () => block.render(),
    });

    menu_options.push({
        text    : localize('DEV: Init Svg'),
        enabled : true,
        callback: () => block.updateDisabled(),
    });
    
    // Allow the block to add or modify menu_options.
    if (this.customContextMenu) {
        this.customContextMenu(menu_options);
    }

    Blockly.ContextMenu.show(e, menu_options, this.RTL);
    Blockly.ContextMenu.currentBlock = this;
};
