import { getPurchaseChoices } from '../../../shared';
import { translate }          from '../../../../utils/lang/i18n';

Blockly.Blocks.ask_price = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('Ask Price %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'PURCHASE_LIST',
                    options: getPurchaseChoices,
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('This block returns purchase price for the selected trade type.'),
            category       : Blockly.Categories.Before_Purchase,
        };
    },
    meta(){
        return {
            'display_name': translate('Purchase Price'),
            'description' : translate('This block returns purchase price for the selected trade type. This block can be used only in the "Purchase conditions" root blocks.'),
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

Blockly.JavaScript.ask_price = block => {
    const purchaseList = block.getFieldValue('PURCHASE_LIST');

    const code = `Bot.getAskPrice('${purchaseList}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
