import { localize }      from 'deriv-translations';
import { minusIconDark } from '../../images';
import {
    runIrreversibleEvents,
    runGroupedEvents,
}                        from '../../../utils';

Blockly.Blocks.lists_statement = {
    init() {
        this.required_parent_id = '';
        const field_image       = new Blockly.FieldImage(minusIconDark, 25, 25, '', () => this.onIconClick());
        this.jsonInit(this.definition());
        this.appendDummyInput('REMOVE_ICON').appendField(field_image);
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

        runGroupedEvents(false, () => {
            this.unplug(true);
            this.dispose();
        });
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.END_DRAG) {
            const surround_parent = this.getSurroundParent();

            if (!surround_parent) {
                runIrreversibleEvents(() => {
                    this.dispose();
                });
            } else if (!this.required_parent_id && surround_parent.type === 'lists_create_with') {
                // Create connection between parent and orphaned child.
                this.required_parent_id = surround_parent.id;
            } else if (surround_parent.id !== this.required_parent_id) {
                runIrreversibleEvents(() => {
                    // Dispose child if it became a child of an illegal parent.
                    this.dispose(/* healStack */ true);
                });
            }
        }
    },
};

Blockly.JavaScript.lists_statement = block => {
    const code = Blockly.JavaScript.valueToCode(block, 'VALUE') || 'null';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
