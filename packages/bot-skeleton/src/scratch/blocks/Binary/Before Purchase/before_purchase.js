import { localize } from '@deriv/translations';
import { purchase } from '../../images';

Blockly.Blocks.before_purchase = {
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
                    src: purchase,
                    width: 25,
                    height: 25,
                    alt: 'P',
                },
                {
                    type: 'field_label',
                    text: localize('2. Purchase conditions'),
                    class: 'blocklyTextRootBlockHeader',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'BEFOREPURCHASE_STACK',
                    check: 'Purchase',
                },
            ],
            colour: Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary: Blockly.Colours.RootBlock.colourTertiary,
            tooltip: localize('Specify contract type and purchase conditions.'),
            category: Blockly.Categories.Before_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Purchase conditions'),
            description: localize(
                'This block is mandatory. Only one copy of this block is allowed. You can place the Purchase block (see below) here as well as conditional blocks to define your purchase conditions.'
            ),
        };
    },
};

Blockly.JavaScript.before_purchase = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'BEFOREPURCHASE_STACK');

    const code = `BinaryBotPrivateBeforePurchase = function BinaryBotPrivateBeforePurchase() {
        Bot.highlightBlock('${block.id}');
        ${stack}
    };\n`;
    return code;
};
