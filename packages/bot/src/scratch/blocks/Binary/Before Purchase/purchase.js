import { getPurchaseChoices, updatePurchaseChoices } from '../../../shared';
import { translate }                                 from '../../../../utils/lang/i18n';

Blockly.Blocks.purchase = {
    init() {
        this.jsonInit(this.definition());

        // Ensure one of this type per statement-stack
        this.setNextStatement(false);
    },
    definition(){
        return {
            message0: translate('Purchase %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'PURCHASE_LIST',
                    options: getPurchaseChoices,
                },
            ],
            previousStatement: null,
            colour           : Blockly.Colours.Special1.colour,
            colourSecondary  : Blockly.Colours.Special1.colourSecondary,
            colourTertiary   : Blockly.Colours.Special1.colourTertiary,
            tooltip          : translate('This block purchases contract of a specified type.'),
            category         : Blockly.Categories.Before_Purchase,
        };
    },
    meta(){
        return {
            'display_name': translate('Puchase'),
            'description' : translate('You can use this block to purchase the contract of a specific type you define in the Trade Parameters block. You can add multiple Purchase blocks in conjunction with conditional blocks to define purchase conditions. You can use this block only within the Purchase conditions block.'),
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
        } else if (event.type === Blockly.Events.BLOCK_CHANGE || Blockly.Events.BLOCK_CREATE) {
            const tradeDefinitionBlock = this.workspace
                .getAllBlocks(true)
                .find(block => block.type === 'trade_definition');

            if (!tradeDefinitionBlock) {
                return;
            }

            const tradeTypeBlock = tradeDefinitionBlock.getChildByType('trade_definition_tradetype');
            if (!tradeTypeBlock) {
                return;
            }

            const tradeType = tradeTypeBlock.getFieldValue('TRADETYPE_LIST');
            const contractTypeBlock = tradeDefinitionBlock.getChildByType('trade_definition_contracttype');
            const contractType = contractTypeBlock.getFieldValue('TYPE_LIST');
            const oppositesName = tradeType.toUpperCase();

            if (tradeType && contractType && oppositesName) {
                updatePurchaseChoices(contractType, oppositesName);
            }
        }
    },
};

Blockly.JavaScript.purchase = block => {
    const purchaseList = block.getFieldValue('PURCHASE_LIST');

    const code = `Bot.purchase('${purchaseList}');\n`;
    return code;
};
