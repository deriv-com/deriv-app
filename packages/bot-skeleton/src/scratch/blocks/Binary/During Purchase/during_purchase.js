import { localize } from '@deriv/translations';
import { sellContract } from '../../images';

Blockly.Blocks.during_purchase = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1 %2 %3',
            message1: '%1',
            args0: [
                {
                    type: 'field_image',
                    src: sellContract,
                    width: 25,
                    height: 25,
                    alt: 'S',
                },
                {
                    type: 'field_label',
                    text: localize('3. Sell conditions'),
                    class: 'blocklyTextRootBlockHeader',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'DURING_PURCHASE_STACK',
                    check: 'SellAtMarket',
                },
            ],
            colour: Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary: Blockly.Colours.RootBlock.colourTertiary,
            tooltip: localize('Sell your active contract if needed (optional)'),
            category: Blockly.Categories.During_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Sell conditions'),
            description: localize(
                'Here is where you can decide to sell your contract before it expires. Only one copy of this block is allowed.'
            ),
        };
    },
};

Blockly.JavaScript.during_purchase = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'DURING_PURCHASE_STACK');

    const code = `BinaryBotPrivateDuringPurchase = function BinaryBotPrivateDuringPurchase() {
        Bot.highlightBlock('${block.id}');
        ${stack}
    };\n`;
    return code;
};
