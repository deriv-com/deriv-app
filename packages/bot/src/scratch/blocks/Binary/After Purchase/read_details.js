import { localize } from 'deriv-translations';
import config       from '../../../../constants';

Blockly.Blocks.read_details = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('Contract Details: %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'DETAIL_INDEX',
                    options: config.lists.DETAILS,
                },
            ],
            output         : null,
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND, // TODO: Investigate why block glitches in square shape.
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Reads a selected property from contract details list'),
            category       : Blockly.Categories.After_Purchase,
        };
    },
    meta(){
        return {
            'display_name': localize('Contract details'),
            'description' : localize('This block gives you information about your last contract.'),

        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CREATE || event.type === Blockly.Events.END_DRAG) {
            if (this.isDescendantOf('after_purchase')) {
                if (this.disabled) {
                    this.setDisabled(false);
                }
            } else if (!this.disabled) {
                this.setDisabled(true);
            }
        }
    },
};

Blockly.JavaScript.read_details = block => {
    const detailIndex = block.getFieldValue('DETAIL_INDEX');

    const code = `Bot.readDetails(${detailIndex})`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
