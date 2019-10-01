import { sellContract }      from '../../images';
import { setBlockTextColor } from '../../../utils';
import { translate }         from '../../../../utils/lang/i18n';

Blockly.Blocks.during_purchase = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('%1 3. Sell conditions %2'),
            message1: '%1',
            args0   : [
                {
                    type  : 'field_image',
                    src   : sellContract,
                    width : 25,
                    height: 25,
                    alt   : 'S',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type : 'input_statement',
                    name : 'DURING_PURCHASE_STACK',
                    check: 'SellAtMarket',
                },
            ],
            colour         : Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary : Blockly.Colours.RootBlock.colourTertiary,
            tooltip        : translate(
                'Sell your active contract if needed (optional)'
            ),
            category: Blockly.Categories.During_Purchase,
        };
    },
    meta(){
        return {
            'display_name': translate('Sell conditions'),
            'description' : translate('This block allows you to specify conditions for selling your purchased contract before its expiration.'),
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

Blockly.JavaScript.during_purchase = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'DURING_PURCHASE_STACK');

    const code = `BinaryBotPrivateDuringPurchase = function BinaryBotPrivateDuringPurchase() {
        ${stack}
    };\n`;
    return code;
};
