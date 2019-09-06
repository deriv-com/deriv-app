import { purchase }          from '../../images';
import { setBlockTextColor } from '../../../utils';
import { translate }         from '../../../../utils/lang/i18n';

Blockly.Blocks.before_purchase = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: translate('%1 (2) Purchase conditions %2'),
            message1: '%1',
            args0   : [
                {
                    type  : 'field_image',
                    src   : purchase,
                    width : 25,
                    height: 25,
                    alt   : 'P',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type : 'input_statement',
                    name : 'BEFOREPURCHASE_STACK',
                    check: 'Purchase',
                },
            ],
            colour         : '#2a3052',
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Specify contract type and purchase conditions.'),
            category       : Blockly.Categories.Before_Purchase,
        };
    },
    meta(){
        return {
            'display_name': translate('Purchase conditions'),
            'description' : translate('This block is mandatory, it allows you to specify contract type and purchase conditions.'),
        };
    },
    onchange(event) {
        setBlockTextColor(this);
        if (!this.workspace || this.isInFlyout) {
            return;
        }

        // Maintain single instance of this block
        if (event.type === Blockly.Events.BLOCK_CREATE) {
            if (event.ids && event.ids.includes(this.id)) {
                this.workspace.getAllBlocks(true).forEach(block => {
                    if (block.type === this.type && block.id !== this.id) {
                        block.dispose();
                    }
                });
            }
        }
    },
};

Blockly.JavaScript.before_purchase = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'BEFOREPURCHASE_STACK');

    const code = `BinaryBotPrivateBeforePurchase = function BinaryBotPrivateBeforePurchase() {
        ${stack}
    };\n`;
    return code;
};
