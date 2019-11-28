import { localize }               from 'deriv-translations';
import { getContractTypeOptions } from '../../../shared';

Blockly.Blocks.purchase = {
    init() {
        this.jsonInit(this.definition());

        // Ensure one of this type per statement-stack
        this.setNextStatement(false);
    },
    definition() {
        return {
            message0: localize('Purchase %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'PURCHASE_LIST',
                    options: [['', '']],
                },
            ],
            previousStatement: null,
            colour           : Blockly.Colours.Special1.colour,
            colourSecondary  : Blockly.Colours.Special1.colourSecondary,
            colourTertiary   : Blockly.Colours.Special1.colourTertiary,
            tooltip          : localize('This block purchases contract of a specified type.'),
            category         : Blockly.Categories.Before_Purchase,
        };
    },
    meta() {
        return {
            'display_name': localize('Purchase'),
            'description' : localize('Use this block to purchase the specific contract you want. You may add multiple Purchase blocks together with conditional blocks to define your purchase conditions. This block can only be used within the Purchase conditions block.'),
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        this.enforceLimitations();

        if (event.type === Blockly.Events.BLOCK_CHANGE) {
            if (event.name === 'TYPE_LIST' || event.name === 'TRADETYPE_LIST') {
                this.populatePurchaseList(event);
            }
        } else if (event.type === Blockly.Events.END_DRAG && event.blockId === this.id) {
            const purchase_type_list = this.getField('PURCHASE_LIST');
            const purchase_options   = purchase_type_list.menuGenerator_; // eslint-disable-line

            if (purchase_options[0][0] === '') {
                this.populatePurchaseList(event);
            }
        }
    },
    populatePurchaseList(event) {
        const trade_definition_block = this.workspace.getAllBlocks(true).find(block =>
            block.type === 'trade_definition'
        );

        if (!trade_definition_block) {
            return;
        }

        const trade_type_block      = trade_definition_block.getChildByType('trade_definition_tradetype');
        const trade_type            = trade_type_block.getFieldValue('TRADETYPE_LIST');
        const contract_type_block   = trade_definition_block.getChildByType('trade_definition_contracttype');
        const contract_type         = contract_type_block.getFieldValue('TYPE_LIST');
        const purchase_type_list    = this.getField('PURCHASE_LIST');
        const purchase_type         = purchase_type_list.getValue();
        const contract_type_options = getContractTypeOptions(contract_type, trade_type);

        purchase_type_list.updateOptions(contract_type_options, {
            default_value: purchase_type,
            event_group  : event.group,
        });
    },
    enforceLimitations() {
        const top_parent = this.getTopParent();

        if (top_parent) {
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

Blockly.JavaScript.purchase = block => {
    const purchaseList = block.getFieldValue('PURCHASE_LIST');

    const code = `Bot.purchase('${purchaseList}');\n`;
    return code;
};
