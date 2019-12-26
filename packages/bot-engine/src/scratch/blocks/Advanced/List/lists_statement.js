import { localize }      from 'deriv-translations';
import { minusIconDark } from '../../images';

Blockly.Blocks.lists_statement = {
    init() {
        this.requiredParentId = '';

        this.jsonInit(this.definition());

        // Render a ➖-icon for removing self
        const fieldImage = new Blockly.FieldImage(minusIconDark, 25, 25, '', () => this.onIconClick());
        this.appendDummyInput('REMOVE_ICON').appendField(fieldImage);
    },
    definition(){
        return {
            message0: '%1',
            args0   : [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : localize('List Statement Tooltip'),
            category         : Blockly.Categories.List,
        };
    },
    meta(){
        return {
            'display_name': localize('List Statement'),
            'description' : localize('List Statement Description'),
        };
    },
    onIconClick() {
        if (!this.workspace || this.isInFlyout) {
            return;
        }

        this.unplug(true);
        this.dispose();
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.END_DRAG) {
            const { recordUndo }  = Blockly.Events;
            const surround_parent = this.getSurroundParent();

            if (!surround_parent) {
                // No parent, dispose.
                Blockly.Events.recordUndo = false;
                this.dispose(true);
                Blockly.Events.recordUndo = recordUndo;
            } else if (!this.requiredParentId && surround_parent.type === this.required_parent_type) {
                // Legal parent, but not yet related, set connection.
                this.requiredParentId = surround_parent.id;
            } else if (surround_parent.id !== this.requiredParentId) {
                // Illegal parent, dispose.
                Blockly.Events.recordUndo = false;

                this.unplug(false);
                
                const all_blocks   = this.workspace.getAllBlocks();
                const parent_block = all_blocks.find(block => block.id === this.requiredParentId);

                if (parent_block) {
                    const parent_connection = parent_block.getLastConnectionInStatement('STACK');
                    parent_connection.connect(this.previousConnection);
                } else {
                    this.dispose(true);
                }

                Blockly.Events.recordUndo = recordUndo;
            }
        }
    },
    required_parent_type: 'lists_create_with',
};

Blockly.JavaScript.lists_statement = block => {
    const code = Blockly.JavaScript.valueToCode(block, 'VALUE') || 'null';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
