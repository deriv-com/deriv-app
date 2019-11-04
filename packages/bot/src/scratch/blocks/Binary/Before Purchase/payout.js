import { localize }           from 'deriv-translations/lib/i18n';
import { getPurchaseChoices } from '../../../shared';

Blockly.Blocks.payout = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('Payout %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'PURCHASE_LIST',
                    options: getPurchaseChoices,
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block returns the potential payout for the selected trade type'),
            category       : Blockly.Categories.Before_Purchase,
        };
    },
    meta(){
        return {
            'display_name': localize('Potential payout'),
            'description' : localize('This block returns the potential payout for the selected trade type. This block can be used only in the "Purchase conditions" root block.'),
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CREATE || event.type === Blockly.Events.END_DRAG) {
            if (this.isDescendantOf('before_purchase')) {
                if (this.disabled) {
                    this.setDisabled(false);
                }
            } else if (!this.disabled) {
                this.setDisabled(true);
            }
        }
    },
};

Blockly.JavaScript.payout = block => {
    const purchaseList = block.getFieldValue('PURCHASE_LIST');

    const code = `Bot.getPayout('${purchaseList}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
